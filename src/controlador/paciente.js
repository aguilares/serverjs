import { Router } from "express"
import { Paciente } from "../modelo/paciente.js"
import { insertar, editar, eliminar, buscar, anterior, siguiente } from '../validacion/paciente.js'


const rutas = Router()
const paciente = new Paciente()

rutas.post("/all", async (req, res) => {
    try {
        const resultado = await paciente.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/siguiente",siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await paciente.listarSiguiente(id)
        if(resultado.length>0)
            return res.json(resultado)
        else
            return res.json({stop:true})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/cardex",siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await paciente.cardex(id)
            return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/anterior", anterior,async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await paciente.listarAnterior(id)
        if(resultado.length>0)
            return res.json(resultado)
        else
            return res.json({stop:true})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/buscar", buscar, async (req, res) => {
    // console.log(req.body.dato)
    const dato = req.body.dato
    try {
        const resultado = await paciente.buscar(dato)
        return res.send(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body)
    const { ci, nombre, apellidoPaterno, apellidoMaterno, nhc, fechaNac, sexo, telefono, direccion, creado, usuario } = req.body
    const datos = {
        ci,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nhc,
        fechaNac,
        sexo,
        telefono,
        direccion,
        creado,
        usuario
    }
    try {

        await paciente.insertar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'Paciente Existe' })
            } if (j.existe === 2) {
                return res.json({ msg: 'El numero de Historial clinico ya esta registrado' })
            }
            return res.json({ data: j, ok: true })

        })


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/actualizar", editar, async (req, res) => {
    console.log(req.body)

    const { id, ci, nombre, apellidoPaterno, apellidoMaterno, nhc, fechaNac, sexo, telefono, direccion, modificado, usuario } = req.body
    const datos = {
        id,
        ci,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nhc,
        fechaNac,
        sexo,
        telefono,
        direccion,
        modificado,
        usuario
    }
    try {
        await paciente.actualizar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'El NUMERO CI YA ESTA ASIGNADA A OTRA PERSONA' })
            }

            return res.json({ data: j, ok: true })
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    try {
        const id = req.body.id;

        await paciente.eiminar(id).then(j => {
            if (j.existe === 1) {
                return res.json({ msg: 'ya existe el registro' })
            }
            return res.json({ data: j, ok: true })
        })

    } catch (error) {
        return res.status(500).send(error)
    }

})


export default rutas;