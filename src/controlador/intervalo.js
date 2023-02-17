import { Router } from "express"
import { Intervalo } from "../modelo/intervalo.js"
import { insertar, editar, eliminar,  listar,listCodigo } from '../validacion/intervalo.js'


const rutas = Router()
const intervalo_ = new Intervalo()

rutas.post("/listarporcodigo", listCodigo, async (req, res) => {
    console.log(req.body.codigo)

    try {
        const resultado = await intervalo_.listarPorCodigo(req.body.codigo)
        
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/all", listar, async (req, res) => {
    // console.log(req.body.id)

    try {
        const resultado = await intervalo_.listar(req.body.id)
        
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/ver", listar, async (req, res) => {
    // console.log(req.body.id)

    try {
        const resultado = await intervalo_.ver(req.body.id)
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})


rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body, 'intervalo client')
    const { idItemServicio, descripcion, metodologia, intervalo,
        unidad, inferior, superior, edad1, edad2, sexo,
        muestras, creado, usuario } = req.body
    const datos = {
        idItemServicio, descripcion, metodologia, intervalo,
        unidad, inferior:0, superior:0, edad1, edad2, sexo,
        muestras, creado, usuario
    }
    try {

        await intervalo_.insertar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'ya existe el registro' })
            }
            // console.log(j)
            return res.json(j)

        })


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    // console.log(req.body)
    const { id, idItemServicio, descripcion, metodologia, intervalo,
        unidad, inferior, superior, edad1, edad2, sexo,
        muestras, creado, usuario } = req.body
    const datos = {
        id, idItemServicio, descripcion, metodologia, intervalo,
        unidad, inferior, superior, edad1, edad2, sexo,
        muestras, creado, usuario
    }
    try {
        await intervalo_.actualizar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'ya existe el registro' })
            }

            return res.json(j)
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const {id, idItemServicio, modificado, usuario }= req.body;
        const datos = {
            id, 
            idItemServicio,
            modificado,
            usuario
        }

        await intervalo_.eliminar(datos).then(j => {
            // console.log(j)
            return res.json(j)
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})


export default rutas;