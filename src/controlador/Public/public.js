import { Router } from "express"
import { Hospital } from "../../modelo/hospital.js"
import { Area } from '../../modelo/area.js'
import { Usuario } from '../../modelo/usuario.js'
import { insertar } from '../../validacion/usuario.js'
import nodemailer from "nodemailer";
import { CLAVEGMAIL } from '../../config.js'
import pool from '../../modelo/bdConfig.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const hospital = new Hospital()
const area = new Area()

const usuario = new Usuario()


rutas.get("/registrarme", insertar, async (req, res) => {

    // console.log('datos: ',req.query)
    const { correo, username, pass,xyz, ci, nombre, apellidoPaterno,
        apellidoMaterno, telefono, direccion, creado, idServicio } = req.query
    const datos = {
        correo,
        username,
        pass,
        ci,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        direccion,
        idServicio,
        creado,
    }
    try {
        const resultado = await usuario.insertar(datos)
        if (resultado.existe === 0) {
            return res.json({ok: false, msg: 'El correo   ' + correo + '   ya esta registrado ' })
        }
        if (resultado.existe === 1) {
            return res.json({ok: false, msg: 'la persona con CI: ' + ci + '  ya esta registrado' })
        }
        if (resultado.existe === 2) {
            return res.json({ ok: false,msg: 'El nombre de usuario ' + username + '  ya esta en uso' })
        }



        const sqlInfoHospital = `SELECT correo, telefono from hospital`;
        const [infoHospital] = await pool.query(sqlInfoHospital)

        if (infoHospital.length === 1) {

            console.log()
            let jConfig = {
                "host": "smtp.gmail.com",
                "port": "465",
                "secure": true,
                "auth": {
                    "user": infoHospital[0].correo,
                    "pass": CLAVEGMAIL
                }
            };
            console.log(infoHospital[0].correo, 'correo electronico')
            let email = {
                from: infoHospital[0].correo,  //remitente
                to: correo,  //destinatario
                subject: "UNIDAD SERVICIOS COMPLEMENTARIOS HOSPITAL SAN PEDRO CLAVER",  //asunto del correo
                html: ` 
                    <div> 
                    <p>Hola ${nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno} </p> 
                    <p>Su cuaenta en el sistema de solictudes de servicios complementarios ha sido creada con exito.</p> 
                    <p>En las próximas horas se hara la correspondiente validacion para otorgarle el acceso al sistema.</p> 

                    <h3>Sus credenciales de acceso son:</h3>
                    <h4>${'Usuario:'+username}</h4> 
                    <h4>${'Contraseña:'+xyz}</h4> 

                    <p>Para mas informacion contactese con el administrador de Area de Informatica.</p> 
                    <p>Tel/cel: ${infoHospital[0].telefono}</p> 

                    </div> 
                `
            };

            let createTransport = nodemailer.createTransport(jConfig);
            createTransport.sendMail(email, function (error, info) {
                
                createTransport.close();
            });
            res.json({ ok: true, msg: "Su cuenta ha sido creado correctamente, para mas informacion revise su correo " });
        }
        else {
            res.json({ ok: false, msg: 'CORREO NO REGISTRADO' })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


















rutas.get("/hospital", async (req, res) => {

    try {
        const resultado = await hospital.listarParaRegistro()
        console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.get("/areas", async (req, res) => {
    try {
        const resultado = await area.listarPublico()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})



export default rutas;