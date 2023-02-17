
import pool from './bdConfig.js'

export class Area {
  
    // METODOS

    listarPublico = async () => {
        const sql =
        `SELECT nombre FROM area`;
        const [rows] = await pool.query(sql)
        return rows
    }



    listar = async () => {
        const sql =
        `SELECT id, nombre, laboratorio FROM area ORDER BY id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
        `SELECT id, nombre, laboratorio FROM area where id<${pool.escape(id)} ORDER BY id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    
    listarAnterior = async (id) => {
        const sql =
        `SELECT id, nombre, laboratorio FROM area where id>${pool.escape(id)} ORDER BY id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM area WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            
            const resultado = await pool.query("INSERT INTO area SET  ?", datos)
            return resultado

        } else {
            return {
                existe:1,
            }
        }
    }

    buscar = async (dato) => {
        const sql =
        `SELECT id, nombre, laboratorio  from area where nombre =  ${pool.escape(dato)}`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM area WHERE nombre = ${pool.escape(datos.nombre)} and id != ${pool.escape(datos.id)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE area SET
            nombre = ${pool.escape(datos.nombre)},
            laboratorio = ${pool.escape(datos.laboratorio)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if(resultado.affectedRows === 0){
                return {
                    existe:0,
                } 
            }
            return resultado
        } else {
            return {
                existe:1,
            }
        }
    }

    eliminar = async (id) => {
        const sql = `delete from area
        WHERE id =  ${pool.escape(id)}`;
        const [resultado] = await pool.query(sql)
        return resultado
    }
}