
import pool from './bdConfig.js'

export class Paciente {
    constructor(id, nombre, apellidoPaterno, apellidoMaterno, ci, fechaNac, sexo, telefono, direccion) {
        this._id = id;
        this._nombre = nombre;
        this._apellidoPaterno = apellidoPaterno;
        this._apellidoMaterno = apellidoMaterno;
        this._ci = ci;
        this._fechaNac = fechaNac;
        this._sexo = sexo;
        this._telefono = telefono;
        this._direccion = direccion;
    }
    //get
    get id() {
        return this._id
    }
    get nombre() {
        return this._nombre
    }
    get apellidoPaterno() {
        return this._apellidoPaterno
    }
    get apellidoMaterno() {
        return this._apellidoMaterno
    }
    get ci() {
        return this._ci
    }

    get fechaNac() {
        return this._fechaNac
    }

    get sexo() {
        return this._sexo
    }
    get telefono() {
        return this._telefono
    }
    get direccion() {
        return this._direccion
    }


    //set

    set nombre(nombre) {
        this._nombre = nombre
    }

    set apellidoPaterno(apellidoPaterno) {
        this._apellidoPaterno = apellidoPaterno
    }

    set apellidoMaterno(apellidoMaterno) {
        this._apellidoMaterno = apellidoMaterno
    }

    set ci(ci) {
        this._ci = ci
    }

    set fechaNac(fecha) {
        this._fechaNac = fecha
    }

    set sexo(sexo) {
        this._sexo = sexo
    }
    set telefono(telefono) {
        this._telefono = telefono
    }

    set direccion(direccion) {
        this._direccion = direccion
    }

    // METODOS

    listar = async () => {
        const sql =
            `SELECT id, ci, nombre,apellidoPaterno, apellidoMaterno, nhc,
             DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente ORDER BY id DESC  LIMIT 50 `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, ci, nombre,apellidoPaterno, apellidoMaterno, nhc,
         DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente where id<${pool.escape(id)} ORDER BY id DESC  LIMIT 50`;
        const [rows] = await pool.query(sql)
        return rows
    }


    cardex = async (id) => {
        const sql =
            `SELECT s.id,  s.codigoSol, s.diagnostico, DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha, item.nombre FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            WHERE p.id = ${pool.escape(id)} and  s.eliminar = false group by item.codigo`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql =
            `SELECT id, ci, nombre,apellidoPaterno, apellidoMaterno, nhc,
         DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente where id>${pool.escape(id)} ORDER BY id DESC  LIMIT 11 `;
        const [rows] = await pool.query(sql)
        return rows
    }

    insertar = async (datos) => {
        console.log(datos, 'regis')
        const sqlexist =
            `SELECT * from paciente where
            ci = ${pool.escape(datos.ci)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            const nhc =
                `SELECT * from paciente where
                nhc = ${pool.escape(datos.nhc)}`;
            const [rowsnhc] = await pool.query(nhc)
            if (rowsnhc.length === 0) {
                const [result] = await pool.query("INSERT INTO paciente SET  ?", datos)

                const pacientes = await this.retornar(result.insertId)
                return pacientes
                
            } else {
                return { existe: 2 }
            }
        } else {
            return { existe: 1 }
        }
    }

    // buscar = async (dato) => {
    //     const sql =
    //         `SELECT id,nombre, apellidoPaterno, apellidoMaterno, nhc, ci, DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente
    //         WHERE ci = ${pool.escape(dato)} or nombre = ${pool.escape(dato)} or apellidoPaterno = ${pool.escape(dato)}
    //         or apellidoMaterno = ${pool.escape(dato)} or nhc= ${pool.escape(dato)} `;
    //     const [rows] = await pool.query(sql)
    //     return rows
    // }

    buscar = async (dato) => {
        // const sql =
            // `SELECT id,nombre, apellidoPaterno, apellidoMaterno, nhc, ci, DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente
            // WHERE ci  like "${pool.escape(parseInt(dato))}%" or nombre like ${pool.escape(dato)}%`;
            // console.log(sql)
        const [rows] = await pool.query('SELECT id,nombre, apellidoPaterno, apellidoMaterno, nhc, ci, DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente WHERE ci  like "'+dato+'%" or nombre like "'+dato+'%" or apellidoPaterno like "'+dato+'%"  or apellidoMaterno like "'+dato+'%"')
        return rows
    }


    retornar = async (id) => {
        const sql =
            `SELECT id,nombre, apellidoPaterno, apellidoMaterno, nhc, ci, DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente
            WHERE id = ${pool.escape(id)}`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        
        const sqlExists = `SELECT * FROM paciente WHERE 
            (ci = ${pool.escape(datos.ci)} or nhc = ${pool.escape(datos.nhc)})      
            and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE paciente SET
                nombre = ${pool.escape(datos.nombre)},
                apellidoPaterno = ${pool.escape(datos.apellidoPaterno)},
                apellidoMaterno = ${pool.escape(datos.apellidoMaterno)},
                nhc = ${pool.escape(datos.nhc)},
                ci = ${pool.escape(datos.ci)},
                fechaNac = ${pool.escape(datos.fechaNac)},
                sexo = ${pool.escape(datos.sexo)},
                telefono= ${pool.escape(datos.telefono)},
                direccion = ${pool.escape(datos.direccion)},
                modificado = ${pool.escape(datos.modificado)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;
            await pool.query(sql);

            const pacientes = await this.retornar(datos.id)
            return pacientes
        } else {
            return {
                existe: 1,
            }
        }
    }

    eiminar = async (id) => {
        const sql = `delete from paciente
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        const pacientes = await this.listar()
        return pacientes
    }
}