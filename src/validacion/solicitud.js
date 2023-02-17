
import { check } from "express-validator"
import { validaciones } from "./headers.js"

// BLOQUE PARA SOLICITANTE
export const sInsertar = [
    check('seguro')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('usuario')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('paciente')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('fecha')
        .exists()
        .isDate(),
    check('diagnostico')
        .exists()
        .isLength({ min: 1 }),
    check('hora')
        .exists()
        .matches(/^\d{2}:\d{2}:\d{2}$/),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const sEditar = [
    check('codigoSol')
        .isLength({ min: 1 })
        .exists(),
    check('seguro')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('usuario')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('paciente')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('fecha')
        .exists()
        .isDate(),
    check('diagnostico')
        .exists()
        .isLength({ min: 1 }),
    check('hora')
        .exists()
        .matches(/^\d{2}:\d{2}:\d{2}$/),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const sEliminar = [
    check('codigoSol').isLength({ min: 1 }).exists(),
    check('id').isNumeric().exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const sBuscar = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const buscarFecha = [
    check('ini')
        .exists()
        .isDate(),
    check('fin')
        .exists()
        .isDate(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const ver = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const informe = [
    check('codigoSol').isLength({ min: 1 }).exists(),
    check('fecha')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const informeImg = [
    check('codigoSol').isLength({ min: 1 }).exists(),
    check('fecha')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('id')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),


    (req, res, next) => {
        validaciones(req, res, next)
    }
]


/// BLOQUE PARA ADMINISTRADOR

export const autorizar = [
    check('codigoSol')
        .isLength({ min: 1 })
        .exists(),
    check('usuario')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),

    check('fecha')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const buscarAdmin = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const generarInformeAdmin = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const listarServicios = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const eliminarAdmin = [
    check('codigoSol')
        .exists()
        .isLength({ min: 1 }),

    check('texto')
        .isLength({ min: 10 })
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const reportes = [
    check('ini')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('fin')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const reportes1 = [
    check('ini')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('fin')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('idSeguro').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const reportesMedico = [
    check('ini')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('fin')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('idMedico').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const reportesMedicoSeguro = [
    check('ini')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('fin')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('idMedico').isLength({ min: 1 }).exists().isNumeric(),
    check('idSeguro').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const reportesPS = [
    check('ini')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('fin')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('idServicio').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const cardexEspecifico = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('campo')
        .exists()
        .isLength({ min: 1 }),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]







//*************************************BLOQUE LABORATORISTA********************************************

export const editarLab = [
    check('id')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('idUsuarioLab')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('fechaRecLab')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('horaRecLab')
        .exists()
        .matches(/^\d{2}:\d{2}:\d{2}$/),
    check('numMuestra')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('fechaGenInforme')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('fechaAnalisis')
        .exists()
        .isDate(),
    check('ProcMuestra')
        .exists()
        .isLength({ min: 5 }),
    check('fechaHoraObtMuestra')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('numIdentifLab')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),
    check('resultado')
        .isLength({ min: 1 })
        .exists(),
    check('interpretacionResLab')
        .isLength({ max: 300 }),
    check('condicionMuestra')
        .isLength({ max: 300 }),
    check('farmacosPaciente')
        .isLength({ max: 300 }),
    check('observacionLab')
        .isLength({ max: 300 }),
    check('fechaHoraPublicaionRes')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const buscarLab = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const reportar = [
    check('fecha')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('codigo').isLength({ min: 1 }).exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const listarImagenes = [
    check('id')
        .isLength({ min: 1 })
        .exists()
        .isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
