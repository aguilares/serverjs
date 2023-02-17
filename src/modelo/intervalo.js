
import pool from './bdConfig.js'

export class Intervalo {

    listar = async (id) => {
        // console.log(id)
        const sql =
            `
            SELECT i.id,i.descripcion FROM intervalo i
            inner join itemservicio item on i.idItemServicio = item.id
            where item.id = ${pool.escape(id)} and estado = false
            `;

        const [rows] = await pool.query(sql)
        return rows
    }


    listarPorCodigo = async (codigo) => {
        console.log(codigo)
        const sql =
            `
            SELECT item.id as idItemServicio, i.id,i.descripcion FROM intervalo i
            inner join itemservicio item on i.idItemServicio = item.id
            inner join solicitud s on s.idItemServicio = item.id
            where s.codigoSol = ${pool.escape(codigo)} and i.estado = false
            `;

        const [rows] = await pool.query(sql)
        return rows
    }

    ver = async (id) => {
        const sql =
            `
            SELECT i.id, i.idItemServicio, i.descripcion, i.metodologia,
            i.intervalo, i.unidad, i.inferior, i.superior, i.edad1, 
            i.edad2, i.sexo, i.muestras FROM intervalo i
            inner join itemservicio item on i.idItemServicio = item.id
            where i.id = ${pool.escape(id)}
            `;

        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, ci, nombre,apellidoPaterno, apellidoMaterno, nhc,
         DATE_FORMAT(fechaNac, "%Y-%m-%d") as fechaNac, sexo, telefono, direccion FROM paciente where id<${pool.escape(id)} ORDER BY id DESC  LIMIT 8 `;
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {

        // console.log('modelo intervalo')
        const sqlexist =
            `SELECT * from intervalo where
            descripcion = ${pool.escape(datos.descripion)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            await pool.query("INSERT INTO intervalo SET  ?", datos)
            const intervalo = await this.listar(datos.idItemServicio)
            return intervalo
        } else {
            return {
                existe: 1,
            }
        }
    }

    actualizar = async (datos) => {
        const sqlExists = `SELECT * FROM intervalo WHERE 
            descripcion = ${pool.escape(datos.descripion)}      
            and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE intervalo SET
                idItemServicio = ${pool.escape(datos.idItemServicio)},
                descripcion = ${pool.escape(datos.descripcion)},
                metodologia = ${pool.escape(datos.metodologia)},
                intervalo = ${pool.escape(datos.intervalo)},
                unidad = ${pool.escape(datos.unidad)},
                inferior = ${pool.escape(datos.inferior)},
                superior = ${pool.escape(datos.superior)},
                edad1 = ${pool.escape(datos.edad1)},
                edad2= ${pool.escape(datos.edad2)},
                sexo = ${pool.escape(datos.sexo)},
                muestras = ${pool.escape(datos.muestras)},
                modificado = ${pool.escape(datos.modificado)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;
            await pool.query(sql);

            const intervalo = await this.ver(datos.id)
            return intervalo
        } else {
            return {
                existe: 1,
            }
        }
    }

    eliminar = async (datos) => {
        const sql = `UPDATE intervalo SET 
        modificado = ${pool.escape(datos.modificado)},
        usuario = ${pool.escape(datos.usuario)},
        estado = true
        WHERE id =  ${pool.escape(datos.id)}`;
        await pool.query(sql)
        const pacientes = await this.listar(datos.idItemServicio)
        return pacientes  
    }
}