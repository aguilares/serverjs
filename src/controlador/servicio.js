import { Router } from "express"
import { Servicio } from "../modelo/servicio.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/servicio.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const servicio = new Servicio()


rutas.post("/siguiente",siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await servicio.listarSiguiente(id)
        if(resultado.length>0)
            return res.json(resultado)
        else
            return res.json({stop:true})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})


rutas.post("/anterior", anterior,async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await servicio.listarAnterior(id)
        if(resultado.length>0)
            return res.json(resultado)
        else
            return res.json({stop:true})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})


rutas.post("/listaRegistroUsuario", async (req, res) => {
    try {
        const resultado = await servicio.listarSimpleUsuario()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/listaSimple", async (req, res) => {
    try {
        const resultado = await servicio.listarSimple()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/dependiente",eliminar, async (req, res) => {
    const id = req.body.id
    try {
        const resultado = await servicio.listaDependientes(id)
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/all", async (req, res) => {
    try {
        const resultado = await servicio.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await servicio.buscar(dato)
        return res.status(200).send(resultado)

    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    const { idArea, nombre, creado, usuario } = req.body
    const datos = {
        idArea,
        nombre,
        creado,  
        usuario
    }
    try {

        const resultado = await servicio.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok: true })

    } catch (error) {

        // console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    const { id, idArea, nombre, modificado, usuario } = req.body
    const datos = {
        id,
        idArea,
        nombre,
        modificado,
        usuario
    }
    try {
        const resultado = await servicio.actualizar(datos)
        if (resultado.existe === 0)
            return res.json({ msg: 'El area no existe' })
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok:true})

    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await servicio.eliminar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "EL SERVICIO NO EXISTE" });
        return res.json({ ok: true})
    } catch (error) {
        return res.status(500).send(error)
    }

})


export default rutas;