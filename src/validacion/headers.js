// const { validationResult } = require('express-validator');
import { validationResult } from "express-validator"

export const validaciones = (req, res, next) => {

    // console.log("DATOS EN LA CABECERA: ",req.body)
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log('no pasa validaciones', error, req.body)
        return res.status(400).json({ msg: 'el servidor no pudo interpretar la solicitud dada una sintaxis inválida' })
    }
    return next()
}
// module.exports = { validaciones }