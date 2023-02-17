import { Router } from "express"
import { Seguro } from "../modelo/seguro.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/seguro.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const seguro = new Seguro()

rutas.post("/siguiente",siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await seguro.listarSiguiente(id)
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
        const resultado = await seguro.listarAnterior(id)
        if(resultado.length>0)
            return res.json(resultado)
        else
            return res.json({stop:true})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/all", async (req, res) => {
    try {
        const resultado = await seguro.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await seguro.buscar(dato)
            return res.json(resultado)
    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    const { nombre, creado, usuario } = req.body
    const datos = {
        nombre,
        creado,
        usuario
    }
    try {
        const resultado = await seguro.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok: true})

    } catch (error) {

        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    const { id, nombre, modificado, usuario } = req.body
    const datos = {
        id,
        nombre,
        modificado,
        usuario
    }
    try {
        const resultado = await seguro.actualizar(datos)
        if (resultado.existe === 0)
            return res.json({ msg: 'El area no existe' })
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok : true})

    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await seguro.eliminar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "NO EXISTE EL REGISTRO !" });
        return res.json({ ok: true })
    } catch (error) {
        return res.status(500).send(error)
    }
})


export default rutas;