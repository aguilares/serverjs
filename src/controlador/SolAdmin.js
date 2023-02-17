import { Router } from "express"
import { Solicitud } from "../modelo/solicitud.js"
import {
    sBuscar, ver, autorizar, buscarFecha, eliminarAdmin, reportes, reportes1, reportesMedico, reportesPS
} from '../validacion/solicitud.js'



const rutas = Router()
const solicitud = new Solicitud()






// ADIMINISTRADOR
rutas.post("/listarA", async (req, res) => {
    // console.log('datos alterados en la verificacion jjjjjj: ', req.body)
    try {
        const resultado = await solicitud.listarA()
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})

rutas.post("/ver", ver, async (req, res) => {
    // console.log('datos alterados en la verificacion  ', req.body)
    try {
        const resultado = await solicitud.verSolicitudA(req.body.dato)
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})
rutas.post("/countA", async (req, res) => {
    // console.log('datos alterados en la verificacion ', req.body)
    try {
        const resultado = await solicitud.countA()
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})

rutas.post("/autorizar", autorizar, async (req, res) => {
    const { codigoSol, usuario, fecha } = req.body
    let dato = {
        codigoSol,
        usuario,
        fecha,
        sello: 'sello.png'

    }
    try {
        const resultado = await solicitud.autorizarSolicitud(dato)
        // throw new error()
        // console.log('retorno despues de autorizar. ',resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})

rutas.post("/eliminarA", eliminarAdmin, async (req, res) => {
    // console.log(req.body)
    try {
        const { codigoSol, usuario, texto } = req.body;
        const datos = {
            usuario,
            codigoSol,
            observacion: texto
        }

        const result = await solicitud.eliminarA(datos)
        // console.log(result)
        return res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/buscarA", sBuscar, async (req, res) => {
    const { dato } = req.body
    const dato1 = {
        dato,
    }
    try {
        const resultado = await solicitud.buscarA(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/buscarfechaA", buscarFecha, async (req, res) => {
    // console.log(req.body)
    const { ini, fin } = req.body
    const dato1 = {
        ini,
        fin
    }
    try {
        const resultado = await solicitud.buscarFechaA(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/preanaliticoA", async (req, res) => {
    // console.log(req.body)

    try {
        const resultado = await solicitud.preanaliticoA()
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/analiticoA", async (req, res) => {
    // console.log(req.body)

    try {
        const resultado = await solicitud.analiticoA()
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/postanaliticoA", async (req, res) => {

    try {
        const resultado = await solicitud.postanaliticoA()
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/reportesSA", reportes, async (req, res) => {  
    // console.log(req.body, 'se esta solictando examenes sin autorizar')

    const { ini, fin } = req.body
    const datos = { ini, fin }
    try {
        const resultado = await solicitud.reportesEstadoSA(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/reportesCA", reportes, async (req, res) => {  
    console.log(req.body)

    const { ini, fin} = req.body
    const datos = { ini, fin }
    try {
        const resultado = await solicitud.reportesEstadoCA(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/reportesS", reportesPS, async (req, res) => {  
    console.log(req.body)

    const { ini, fin, idServicio } = req.body
    const datos = { ini, fin, idServicio }
    try {
        const resultado = await solicitud.reportesS(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})



rutas.post("/reportesMedico", reportesMedico, async (req, res) => {  
    console.log(req.body)

    const { ini, fin, idMedico } = req.body
    const datos = { ini, fin, idMedico }
    try {
        const resultado = await solicitud.reportesMedico(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})




rutas.post("/reportes1", reportes1, async (req, res) => {  
    console.log(req.body, 'solicitud con seguros requerida')

    const { ini, fin, idSeguro } = req.body
    const datos = { ini, fin, idSeguro }
    try {
        const resultado = await solicitud.reportes1(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/reportes", reportes, async (req, res) => {
    console.log(req.body, 'Solictud si seguros requerida')
    const { ini, fin } = req.body
    const datos = { ini, fin }
    try {
        const resultado = await solicitud.reportes(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/datoGraficos", reportes, async (req, res) => {
    // console.log(req.body)
    const { ini, fin } = req.body
    const datos = { ini, fin }
    try {
        const resultado = await solicitud.grafic(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error) 
    }

})



export default rutas;