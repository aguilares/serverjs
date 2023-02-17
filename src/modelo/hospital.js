
import pool from './bdConfig.js'

export class Hospital {
  
    // METODOS

    listarParaRegistro = async () => {

        // console.log('solicitud')

        const [rows] = await pool.query("SELECT red, nombre, telefono, direccion FROM hospital")
        return rows
    } 

    listar = async () => {
        // console.log('Solicitud para info hospital')
        const [rows] = await pool.query("SELECT id, red, nombre, telefono, direccion, correo, sello FROM hospital")
        return rows
    } 


    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM hospital WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO hospital SET  ?", datos)
            return resultado
        } else {
            return {
                existe:1,
            }
        }
    }

    buscar = async (dato) => {
        const sql = `SELECT red, nombre, telefono, direccion, correo, sello FROM hospital WHERE (nombre = ${pool.escape(dato)} 
        or red = ${pool.escape(dato)})`;
        const [rows] = await pool.query(sql)
        return rows
    }

    editar = async (datos) => {
            const sql = `UPDATE hospital SET
            red = ${pool.escape(datos.red)},
            nombre = ${pool.escape(datos.nombre)},
            telefono = ${pool.escape(datos.telefono)},
            direccion = ${pool.escape(datos.direccion)},
            correo = ${pool.escape(datos.correo)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)},
            sello = ${pool.escape(datos.sello)}

            WHERE id = ${pool.escape(datos.id)}`;

            await pool.query(sql);
            return this.listar()
    }

    borrar = async (id) => {
        const sql = `delete from hospital 
        WHERE id =  ${pool.escape(id)}`;
        const [resultado] = await pool.query(sql)
        return resultado
    }
}