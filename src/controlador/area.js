import { Router } from "express"
import { Area } from "../modelo/area.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/area.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const area = new Area()

rutas.post("/siguiente",siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await area.listarSiguiente(id)
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
        const resultado = await area.listarAnterior(id)
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
        const resultado = await area.listar()
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await area.buscar(dato)
        return res.send(resultado)

    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body)
    const { nombre, laboratorio, creado, usuario } = req.body
    const datos = {
        nombre,
        laboratorio,
        creado,
        usuario
    }
    try {

        const resultado = await area.insertar(datos)
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

    // console.log(req.body)
    const { id, nombre, laboratorio, modificado, usuario } = req.body
    const datos = {
        id,
        nombre,
        laboratorio,
        modificado,
        usuario
    }
    try {
        const resultado = await area.actualizar(datos)
        if (resultado.existe === 0)
            return res.json({ msg: 'El area no existe' })
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json({ ok: true })

    } catch (error) {
        // console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log('datos antes de aliminar : ',req.body)
    try {
        const id = req.body.id;
        const resultado = await area.eliminar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "NO EXISTE EL REGISTRO" });
        return res.json({ ok: true })
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default rutas;