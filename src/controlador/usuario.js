import { Router } from "express"
import { Usuario } from "../modelo/usuario.js"
import { eliminar, buscar, actualizarRolesServicios, siguiente, validar, deshabilitar } from '../validacion/usuario.js'
import pool from '../modelo/bdConfig.js'
import { CLAVEGMAIL } from '../config.js'
import nodemailer from "nodemailer";
//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const usuarios = new Usuario()


rutas.post("/all", async (req, res) => {
    try {
        const resultado = await usuarios.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }
})

rutas.post("/siguiente", siguiente, async (req, res) => {
    // console.log('jola')
    let id = req.body.id
    try {
        const resultado = await usuarios.listarSiguiente(id)
        if (resultado.length > 0)
            return res.json(resultado)
        else
            return res.json({ stop: true })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})




rutas.post("/rol", async (req, res) => {
    try {
        const resultado = await usuarios.listarRol()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }
})

rutas.post("/ver", async (req, res) => {
    try {
        const id = req.body.id
        const resultado = await usuarios.ver(id)
        return res.json(resultado)
    } catch (error) {
        return res.send(error)
    }
})

rutas.post("/buscar", buscar, async (req, res) => {
    // console.log(req.body)
    const dato = req.body.dato
    try {
        const resultado = await usuarios.buscar(dato)
        return res.send(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})


rutas.post("/actualizar", actualizarRolesServicios, async (req, res) => {

    // console.log(req.body)
    const { id, idServicios, idRol, correo, modificado, usuario } = req.body
    const datos = {
        id,
        idServicios,
        idRol,
        correo,
        modificado,
        usuario
    }
    try {
        await usuarios.actualizarRolServicios(datos).then(j=>{
            if(j.existe === 1) return res.json({msg: 'Este correo ya existe'})
            return res.json(j)
        })
        // console.log(resultado)
    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/validar", validar, async (req, res) => {
    // console.log(req.body.user.correo)
    try {
        const { id, idServicios, idRol, modificado, usuario, user } = req.body;
        const datos = {
            id, idServicios, idRol, modificado, usuario
        }
        const resultado = await usuarios.validar(datos)
        // console.log(resultado)




        const sqlInfoHospital = `SELECT correo, telefono from hospital`;
        const [infoHospital] = await pool.query(sqlInfoHospital)

        if (infoHospital.length === 1) {


            let jConfig = {
                "host": "smtp.gmail.com",
                "port": "465",
                "secure": true,
                "auth": {
                    "user": infoHospital[0].correo,
                    "pass": CLAVEGMAIL
                }
            };
            // console.log(infoHospital[0].correo, 'correo electronico')
            let email = {
                from: infoHospital[0].correo,  //remitente
                to: user.correo,  //destinatario
                subject: "UNIDAD SERVICIOS COMPLEMENTARIOS HOSPITAL SAN PEDRO CLAVER",  //asunto del correo
                html: ` 
                    <div> 
                    <p>Hola ${user.nombre + ' ' + user.apellidoPaterno + ' ' + user.apellidoMaterno} </p> 
                    <h2>Su cuenta en el Sistema de Solicitudes de Servicios Somplementarios ha sido confirmado.</h2>  
                    <label>Ya puede acceder.</label>  

                    <p>Para mas informacion contactese con el administrador del área de Informatica.</p> 
                    <p>Tel/cel: ${infoHospital[0].telefono}</p> 

                    </div> 
                `
            };

            let createTransport = nodemailer.createTransport(jConfig);
            createTransport.sendMail(email, function (error, info) {
                if(error) console.log(error)
                createTransport.close();
            });
        }

        return res.json(resultado)
    } catch (error) {
        // console.log(error)
        return res.status(500)
    }

})
rutas.post("/deshabilitar", deshabilitar, async (req, res) => {
    console.log(req.body)
    try {
        const { id, modificado, usuario } = req.body;
        const datos = {
            id, modificado, usuario
        }
        const resultado = await usuarios.deshabilitar(datos)
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500)
    }

})

rutas.post("/eliminar", eliminar, async (req, res) => {
    console.log(req.body)

    try {
        const id = req.body.id;
        const resultado = await usuarios.eliminar(id)
        return res.json(resultado)
    } catch (error) {
        return res.status(500)
    }

})


export default rutas;