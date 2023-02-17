
import pool from './bdConfig.js'

export class Seguro {
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
    }
    //get
    get id() {
        return this._id
    }

    get nombre() {
        return this._nombre
    }
    //set

    set nombre(nombre) {
        this._nombre = nombre
    }


    // METODOS
    listar = async () => {
        const [rows] = await pool.query("SELECT id, nombre from seguro ORDER by id DESC")
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
        `SELECT id, nombre from seguro
         WHERE id<${pool.escape(id)} ORDER by id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    
    listarAnterior = async (id) => {
        const sql =
        `SELECT id, nombre from seguro
        WHERE id>${pool.escape(id)} ORDER by id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }

    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM seguro WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO seguro SET  ?", datos)
            return resultado
        } else {
            return {
                existe:1,
            }
        }
    }

    buscar = async (dato) => {
        const sql = `SELECT id, nombre FROM seguro
        WHERE nombre = ${pool.escape(dato)}`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM seguro WHERE nombre = ${pool.escape(datos.nombre)} and id != ${pool.escape(datos.id)} `;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE seguro SET
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
                msg: "EL HOSPITAL YA ESTA REGISTRADO"
            }
        }
    }

    eliminar = async (id) => {
        const sql = `delete from seguro 
        WHERE id =  ${pool.escape(id)}`;
        const [resultado] = await pool.query(sql)
        return resultado
    }
}