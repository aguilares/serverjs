import { Router } from "express"
import { Solicitud } from "../modelo/solicitud.js"
import {
    sBuscar, ver, buscarFecha,
    reportar, listarImagenes, reportes, reportesPS, reportesMedico, reportes1
} from '../validacion/solicitud.js'

import nodemailer from "nodemailer";
import pool from '../modelo/bdConfig.js'

import multer from "multer"
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const rutas = Router()
const solicitud = new Solicitud()


const __dirname = dirname(fileURLToPath(import.meta.url));

const disktorage = multer.diskStorage({

    destination: path.join(__dirname, '../../imagenes'),

    filename: (req, file, cb) => {
        // console.log(req.query.nombreArchivo, 'nombre imagen')
        cb(null, req.query.nombreArchivo + '.png')
    }
})
const fileUpload = multer({
    storage: disktorage
}).single('resultado')


// console.log(fileUpload)




rutas.post("/insertarResultadoImagen", fileUpload, async (req, res) => {
    try {
        console.log(req.query)
        const { id, nombreArchivo, codigo, obs } = req.query


        const datos = { idSolicitud: parseInt(id), nombre: nombreArchivo + '.png' }

        fs.readdirSync(path.join(__dirname, '../../imagenes'))
        const resultado = await solicitud.insertarReporteImagen(datos, codigo, obs)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }


})





rutas.post("/eliminarImagen", async (req, res) => {

    // console.log(req.body)
    try {

        fs.unlinkSync(path.join(__dirname, '../../imagenes/' + req.body.imagen))
        const result = await solicitud.eliminarImagen(req.body.imagen, req.body.codigo, req.body.id )
        return res.json(result)

    } catch (error) {

    }

})





rutas.post("/listarL", async (req, res) => {
    // console.log('llego este dato: ', req.body)
    try {
        const resultado = await solicitud.listarL(req.body.idServicio1)
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})





rutas.post("/listarexamenL", async (req, res) => {
    console.log('datos alterados en la verificacion jjjjjj: ', req.body.array)
    if (req.body.array.length > 0) {
        try {
            let a = []
            let c = 0
            await req.body.array.map(async e => (

                await solicitud.listarExamen(e)
                    .then(async j => {
                        a.push(j)
                        c++
                        if (req.body.array.length === c) {

                            console.log(a, 'antes')
                            return res.json(a)
                        }
                    })
            ))

        } catch (error) {
            console.log(error)
            return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
        }
    }
})






rutas.post("/countL", async (req, res) => {
    // console.log('datos alterados en la verificacion jjjjjj: ', req.body)
    try {
        const resultado = await solicitud.countL(req.body.idServicio1)
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})



rutas.post("/buscarL", sBuscar, async (req, res) => {
    // console.log(req.body)
    const { dato, idServicio1 } = req.body
    const dato1 = {
        dato,
        idServicio1
    }
    try {
        const resultado = await solicitud.buscarL(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/buscarfechaL", buscarFecha, async (req, res) => {
    // console.log(req.body)
    const { ini, fin, idServicio1 } = req.body
    const dato1 = {
        ini,
        fin,
        idServicio1
    }
    try {
        const resultado = await solicitud.buscarFechaL(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/preanaliticoL", async (req, res) => {
    // console.log(req.body)
    const { idServicio1 } = req.body
    const dato1 = {
        idServicio1
    }
    try {
        const resultado = await solicitud.preanaliticoL(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/analiticoL", async (req, res) => {
    // console.log(req.body)
    const { idServicio1 } = req.body
    const dato1 = {
        idServicio1
    }
    try {
        const resultado = await solicitud.analiticoL(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/postanaliticoL", async (req, res) => {
    // console.log(req.body)
    const { idServicio1 } = req.body
    const dato1 = {
        idServicio1
    }
    try {
        const resultado = await solicitud.postanaliticoL(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/verL", ver, async (req, res) => {
    const { rol, usuario, dato, fecha, hora } = req.body
    const datos = { rol, usuario, codigoSol: dato, fecha, hora }
    try {
        const resultado = await solicitud.verSolicitudUpdate(datos)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})






rutas.post("/grabarResultadosLaboratorio", async (req, res) => {
    console.log(req.body)
    try {
        const sqlInfo = `SELECT correo, nombre, apellidoPaterno, apellidoMaterno from usuario where id = ${pool.escape(req.body.usuario)}`;
        const [info] = await pool.query(sqlInfo)
        const sqlHospital = `SELECT correo, nombre, telefono from hospital`;
        const [infoHospital] = await pool.query(sqlHospital)

        // console.log(info, infoHospital[0].correo)
        let c = 0
        const usuario = req.body.usuario
        const rol = req.body.rol
        await req.body.solicitud.forEach(e => {
            solicitud.guardarResutadosLaboratorio(e, usuario, rol).then(j => {
                c++
                if (c === req.body.solicitud.length) {

                    if (req.body.url !== null) {
                        let jConfig = {
                            "host": "smtp.gmail.com",
                            "port": "465",
                            "secure": true,
                            "auth": {
                                "user": infoHospital[0].correo,
                                "pass": "mjvlztyplileeoch"
                            }
                        };

                        let email = {
                            from: infoHospital[0].correo, //remitente
                            to: info[0].correo,  //destinatario
                            subject: "UNIDAD DE SERVICIO COMPLEMENTARIOS DEL HOSPITAL SAN PEDRO CLAVER",  //asunto del correo
                            html: ` 
                            <div> 
                            <p>Hola ${info[0].nombre + ' ' + info[0].apellidoPaterno + ' ' + info[0].apellidoMaterno} </p> 
                            <p>El ${infoHospital[0].nombre} se comunica con usted para informar que su solicitud a la unidad de servicios complemetarios con el codigo ${e.codigoSol}
                             ya esta listo, para mas detalles <a href = "${req.body.url}">haga click aqui</a> </p> 
                            <h4> CODIGO DE SOLICITUD ${e.codigoSol}<h4/>
                            </div> 
                        `
                        };

                        let createTransport = nodemailer.createTransport(jConfig);
                        createTransport.sendMail(email, function (error, info) {
                            if (error) {
                                solicitud.verSolicitudL(e.codigoSol).then(data => {
                                    return res.json({ data: data, msg: 'Fallo al anviar el correo electronico ' })
                                })
                            } else {
                                solicitud.verSolicitudL(e.codigoSol).then(data => {
                                    return res.json({ data: data, msg: 'CORREO DE NOTIFICACION ENVIADO' })
                                })
                            }
                            createTransport.close();
                        });
                    }

                }
            })
        })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})

rutas.post("/reportarResultados", reportar, async (req, res) => {
    // console.log(req.body)

    try {
        const resultado = await solicitud.reportarLaboratorio(req.body.fecha, req.body.codigo, req.body.usuario)
        console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})



rutas.post("/listarImagenes", listarImagenes, async (req, res) => {
    console.log(req.body)

    try {
        const resultado = await solicitud.obtenerImagenes(req.body.id)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})































rutas.post("/reportesS", reportesPS, async (req, res) => {  
    console.log(req.body)

    const { ini, fin, idServicio } = req.body
    const datos = { ini, fin, idServicio }
    try {
        const resultado = await solicitud.reportesSTec(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})



rutas.post("/reportesMedico", reportesMedico, async (req, res) => {  
    console.log(req.body)

    const { ini, fin, idMedico, idServicio1 } = req.body
    const datos = { ini, fin, idMedico, idServicio1}
    try {
        const resultado = await solicitud.reportesMedicoTec(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})




rutas.post("/reportes1", reportes1, async (req, res) => {  
    console.log(req.body, 'solicitud con seguros requerida')

    const { ini, fin, idSeguro, idServicio1 } = req.body
    const datos = { ini, fin, idSeguro, idServicio1 }
    try {
        const resultado = await solicitud.reportes1Tec(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/reportes", reportes, async (req, res) => {
    console.log(req.body, 'Solictud si seguros requerida')
    const { ini, fin, idServicio1 } = req.body
    const datos = { ini, fin, idServicio1 }
    try {
        const resultado = await solicitud.reportesTec(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/datoGraficos", reportes, async (req, res) => {
    // console.log(req.body)
    const { ini, fin, idServicio1 } = req.body
    const datos = { ini, fin, idServicio1 }
    try {
        const resultado = await solicitud.graficTec(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error) 
    }

})



export default rutas;