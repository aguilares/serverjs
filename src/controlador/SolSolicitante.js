import { Router } from "express"
import { Solicitud } from "../modelo/solicitud.js"
import { Seguro } from "../modelo/seguro.js"
import { Servicio } from "../modelo/servicio.js"
import { ItemServicio } from "../modelo/itemServicio.js"
import {
    sInsertar, sEditar, sEliminar, sBuscar, ver, buscarFecha, informe, informeImg, cardexEspecifico
} from '../validacion/solicitud.js'

import { eliminar, lista } from '../validacion/itemServicio.js'
import {
    reportes, reportes1, reportesPS
} from '../validacion/solicitud.js'


const rutas = Router()
const solicitud = new Solicitud()
const seguro = new Seguro()
const servicio = new Servicio()
const itemServicio = new ItemServicio()


rutas.post("/item", lista, async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await itemServicio.listarExamenes(parseInt(req.body.id))
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/servicio", async (req, res) => {
    console.log(req.body, 'solicitando servicios')
    try {
        const resultado = await servicio.listarSimple()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/seguro", async (req, res) => {
    try {
        const resultado = await seguro.listar()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/listarS", async (req, res) => {
    // console.log('datos alterados en la verificacion jjjjjj: ', req.body)
    try {
        const resultado = await solicitud.listarS(req.body.usuario)
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})



rutas.post("/countS", async (req, res) => {
    // console.log('datos alterados en la verificacion jjjjjj: ', req.body)
    try {
        const resultado = await solicitud.countS(req.body.usuario)
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})



rutas.post("/buscarS", sBuscar, async (req, res) => {
    // console.log(req.body)
    const { dato, usuario } = req.body
    const dato1 = {
        dato,
        usuario
    }
    try {
        const resultado = await solicitud.buscarS(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/buscarfechaS", buscarFecha, async (req, res) => {
    // console.log(req.body)
    const { ini, fin, usuario } = req.body
    const dato1 = {
        ini, fin,
        usuario
    }
    try {
        const resultado = await solicitud.buscarFechaS(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/preanaliticoS", async (req, res) => {
    // console.log(req.body)
    const { usuario } = req.body
    const dato1 = {
        usuario
    }
    try {
        const resultado = await solicitud.preanaliticoS(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/analiticoS", async (req, res) => {
    // console.log(req.body)
    const { usuario } = req.body
    const dato1 = {
        usuario
    }
    try {
        const resultado = await solicitud.analiticoS(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/postanaliticoS", async (req, res) => {
    // console.log(req.body)
    const { usuario } = req.body
    const dato1 = {
        usuario
    }
    try {
        const resultado = await solicitud.postanaliticoS(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/listarexamen", async (req, res) => {
    console.log('se esta preparando la lista de los complementos del examen')
    if (req.body.examen.length > 0) {
        let c = 0
        let data = []
        try {
            req.body.examen.forEach(async id => {
                const result = await solicitud.listarExamen(id)

                c = c + 1

                result.forEach(i => {
                    data.push(i.id)
                })

                if (req.body.examen.length === c) {
                    return res.json(data)
                }

            })

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }
})

rutas.post("/registrarS", sInsertar, async (req, res) => {

    console.log(req.body)

    if (req.body.examen?.length > 0) {

        // console.log(codigoSol)
        const { fecha, hora, diagnostico, seguro, usuario, paciente } = req.body
        let ids = []
        try {

            let c = 0
            await req.body.examen.forEach(async id => {
                const datos = {
                    idItemServicio: id,
                    codigoSol: '000',
                    idSeguro: seguro,
                    idUsuarioSol: usuario,
                    idPaciente: paciente,
                    fecha,
                    diagnostico,
                    horaSol: hora
                }

                await solicitud.insertarS(datos, ids)
                    .then(async j => {
                        // let dato = j[0].insertId
                        // console.log(dato, 'data selecionada despues insertar un registro')
                        // ids.push(dato)
                        // let codigo = 'S-' + j[0].insertId + usuario
                        if (j.affectedRows !== 0) {
                            c++
                            if (req.body.examen.length === c) {
                                let codigo = 'S-' + ids[0] + usuario
                                await solicitud.actualizarCodigo(ids, codigo)
                                return res.json({ codigo: codigo })
                            }
                        } else {
                            return res.json({ msg: 'REVISE BIEN LA INFORMACION' })
                        }
                    })
            })

        } catch (error) {
            console.log(error)
            return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
        }
    }
})


rutas.post("/actualizarS", sEditar, async (req, res) => {

    console.log(req.body, 'la solicitud para actualizar la solicitud ha llegado')
    if (req.body.examen?.length > 0) {
        // console.log(codigoSol)
        const { codigoSol, fecha, hora, diagnostico, seguro, usuario, paciente } = req.body

        try {
            const result = await solicitud.eliminarS(codigoSol)
            // console.log(result)
            let c = 0
            if (result.affectedRows > 0) {
                await req.body.examen.forEach(id => {
                    const datos = {
                        idItemServicio: id,
                        idSeguro: seguro,
                        idUsuarioSol: usuario,
                        idPaciente: paciente,
                        codigoSol,
                        fecha,
                        diagnostico,
                        horaSol: hora,
                    }
                    solicitud.insertarS(datos).then(j => {
                        if (j.affectedRows !== 0) {
                            c++
                            if (req.body.examen.length === c) {
                                solicitud.verSolicitud(codigoSol).then(data => {
                                    console.log(data)
                                    return res.json(data[0])
                                })
                            }
                        } else {
                            return res.json({ msg: 'REVISE BIEN LA INFORMACION' })
                        }
                    })
                })
            }
            else {
                return res.json({ msg: 'Error en el servidor, cruce de informacion, consulte con el administrador' })
            }
        } catch (error) {
            console.log(error)
            return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
        }
    }
})



rutas.post("/genInforme", informe, async (req, res) => {
    // console.log('datos alterados en la verificacion jjjjjj: ', req.body)
    const { codigoSol, fecha } = req.body
    const dato = {
        codigoSol, fecha
    }
    try {
        const resultado = await solicitud.generarInformeS(dato)
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
        const resultado = await solicitud.verSolicitud(req.body.dato, req.body.usuario)
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})


rutas.post("/cardex", lista, async (req, res) => {
    // console.log(req.body, 'lista after')
    const { id } = req.body
    const dato1 = {
        id,
    }
    try {
        const resultado = await solicitud.cardex(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/cardexEspecifico", cardexEspecifico, async (req, res) => {
    console.log(req.body, 'Solicitud de cardex especifico')
    const { id, campo } = req.body
    const dato1 = {
        id, campo
    }
    try {
        const resultado = await solicitud.cardexEspecifico(dato1)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})




rutas.post("/eliminarS", sEliminar, async (req, res) => {
    console.log(req.body, 'alteracion')
    try {
        const dato = req.body.codigoSol;
        const dato1 = {
            id: req.body.id
        }
        solicitud.eliminarS(dato).then(x => {
            // console.log(x)
            if (x.affectedRows !== 0) {
                solicitud.cardex(dato1).then(data => {
                    return res.json(data)
                })
            }
            else {
                return res.json({ msg: 'REVISE BIEN LA INFORMACION' })
            }
        })
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/recibirResultadosImagen", informeImg, async (req, res) => {
    console.log('datos alterados en la verificacion jjjjjj: ', req.body.id)
    const { codigoSol, fecha, id } = req.body
    const dato = {
        codigoSol, fecha, id
    }
    try {
        const resultado = await solicitud.generarInformeImagen(dato)
        // throw new error()
        // console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'INTENTE NUEVAMENTE MAS TARDE' })
    }
})















rutas.post("/datoGraficos", reportes, async (req, res) => {
    // console.log(req.body)
    const { ini, fin, usuario } = req.body
    const datos = { ini, fin, usuario }
    try {
        const resultado = await solicitud.graficSol(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})




rutas.post("/reportesSA", reportes, async (req, res) => {
    // console.log(req.body, 'se esta solictando examenes sin autorizar')

    const { ini, fin, usuario } = req.body
    const datos = { ini, fin, usuario }
    try {
        const resultado = await solicitud.reportesEstadoSASol(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/reportesCA", reportes, async (req, res) => {
    console.log(req.body)

    const { ini, fin, usuario } = req.body
    const datos = { ini, fin, usuario }
    try {
        const resultado = await solicitud.reportesEstadoCASol(datos)
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
        const resultado = await solicitud.reportesSSol(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})





rutas.post("/reportes1", reportes1, async (req, res) => {
    console.log(req.body, 'solicitud con seguros requerida')

    const { ini, fin, idSeguro, usuario } = req.body
    const datos = { ini, fin, idSeguro, usuario }
    try {
        const resultado = await solicitud.reportes1Sol(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

rutas.post("/reportes", reportes, async (req, res) => {
    console.log(req.body, 'Solictud si seguros requerida')
    const { ini, fin, usuario } = req.body
    const datos = { ini, fin, usuario }
    try {
        const resultado = await solicitud.reportesSol(datos)
        // console.log(resultado)
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})





export default rutas;