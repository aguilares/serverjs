import express from "express";
import pool from '../modelo/bdConfig.js'
import { KEY, CLAVEGMAIL } from '../config.js'

import jwt from 'jsonwebtoken'
// Admiministrador
import hospital from "../controlador/hospital.js";
import seguro from "../controlador/seguro.js";
import area from "../controlador/area.js";
import servicio from "../controlador/servicio.js";
import itemServicio from "../controlador/itemServicio.js";
import usuario from "../controlador/usuario.js";
import miPerfil from "../controlador/miPerfil.js";
//funciones disponibles para el administrador, solicitante y hasta para el laboratorista
import paciente from '../controlador/paciente.js'
import solicitudAdmin from '../controlador/solicitudAdmin.js'
import solicitudSolicitante from '../controlador/SolSolicitante.js'
import solicitudLaboratorista from '../controlador/solLaboratorista.js'
import intervalo from '../controlador/intervalo.js'

// archivos publicos
import rutasPublicas from "../controlador/Public/public.js";




import nodemailer from "nodemailer";

const rutas = express();

// +*********************************************************** login****************************************


// ruta de autentidicacion
rutas.get('/', async (req, res) => {
    // console.log("datos de la consulta: ", req.query)

    try {
        const sql = ` SELECT id, nombre, apellidoPaterno, apellidoMaterno, username
        from usuario 
        WHERE username = ${pool.escape(req.query.user)} and pass = ${pool.escape(req.query.pass)} and validar = 1`;

        console.log(await pool.query(sql), 'resultados de la consulta inicial')
        const [result] = await pool.query(sql)

        // console.log("datos de la consulta: ", result)

        if (result.length === 1) {
            var d = new Date();
            let fecha = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
            const payload = {
                "usuario": result[0].username,
                "ap1": result[0].apellidoPaterno,
                "ap2": result[0].apellidoMaterno,
                "name": result[0].nombre,
                'fecha': fecha
            }
            const token = jwt.sign(payload, KEY, {
                expiresIn: "1d"
            })

            const idUsuario = result[0].id

            const datos = {
                idUsuario,
                fecha,
                token
            }

            const [sesion] = await pool.query(`INSERT INTO sessiones SET ?`, datos)
            // console.log('dentro del bloque', sesion)

            if (sesion.insertId > 0) {
                console.log('dentro del bloquesss', req.query.user, req.query.pass)

                const sqlInfo = `SELECT UPPER(r.nombre) as rol, r.numero as numRol,
                    u.username, concat(UPPER(left(u.nombre,1)),LOWER(SUBSTRING(u.nombre,2))) as nombre, 
                    concat(UPPER(left(u.apellidoPaterno,1)),LOWER(SUBSTRING(u.apellidoPaterno,2))) as apellido, 
                    UPPER(s.nombre) AS servicio
                    from usuario u
                    inner join servicio s on u.idServicio = s.id
                    inner join rol r on u.idRol = r.id
                    where u.username = ${pool.escape(req.query.user)} and u.pass = ${pool.escape(req.query.pass)}`;
                const [info] = await pool.query(sqlInfo)
                console.log("datos de la consulta: ", info[0])

                return res.json({
                    'token': token,
                    'username': info[0].username,
                    'nombre': info[0].nombre,
                    'apellido': info[0].apellido,
                    'servicio': info[0].servicio,
                    'rol': info[0].rol,
                    'numRol': info[0].numRol
                })
            }
            else {
                return res.json({ msg: 'ERROR' })
            }
        }
        else {
            res.json({ msg: 'DATOS INCORRECTOS' })
        }
    } catch (error) {
        console.log("error en la ejeccion: ", error)
    }
})

rutas.post('/logout', (req, res) => {
    pool.query('DELETE FROM sessiones where token = ? ', [req.body.token])
})




rutas.get('/listarServicios', async (req, res) => {
    const sql =
    `SELECT id, nombre FROM servicio`;
    const [rows] = await pool.query(sql)
    return res.json(rows)
})



rutas.get('/olvideMiContrasena', async (req, res) => {
    // console.log('llego', req.query.correo)
    let correo = req.query.correo
    const sqlInfo = `SELECT correo, nombre, apellidoPaterno, apellidoMaterno from usuario where correo = ${pool.escape(correo)}`;
    const [info] = await pool.query(sqlInfo)
    const sqlInfoHospital = `SELECT correo from hospital`;
    const [infoHospital] = await pool.query(sqlInfoHospital)

    // console.log(info[0].correo !== undefined)
    if (info.length === 1 && infoHospital.length ===1) {



        let ale = Math.floor((Math.random() * (10000 - 1000 + 1)) + 1000);
        const sql = `UPDATE usuario SET
        codigo = ${pool.escape(ale)}
        WHERE correo = ${pool.escape(correo)}`;
        const [info1] = await pool.query(sql)


        if (info1.affectedRows > 0) {

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
                to: info[0].correo,  //destinatario
                subject: "CODIGO DE RECUPRACION",  //asunto del correo
                html: ` 
                    <div> 
                    <p>Hola ${info[0].nombre + ' ' + info[0].apellidoPaterno + ' ' + info[0].apellidoMaterno} </p> 
                    <p>Esto es su codigo de recupracion de su contraseña</p> 
                    <h4>${ale}</h4> 
                    </div> 
                `
            };

            let createTransport = nodemailer.createTransport(jConfig);
            createTransport.sendMail(email, function (error, info) {
                if (error) {
                    res.json({ ok: false, msg: "Error al enviar email" });
                } else {
                    res.json({ ok: true, msg: "Correo enviado correctamente" });
                }
                createTransport.close();
            });
        }
    }
    else {
        res.json({ ok: false, msg: 'CORREO NO REGISTRADO' })
    }
})




rutas.get('/codigo', async (req, res) => {
    console.log('llego', req.query.correo, req.query.codigo)
    let correo = req.query.correo
    let codigo = req.query.codigo
    const sqlInfo = `SELECT correo, nombre, apellidoPaterno, apellidoMaterno, codigo from usuario where correo = ${pool.escape(correo)} and codigo = ${pool.escape(codigo)}`;
    const [info] = await pool.query(sqlInfo)
    if (info.length === 1) {
        res.json({ ok: true });
    }
    else {
        res.json({ ok: false, msg: 'EL CODIGO QUE INGRESO NO ES EL CORRECTO' })
    }
})
rutas.get('/nuevaContrasena', async (req, res) => {
    console.log('llego', req.query.correo, req.query.pass)
    let correo = req.query.correo
    let pass = req.query.pass
    const sql = `UPDATE usuario SET
    pass = ${pool.escape(pass)}
    WHERE correo = ${pool.escape(correo)}`;
    const [info] = await pool.query(sql)
    console.log(info.affectedRows)
    if (info.affectedRows > 0) {
        res.json({ ok: true });
    }
    else {

        const sql = `UPDATE usuario SET
        codigo = ${pool.escape(null)}
        WHERE correo = ${pool.escape(correo)}`;
        await pool.query(sql)
        res.json({ ok: false, msg: 'OPERACION FALLIDA, VUELVA A EMPEZAR' })
    }
})






//VERIFICACION DE LA SESION QUE ESTA ALMACENADA EN LA BD
const verificacion = express();


verificacion.use((req, res, next) => {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearetoken = bearerHeader.split(" ")[1];
        // console.log('pasa la primera condicional, se ha obtenido los encabezados', bearetoken )

        jwt.verify(bearetoken, KEY, async (errtoken, authData) => {
            if (errtoken) {
                // console.log('error en la verificacion token alterado: ', bearetoken)
                pool.query('delete from sessiones where token = ?', [bearetoken])
                return res.json({ ok: false })
            }

            // console.log('pasa la verificacion del token', bearetoken)
            const sql = `SELECT u.id, r.numero, se.id as idServicio from sessiones s 
            inner join usuario u on s.idUsuario = u.id
            inner join rol r on u.idRol = r.id
            inner join servicio se on se.id = u.idServicio
            where s.token  = ${pool.escape(bearetoken)} and u.validar = true`;
            const [result] = await pool.query(sql)
            if (result.length > 0) {
                req.body.usuario = await result[0].id
                req.body.rol = await result[0].numero
                req.body.idServicio1 = await result[0].idServicio
                next()
            }
            else {
                return res.json({ ok: false })
            }
        })

    }
    else {
        return res.json({ ok: false, msg: 'datos del client' })
    }
})

const rolesAdmin = (req, res, next) => {
    if (req.body.rol === 22) next()
}

const rolesAutorizador = (req, res, next) => {
    if (req.body.rol === 1) next()
}
const rolesSolicitante = (req, res, next) => {
    if (req.body.rol === 2  ) next()
}

const rolesLaboratorista = (req, res, next) => {
    if (req.body.rol > 2 || req.body.rol < 9  )  next()//; console.log('correcto')}else {console.log('denegado')}
}

// rutas.post('/verificar', verificacion)




// **********************************************************************************************************
// RUTAS DE LA APLICACION
rutas.use('/public', rutasPublicas)


// ******************************************************** BLOQUE ADMINISTRADOR***************************
rutas.use("/laboratorio", verificacion, rolesAdmin, hospital)
rutas.use("/seguro", verificacion, rolesAdmin, seguro)
rutas.use("/area", verificacion, rolesAdmin, area)
rutas.use("/servicio", verificacion, rolesAdmin, servicio)
rutas.use("/usuario", verificacion, rolesAdmin, usuario)


// ******************************************************** AUTORIZADOR***************************

rutas.use("/solicitudA", verificacion, rolesAutorizador, solicitudAdmin)


// ****************************************************SOLICITANTE**********************************
rutas.use("/paciente", verificacion, rolesSolicitante, paciente)
rutas.use("/solicitudS", verificacion, rolesSolicitante, solicitudSolicitante)


// ****************************************************LABORATORISTA**********************************
rutas.use("/intervalo", verificacion, rolesLaboratorista, intervalo)
rutas.use("/itemservicio", verificacion, rolesLaboratorista, itemServicio)
rutas.use("/solicitudL", verificacion, rolesLaboratorista, solicitudLaboratorista)


// ACCESO A TODOS LOS ROLES QUE CUENTAN CON TOKEN VALIDO
rutas.use("/miPerfil", verificacion, miPerfil)



export default rutas;