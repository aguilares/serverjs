import { Router } from "express"
import { Usuario } from "../modelo/usuario.js"
import {  actualizarMiPerfil, cambiarMiContraseña } from '../validacion/usuario.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const usuarios = new Usuario()




rutas.post("/ver", async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await usuarios.miPerfil(req.body.usuario)

        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/cambiarMiContrasena", cambiarMiContraseña, async (req, res) => {
    const { pass1, pass2, usuario } = req.body
    const datos = { pass1, pass2, usuario }
    try {
        await usuarios.cambiarMiContraseña(datos).then(j => {
            if (j) return res.json({ ok: true })
            if (j.existe === 0) return res.json({ msg: 'SU CONTRASEÑA ACTUAL ES INCORRESTO' })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/actualizarMiPerfil", actualizarMiPerfil, async (req, res) => {

    console.log(req.body, 'actualizar hbjhhhhhhhhhhhhhhh')
    const { nombre, apellidoPaterno, apellidoMaterno, ci, correo, telefono, direccion, usuario } = req.body
    const datos = {
        nombre, apellidoPaterno,
        apellidoMaterno, ci, correo, telefono, direccion,
        usuario
    }
    try {
        await usuarios.actualizarMiPerfil(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'El numero de cedula de identidad ya esta registrado !!' })
            }
            if (j.existe === 2) {
                return res.json({ msg: 'Este correo ya esta registrado !!' })
            }
            console.log(j)
            return res.json(j)
        })
        // console.log(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})



export default rutas;