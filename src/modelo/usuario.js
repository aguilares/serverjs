
import pool from './bdConfig.js'

export class Usuario {

    // METODOS


    listar = async () => {
        const sql =
            `SELECT u.id, u.correo, s.id as idServicio,s.nombre as servicio, r.id as idRol, r.nombre as rol, u.username, u.ci, u.nombre, u.apellidoPaterno,
             u.apellidoMaterno,u.telefono, u.direccion, u.validar 
             from usuario u left join servicio s on u.idServicio = s.id 
             left join rol r on u.idRol = r.id ORDER by u.id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguiente = async (id) => {

        const sql =
            `SELECT u.id, u.correo,  s.id as idServicio,s.nombre as servicio, r.id as idRol,
        r.nombre as rol,  u.username, u.ci, u.nombre, u.apellidoPaterno, 
        u.apellidoMaterno,u.telefono, u.direccion
        from usuario u inner join servicio s on u.idServicio = s.id
        inner join rol r on u.idRol = r.id where u.validar = true and u.id<${pool.escape(id)} ORDER by u.id DESC limit 10`;
        const [rows] = await pool.query(sql)
        return rows
    }



    listarRol = async () => {
        const sql =
            `SELECT id,nombre from rol`;
        const [rows] = await pool.query(sql)
        return rows
    }



    insertar = async (datos) => {

        const sqlexisteusername =
            `SELECT username from usuario where
        username = ${pool.escape(datos.username)}`;
        const [rows] = await pool.query(sqlexisteusername)

        if (rows.length === 0) {

            const sqlExistsUsuario = `SELECT * FROM usuario WHERE 
            ci = ${pool.escape(datos.ci)} `;
            const [result] = await pool.query(sqlExistsUsuario)

            if (result.length === 0) {
                const sqlCorreo = `SELECT * FROM usuario WHERE  correo = ${pool.escape(datos.correo)} `;
                const [correo] = await pool.query(sqlCorreo)
                if (correo.length === 0) {
                    const resultado = await pool.query("INSERT INTO usuario SET  ?", datos)
                    return resultado
                } else {
                    return { existe: 0 }
                }

            } else {
                return {
                    existe: 1,
                }
            }
        } else {
            return {
                existe: 2,
            }
        }
    }

    buscar = async (dato) => {
        const sql =
            `SELECT u.id, u.correo, s.id as idServicio,s.nombre as servicio, r.id as idRol, r.nombre as rol, u.username, u.ci, u.nombre, u.apellidoPaterno,
            u.apellidoMaterno,u.telefono, u.direccion, u.validar 
            from usuario u left join servicio s on u.idServicio = s.id 
            left join rol r on u.idRol = r.id
            where u.nombre = ${pool.escape(dato)} or
            u.ci like '${dato}%' or
            u.nombre = ${pool.escape(dato)} or
            u.apellidoPaterno = ${pool.escape(dato)} or
            u.apellidoMaterno = ${pool.escape(dato)}
            ORDER by u.id DESC limit 10;`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizarRolServicios = async (datos) => {
        const sqlExists = `SELECT * FROM usuario WHERE 
        correo = ${pool.escape(datos.correo)} 
        and id != ${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)
        // console.log(result)
        if (result.length === 0) {
            const sql = `UPDATE usuario SET
                idServicio = ${pool.escape(datos.idServicios)},
                idRol = ${pool.escape(datos.idRol)},
                correo = ${pool.escape(datos.correo)},
                modificado = ${pool.escape(datos.modificado)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;
            const result = await pool.query(sql)
            if (result[0].affectedRows === 1) {
                const ssql = `delete from sessiones
                    WHERE idUsuario = ${pool.escape(datos.id)}`;
                await pool.query(ssql)
                return await this.listar()
            }
        } else return { existe: 1 }
    }


    validar = async (datos) => {
        const sql = `UPDATE usuario SET
            idServicio = ${pool.escape(datos.idServicios)},
            idRol = ${pool.escape(datos.idRol)},
            validar = true,
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;
        await pool.query(sql)
        return await this.listar()
    }
    deshabilitar = async (datos) => {
        const sql = `UPDATE usuario SET
            validar = false,
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;
        const result = await pool.query(sql)

        if (result[0].affectedRows === 1) {
            const ssql = `delete from sessiones
                WHERE idUsuario = ${pool.escape(datos.id)}`;
            await pool.query(ssql)
        }
        return await this.listar()
    }
    eliminar = async (id) => {
        const sql = `delete from usuario
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }






    cambiarMiContraseña = async (datos) => {
        const sqlExists = `SELECT * FROM usuario WHERE 
            pass = ${pool.escape(datos.pass1)} 
            and id = ${pool.escape(datos.usuario)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length > 0) {

            const sql = `UPDATE usuario SET

                pass = ${pool.escape(datos.pass2)}
                WHERE id = ${pool.escape(datos.usuario)}`;

            await pool.query(sql);
            return true

        } else return { existe: 0 }
    }



    actualizarMiPerfil = async (datos) => {
        const sqlExists = `SELECT * FROM usuario WHERE 
            ci = ${pool.escape(datos.ci)} 
            and id !=${pool.escape(datos.usuario)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sqlExists = `SELECT * FROM usuario WHERE 
            correo = ${pool.escape(datos.correo)} 
            and id !=${pool.escape(datos.usuario)}`;
            const [result] = await pool.query(sqlExists)
            if (result.length === 0) {
                const sql = `UPDATE usuario SET
                nombre = ${pool.escape(datos.nombre)},
                apellidoPaterno = ${pool.escape(datos.apellidoPaterno)},
                apellidoMaterno = ${pool.escape(datos.apellidoMaterno)},
                ci = ${pool.escape(datos.ci)},
                correo = ${pool.escape(datos.correo)},
                telefono= ${pool.escape(datos.telefono)},
                direccion = ${pool.escape(datos.direccion)}
                WHERE id = ${pool.escape(datos.usuario)}`;
                await pool.query(sql);
                return this.miPerfil(datos.usuario)
            } else return { existe: 2 }
        } else return { existe: 1 }
    }

    miPerfil = async (id) => {
        const sql =
            `SELECT u.nombre, u.apellidoPaterno, u.apellidoMaterno, u.ci, u.correo, u.telefono, u.direccion,
            u.username, s.nombre as servicio, r.nombre as rol, u.pass
                     from usuario u left join servicio s on u.idServicio = s.id
                     left join rol r on u.idRol = r.id
                     where u.id = ${pool.escape(id)}
                     `;
        const [rows] = await pool.query(sql)
        return rows
    }





}