import { Router } from "express"
import { Hospital } from "../modelo/hospital.js"
import { insertar, editar } from '../validacion/hospital.js'
import multer from "multer"
import fs from 'fs'

import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Solicitud } from "../modelo/solicitud.js"
import { DB_DATABASE, DB_PASSWORD, DB_USER } from '../config.js'
import { exec } from "child_process"


const __dirname = dirname(fileURLToPath(import.meta.url));

const disktorage = multer.diskStorage({

    destination: path.join(__dirname, '../../imagenes'),
    filename: (req, file, cb) => {
        console.log(req.body)
        cb(null, "sello.png")
    }
})
const fileUpload = multer({
    storage: disktorage
}).single('sello')


const rutas = Router()
const hospital = new Hospital()
const solicitud = new Solicitud()







rutas.post("/copiaSeguridad",  async (req, res) => { 
    const dire = path.join(__dirname,'../../backup/copia'+ req.body.fecha+'.sql')
    const comando =
    `mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_DATABASE} > ${dire}`;
    console.log(comando)

    exec(comando, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return res.json({msg:'Error al realizar la copia de seguridad'});
        }
      
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
        
        return res.json({msg:'La copia de seguridad fue realizada con exito!!!. El archivo se encuentra en la direccion :'+ dire});

      });

    // return system(comando)
    // return exec(comando)
})







rutas.post("/insertarImagen", fileUpload, async (req, res) => {
    const image = fs.readdirSync(path.join(__dirname, '../../imagenes'))
    return res.json(image)

})





rutas.post("/eliminarImagen", async (req, res) => {

    console.log(req.body)
    try {
        solicitud.obtenerSello(req.body.imagen).then(j => {
            if (j.length === 0) {
                fs.unlinkSync(path.join(__dirname, '../../imagenes/'+req.body.imagen))
                const image = fs.readdirSync(path.join(__dirname, '../../imagenes'))
                return res.json(image)
            }
        })
    } catch (error) {

    }

})


rutas.post("/all", async (req, res) => {
    // console.log(req.body)
    try {

        // const image = fs.readdirSync(path.join(__dirname, '../../imagenes'))
        // console.log(image)
        const resultado = await hospital.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/insertar", insertar, async (req, res) => {


    const { red, nombre, telefono, direccion,correo, creado, usuario} = req.body
    const datos = {
        red,
        nombre,
        telefono,
        direccion,
        correo,
        creado,
        usuario,
        sello: 'sello.png'
    }
    try {

        const resultado = await hospital.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok: true })

    } catch (error) {
        return res.status(500).send(error)
    }
})

rutas.post("/actualizar", editar, fileUpload, async (req, res) => {
    console.log('data: ', req.body)

    const { id, red, nombre, telefono, direccion, correo, modificado, usuario } = req.body
    const datos = {
        id,
        red,
        nombre,
        telefono,
        direccion,
        correo,
        modificado,
        usuario,
        sello: 'sello.png'
    }
    try {
        const resultado = await hospital.editar(datos)
        console.log(resultado)
        return res.json(resultado)


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})



export default rutas;