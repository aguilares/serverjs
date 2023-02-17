
import pool from './bdConfig.js'

export class Servicio {

    
    listarSimpleUsuario = async () => {
        const sql =
        `SELECT id, nombre FROM servicio`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSimple = async () => {
        const sql =
        `SELECT s.id, s.nombre FROM area a inner join servicio s on a.id = s.idArea WHERE a.laboratorio = 1`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listaDependientes = async (id) => {
        const sql =
        `SELECT s.nombre as y, a.nombre as x FROM area a inner join servicio s on a.id = s.idArea where a.id = ${pool.escape(id)}`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listar = async () => {
        const sql =
        `SELECT s.id, a.id as idArea, a.nombre as area, s.nombre as servicio FROM servicio s 
        inner join area a on s.idArea = a.id ORDER by s.id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
        `SELECT s.id, a.id as idArea, a.nombre as area, s.nombre as servicio FROM servicio s 
        inner join area a on s.idArea = a.id WHERE s.id<${pool.escape(id)} ORDER by s.id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    
    listarAnterior = async (id) => {
        const sql =
        `SELECT s.id, a.id as idArea, a.nombre as area, s.nombre as servicio FROM servicio s 
        inner join area a on s.idArea = a.id WHERE s.id>${pool.escape(id)} ORDER by s.id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {
        const sqlExists =`SELECT * FROM servicio WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO servicio SET  ?", datos)
            return resultado
        } else {
            return {
                existe:1,
            }
        }
    }

    buscar = async (dato) => {
        const sql =
        `SELECT s.id, a.id as idArea, a.nombre as area, s.nombre as servicio FROM servicio s 
        inner join area a on s.idArea = a.id where s.nombre =${pool.escape(dato)}`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        const sqlExists =
        `SELECT * FROM servicio WHERE nombre = ${pool.escape(datos.nombre)} and id !=${pool.escape(datos.id)} `;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE servicio SET
            idArea = ${pool.escape(datos.idArea)},
            nombre = ${pool.escape(datos.nombre)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if(resultado.affectedRows === 0){
                return {
                    existe:0
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
        const sql = `delete from servicio 
        WHERE id =  ${pool.escape(id)}`;
        const [resultado] = await pool.query(sql)
        return resultado
    }
}