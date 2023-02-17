
import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const insertar = [

    check('ci')
        .exists()
        .isLength({ min: 3, max: 20 }),

    check('nombre')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('apellidoPaterno')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('apellidoMaterno')
        .exists()
        .isLength({ min: 3 })
        .isString(),
    // check('nhc')
    //     .isLength({ min: 1 }),
    check('fechaNac')
        .exists()
        .isDate(),
    check('sexo')
        .exists()
        .isLength({ min: 1, max: 1 })
        .matches(/[fmFM]/),
    check('telefono')
        .exists()
        .isNumeric()
        .isLength({ min: 4, max: 25 }),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 3, max: 100 }),
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
    check('ci')
        .exists()
        .matches(/^[0-9-]{7,12}$/)
        .isLength({ min: 3, max: 20 }),
    check('nombre')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('apellidoPaterno')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('apellidoMaterno')
        .exists()
        .isLength({ min: 3 })
        .isString(),
    // check('nhc')
    //     .exists()
    //     .isLength({ min: 1 }),
    check('fechaNac')
        .exists()
        .isDate(),
    check('sexo')
        .exists()
        .isLength({ min: 1, max: 1 })
        .matches(/[fmFM]/),
    check('telefono')
        .exists()
        .isNumeric()
        .isLength({ min: 4, max: 25 }),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 5, max: 100 }),
    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const buscar = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const siguiente = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const anterior = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar