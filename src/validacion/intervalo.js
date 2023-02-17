
import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const insertar = [

    check('idItemServicio')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),

    check('descripcion')
        .exists()
        .isLength({ min: 1 })
        .isString(),

    check('metodologia')
        .exists()
        .isLength({ min: 1 })
        .isString(),

    check('intervalo')
        .exists()
        .isLength({ min: 1 }),

    check('unidad')
        .isLength({ min: 1 }),
    // check('inferior')
    //     .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    // check('superior')
    //     .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('edad1')
        .exists()
        .isLength({ min: 1 })
        .isNumeric(),
    check('edad2')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('sexo')
        .exists()
        .isLength({ min: 1, max: 1 })
        .matches(/[fmFMTt]/),

    check('muestras')
        .exists()
        .isString()
        .isLength({ min: 5 }),

    check('creado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    check('idItemServicio')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),

    check('descripcion')
        .exists()
        .isLength({ min: 1 })
        .isString(),

    check('metodologia')
        .exists()
        .isLength({ min: 1 })
        .isString(),

    check('intervalo')
        .exists()
        .isLength({ min: 1 }),

    check('unidad')
        .isLength({ min: 1 }),
    check('inferior')
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('superior')
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('edad1')
        .exists()
        .isLength({ min: 1 })
        .isNumeric(),
    check('edad2')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('sexo')
        .exists()
        .isLength({ min: 1, max: 1 })
        .matches(/[fmFMTt]/),

    check('muestras')
        .exists()
        .isString()
        .isLength({ min: 3 }),

    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('idItemServicio').isLength({ min: 1 }).exists().isNumeric(),
    check('modificado').exists().matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario').exists().isLength({ min: 1 }).isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const listar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const listCodigo = [
    check('codigo').isLength({ min: 1 }).exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar