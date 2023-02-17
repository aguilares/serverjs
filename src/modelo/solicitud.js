
import pool from './bdConfig.js'

export class Solicitud {

    // METODOS SOLICITANTE
    // caso de uso listar Solicitud
    listarServicios = async () => {
        const sql =
            `select s.id, s.nombre from 
                servicio s 
                inner join area a on s.idArea = a.id
                where a.laboratorio = true`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarItemServicios = async (id) => {
        const sql =
            `select itm.id, itm.nombre as item from itemservicio itm 
            inner join servicio s on itm.idServicio = s.id
            inner join area a on s.idArea = a.id
            where a.laboratorio = true  and itm.encabezado = true and s.id = ${pool.escape(id)}`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarExamen = async (dato) => {
        const sql =
            `select id from itemservicio where codigo = (select codigo from itemservicio WHERE id = ${pool.escape(dato)})`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarS = async (dato) => {
        // console.log(dato)
        const sql =
            `SELECT  s.eliminar, COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            WHERE s.fecha <= NOW() AND s.fecha >= date_add(NOW(), INTERVAL -51 DAY) and s.eliminar = false and 
            s.idUsuarioSol = ${pool.escape(dato)} and item.encabezado = 1
            GROUP BY s.codigoSol order by s.estado ASC , s.id desc limit 250`;
        const [rows] = await pool.query(sql)
        console.log(rows)
        return rows
    }
    countS = async (dato) => {
        const sql =
            `SELECT estado FROM solicitud where eliminar = false and idUsuarioSol =  ${pool.escape(dato)} GROUP by codigoSol`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }

    buscarS = async (dato) => {
        const sql =
            `SELECT   s.eliminar, s.observacion, COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.idUsuarioSol =${pool.escape(dato.usuario)}
            and s.eliminar = false and item.encabezado = true
            and (s.codigoSol = ${pool.escape(dato.dato)}
            or p.nhc = ${pool.escape(dato.dato)}
            or p.ci = ${pool.escape(dato.dato)}
            or p.nombre = ${pool.escape(dato.dato)}
            or p.apellidoPaterno = ${pool.escape(dato.dato)}
            or p.apellidoMaterno = ${pool.escape(dato.dato)})
            GROUP BY s.codigoSol order by s.estado ASC , s.id desc `;
        const [rows] = await pool.query(sql)
        return rows
    }




    cardex = async (dato) => {
        const sql =
            `SELECT s.eliminar, s.observacion, COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where p.id =${pool.escape(dato.id)}
            and item.encabezado = true
            GROUP BY s.codigoSol order by s.id desc `;
        const [rows] = await pool.query(sql)
        return rows
    }


    cardexEspecifico = async (dato) => {
        const sql =
            `SELECT s.eliminar, s.observacion, COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where p.id =${pool.escape(dato.id)} and (
                s.codigoSol = ${pool.escape(dato.campo)} or  s.fecha = ${pool.escape(dato.campo)} 
            )
            and  item.encabezado = true
            GROUP BY s.codigoSol order by s.id desc `;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }




    buscarFechaS = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.idUsuarioSol =${pool.escape(dato.usuario)}
            and s.eliminar = false and item.encabezado = true
            and s.fecha >= ${pool.escape(dato.ini)} and s.fecha <= ${pool.escape(dato.fin)} 
            GROUP BY s.codigoSol order by s.estado ASC , s.id desc `;
        const [rows] = await pool.query(sql)
        return rows
    }


    preanaliticoS = async (dato) => {
        // console.log(dato)
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.idUsuarioSol =${pool.escape(dato.usuario)}
            and s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 0 and s.resultadoRecibido = 0
            GROUP BY s.codigoSol order by s.estado ASC, s.id desc  limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }
    analiticoS = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.idUsuarioSol =${pool.escape(dato.usuario)}
            and s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 0
            GROUP BY s.codigoSol order by s.estado ASC , s.id desc limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }

    postanaliticoS = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,item.nombre as servicio,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.recibidoLab, s.estado, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.idUsuarioSol =${pool.escape(dato.usuario)}
            and s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 1
            GROUP BY s.codigoSol order by s.estado ASC , s.id desc  limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }




    insertarS = async (datos) => {
        // console.log(datos)
        const sqlExists = `SELECT * FROM solicitud WHERE codigoSol = ${pool.escape(datos.codigoSol)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO solicitud SET  ?", datos)
            return resultado
        } else {
            return {
                existe: 1,
            }
        }
    }
    actualizarCodigoS = async (datos) => {
        // console.log(datos)
        const sqlExists = `SELECT * FROM solicitud WHERE codigoSol = ${pool.escape(datos.codigoSol)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO solicitud SET  ?", datos)
            return resultado
        } else {
            return {
                existe: 1,
            }
        }
    }


    actualizarCodigo = async (id, codigo) => {
        // console.log('actualizando codigo: ', id, codigo)
        let c = 0
        id.forEach(async ids => {
            const sql = `UPDATE solicitud SET
            codigoSol = ${pool.escape(codigo)}
            WHERE id = ${pool.escape(ids)}`;
            await pool.query(sql)
                .then(async j => {
                    let afectados = j[0].affectedRows
                    if (afectados > 0) {
                        c++
                        if (id.length === c) {
                            return
                        }
                    }
                })

        })
    }



    eliminarS = async (dato) => {
        console.log(dato, 'solicitud en el modelos del backend, alistandose para eliminar el registro')
        const sql = `delete from solicitud
        WHERE codigoSol =  ${pool.escape(dato)}
        and estado = false and recibidoLab = 0 and publisher = false`;
        const [resultado] = await pool.query(sql)
        return resultado
    }


    generarInformeS = async (dato) => {

        // console.log('entra al bucle')
        const sql =
            `SELECT s.id, s.fecha,
            upper(concat(p.nombre ,' ', p.apellidoPaterno, ' ', p.apellidoMaterno)) as paciente, p.nhc, 					p.fechaNac, p.sexo, 
			upper(concat(u.nombre," " ,u.apellidoPaterno," ", u.apellidoMaterno )) as solicitante,
            s.fechaHoraPublicacionRes, 

            
            ism.nombre as prueba, ism.encabezado, ism.codigo,
			s.resultado, i.unidad,  i.intervalo, s.firma,i.metodologia


            FROM solicitud s 
            inner join itemservicio ism on s.idItemServicio = ism.id
            inner join paciente p on s.idPaciente = p.id
            inner join usuario u on s.idUsuarioSol = u.id
            left join intervalo i on s.idIntervalo = i.id
            where s.codigoSol =  ${pool.escape(dato.codigoSol)}
        	and s.publisher = true order BY ism.encabezado DESC`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        if (rows.length > 0) {
            const sql = `UPDATE solicitud SET
            resultadoRecibido = true,
            fechaGenInforme = ${pool.escape(dato.fecha)}
            WHERE codigoSol = ${pool.escape(dato.codigoSol)}`;

            const [resultado] = await pool.query(sql);
            const sql_ = `Select red, nombre, direccion, telefono from hospital`;
            const hospital = await pool.query(sql_)
            if (resultado.affectedRows > 0) {
                return [rows, hospital]
            }
        }
    }



    generarInformeImagen = async (dato) => {

        const sql = `UPDATE solicitud SET
            resultadoRecibido = true,
            fechaGenInforme = ${pool.escape(dato.fecha)}
            WHERE codigoSol = ${pool.escape(dato.codigoSol)}`;
        await pool.query(sql);


        const dataImg = await this.obtenerImagenes(dato.id)
        // console.log(dataImg)
        // const sol = await this.verSolicitudL(dato.codigoSol)
        return dataImg
    }









    verSolicitud = async (dato1, dato2) => {

        const sql =
            `SELECT s.id, s.idUsuarioSol, DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha, s.horaSol,
            s.idPaciente, p.ci,DATE_FORMAT(p.fechaNac, "%Y-%m-%d") as fechaNac, p.sexo,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,
            p.nhc, s.codigoSol,s.resultadoRecibido, s.estado, s.fechaHoraAutorizacion, s.publisher,
            s.fechaRecLab,s.horaRecLab, s.fechaGenInforme,s.fechaHoraPublicacionRes,
            s.diagnostico,s.idUsuarioLab,s.rol,
            
            upper(concat(u.nombre, " ",u.apellidoPaterno, " " , u.apellidoMaterno)) as solicitante,
            item.id as idItemServicio, item.nombre as servicioSolicitado,
            ser.id as idServicio, 
            seg.id as idSeguro, seg.nombre as seguro
            
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join usuario u on s.idUsuarioSol = u.id
            
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join seguro seg on s.idSeguro = seg.id
            WHERE s.codigoSol = ${pool.escape(dato1)} and item.encabezado = 1`;
        const [rows] = await pool.query(sql)

        // console.log(rows[0].idUsuarioSol, dato2)

        if (rows[0].idUsuarioSol == dato2) {
            return [rows, 1]
        }
        else {
            return [rows, 0]
        }

    }































    // ADMINISTRADOR



    verSolicitudA = async (dato1, dato2) => {
        console.log('ver solicitud', dato1)

        const sql =
            `SELECT s.idUsuarioSol, DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha, s.horaSol,
            idPaciente, p.ci,DATE_FORMAT(p.fechaNac, "%Y-%m-%d") as fechaNac, p.sexo,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,
            p.nhc, s.codigoSol,s.resultadoRecibido, s.estado, s.fechaHoraAutorizacion,
            s.recibidoLab,s.fechaRecLab,s.horaRecLab, s.fechaGenInforme,s.fechaHoraPublicacionRes, s.publisher,
            s.diagnostico,s.firma,
            
            upper(concat(u.nombre, " ",u.apellidoPaterno, " " , u.apellidoMaterno)) as solicitante,
            item.id as idItemServicio, item.nombre as servicioSolicitado,
            ser.id as idServicio, 
            seg.id as idSeguro, seg.nombre as seguro
            
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join usuario u on s.idUsuarioSol = u.id
            
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join seguro seg on s.idSeguro = seg.id
            WHERE s.codigoSol = ${pool.escape(dato1)} and item.encabezado = 1`;
        const [rows] = await pool.query(sql)
        return rows
        // console.log('model ver solitud. ',rows)
    }


    obtenerSello = async (img) => {
        const sql = `select firma
        from solicitud
        where firma = "${img}"`;
        const [rows] = await pool.query(sql)
        return rows
    }


    // por servicio
    reportesS = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
                concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
                ser.nombre as servicio, item.nombre as item
                from solicitud s
                inner join seguro se on s.idSeguro= se.id
                inner join itemservicio item on s.idItemServicio = item.id
                inner join servicio ser on item.idServicio = ser.id
                inner join usuario u on s.idUsuarioSol = u.id
                inner join paciente p on s.idPaciente = p.id
                WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and ser.id=${datos.idServicio}
                and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
                order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // no autorizados
    reportesEstadoSA = async (datos) => {


        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}"
            and item.encabezado = 1 and s.estado = 0 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // autorizados
    reportesEstadoCA = async (datos) => {
        console.log(datos)


        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci,s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            left join seguro se on s.idSeguro= se.id
            left join itemservicio item on s.idItemServicio = item.id
            left join servicio ser on item.idServicio = ser.id
            left join usuario u on s.idUsuarioSol = u.id
            left join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}"
            and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // todas autorizados y no autorizados

    reportesMedico = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and u.id = ${datos.idMedico}
            and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    reportes1 = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and se.id = ${datos.idSeguro}
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    reportes = async (datos) => {
        let data = []
        const seguro = `select id, nombre
        from seguro
        order by id desc;`;


        const [rowsSeguro] = await pool.query(seguro)


        data.push(rowsSeguro)


        const sql =
            `select  se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}"
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;


        const [rows] = await pool.query(sql)
        // console.log(sql)
        // console.log(rows, 'data de la solicitud')

        data.push(rows)

        const sqlServicio =
            `SELECT s.id, s.nombre FROM area a inner join servicio s on a.id = s.idArea WHERE a.laboratorio = 1`;
        const [rowsServicio] = await pool.query(sqlServicio)

        data.push(rowsServicio)

        const sqlMedico =
            `SELECT u.id, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as nombre FROM usuario u inner join rol r on r.id = u.idRol WHERE r.numero = 2`;
        const [rowsMedico] = await pool.query(sqlMedico)

        data.push(rowsMedico)
        return data
    }

    grafic = async (datos) => {

        let data = []
        const seguro = `select se.nombre as seguro, count(item.id) as cantidad
        from solicitud s
        inner join seguro se on s.idSeguro= se.id
        inner join itemservicio item on s.idItemServicio = item.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        order by s.id desc;`;

        const [rowsSeguro] = await pool.query(seguro)


        data.push(rowsSeguro)

        const servicio = `select  se.nombre as servicio, count(item.id) as cantidad
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        order by se.id desc;`;
        const [rowsServicio] = await pool.query(servicio)
        data.push(rowsServicio)



        const fecha = `select count(s.fecha) as cantidad,  DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE  s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by s.fecha
        order by s.id asc;`;

        const [rowsFecha] = await pool.query(fecha)


        data.push(rowsFecha)

        // console.log(data)
        return data
    }




























    countA = async () => {
        const sql =
            `SELECT estado FROM solicitud where eliminar = false GROUP by codigoSol`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }


    listarA = async () => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on item.id = s.idItemServicio
            WHERE s.eliminar = false and item.encabezado = true and estado = false
            GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }

    autorizarSolicitud = async (dato) => {
        // console.log(dato)
        const sql = `UPDATE solicitud SET
        idUsuarioAdmin = ${pool.escape(dato.usuario)},

        estado = true,
        fechaHoraAutorizacion = ${pool.escape(dato.fecha)},        
        firma = "${dato.sello}"
        WHERE codigoSol = ${pool.escape(dato.codigoSol)}`;
        await pool.query(sql);
        // console.log(await this.verSolicitud(dato.codigoSol))
        return await this.verSolicitudA(dato.codigoSol)
    }
    eliminarA = async (dato) => {
        // console.log(dato)
        const sql = `UPDATE solicitud SET
        idUsuarioAdmin = ${pool.escape(dato.usuario)},
        observacion = ${pool.escape(dato.observacion)},
        eliminar = true
        WHERE codigoSol = ${pool.escape(dato.codigoSol)}`;
        await pool.query(sql);
        // console.log(await this.verSolicitud(dato.codigoSol))
        return await this.listarA()
    }


    buscarA = async (dato) => {
        console.log(dato)
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio ism on s.idItemServicio = ism.id
            where  s.eliminar = false and ism.encabezado = true
            and (s.codigoSol like '${dato.dato}%'
            or s.fecha like '${dato.dato}%'
            or p.ci like '${dato.dato}%'
            or p.nombre like '${dato.dato}%'
            or p.apellidoPaterno like '${dato.dato}%'
            or p.apellidoMaterno like '${dato.dato}%')
            GROUP BY s.codigoSol order by s.id DESC`;
            // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }


    buscarFechaA = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where  s.eliminar = false and item.encabezado = true
            and s.fecha >= ${pool.escape(dato.ini)} and s.fecha <= ${pool.escape(dato.fin)}
            GROUP BY s.codigoSol order by s.id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }


    preanaliticoA = async () => {
        // console.log(dato)
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where  s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 0 and s.resultadoRecibido = 0
            GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }
    analiticoA = async () => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 0
            GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }

    postanaliticoA = async () => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
            p.nhc,s.codigoSol,s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join itemservicio item on s.idItemServicio = item.id
            where s.eliminar = false and item.encabezado = true
            and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 1
            GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    listarL = async (servicio) => {
        // console.log(dato)
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol,s.estado, s.recibidoLab, s.resultadoRecibido, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE s.eliminar = false and 
        se.id = ${pool.escape(servicio)}  and item.encabezado = true and s.estado = 1 and s.resultadoRecibido = 0
        GROUP BY s.codigoSol order by s.id DESC  LIMIT 250`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }
    countL = async (dato) => {
        const sql =
            `SELECT estado FROM solicitud s 
            inner join itemservicio item on s.idItemServicio = item.id 
            inner join servicio se on item.idServicio = se.id 
            WHERE s.eliminar = FALSE AND se.id = ${pool.escape(dato)}
            GROUP BY s.codigoSol`;
        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }

    buscarL = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol, s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio ism on s.idItemServicio = ism.id
        inner join servicio ser on ism.idServicio = ser.id
        where ser.id =${pool.escape(dato.idServicio1)}
        and s.eliminar = false and ism.encabezado = true
        and (s.codigoSol like '${dato.dato}%'
        or s.fecha like '${dato.dato}%'
        or p.ci like '${dato.dato}%'
        or p.nombre like '${dato.dato}%'
        or p.apellidoPaterno like '${dato.dato}%'
        or p.apellidoMaterno like '${dato.dato}%') and s.estado = 1
        GROUP BY s.codigoSol order by s.id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }


    buscarFechaL = async (dato) => {
        console.log(dato, 'fecha desde el cliente')
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol,s.resultadoRecibido, s.estado,s.recibidoLab, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio ism on s.idItemServicio = ism.id
        inner join servicio ser on ism.idServicio = ser.id
        where ser.id =${pool.escape(dato.idServicio1)}
        and s.eliminar = false and ism.encabezado = true and estado = true
        and s.fecha >= ${pool.escape(dato.ini)} and s.fecha <= ${pool.escape(dato.fin)}
        GROUP BY s.codigoSol order by s.id DESC`;
        const [rows] = await pool.query(sql)
        return rows
    }


    preanaliticoL = async (dato) => {
        // console.log(dato)
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol, s.estado, s.recibidoLab, s.resultadoRecibido, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio ism on s.idItemServicio = ism.id
        inner join servicio ser on ism.idServicio = ser.id
        where ser.id =${pool.escape(dato.idServicio1)}
        and s.eliminar = false and ism.encabezado = true and estado = true
        and s.recibidoLab = 1 and s.publisher = 0 and s.resultadoRecibido = 0
        GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }
    analiticoL = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol, s.estado, s.recibidoLab, s.resultadoRecibido, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio ism on s.idItemServicio = ism.id
        inner join servicio ser on ism.idServicio = ser.id
        where ser.id =${pool.escape(dato.idServicio1)}
        and s.eliminar = false and ism.encabezado = true
        and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 0
        GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }

    postanaliticoL = async (dato) => {
        const sql =
            `SELECT  COUNT(*) as cantidad, s.id,DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha,p.ci,
        upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente,s.diagnostico,
        p.nhc,s.codigoSol, s.estado, s.recibidoLab, s.resultadoRecibido, s.publisher
        FROM solicitud s 
        inner join paciente p on s.idPaciente = p.id
        inner join itemservicio ism on s.idItemServicio = ism.id
        inner join servicio ser on ism.idServicio = ser.id
        where ser.id =${pool.escape(dato.idServicio1)}
        and s.eliminar = false and ism.encabezado = true
        and s.recibidoLab = 1 and s.publisher = 1 and s.resultadoRecibido = 1
        GROUP BY s.codigoSol order by s.id DESC limit 250`;
        const [rows] = await pool.query(sql)
        return rows
    }



    verSolicitudL = async (dato) => {

        const sql =
            `SELECT s.obs, item.codigo, s.parcial, i.id as intervalo,i.descripcion, s.id, DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha, s.horaSol,
            idPaciente, p.ci,DATE_FORMAT(p.fechaNac, "%Y-%m-%d") as fechaNac, p.sexo,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente, p.ci,
            p.nhc, s.codigoSol,s.resultadoRecibido,  s.fechaHoraAutorizacion,
            s.fechaRecLab,s.horaRecLab, s.fechaGenInforme,s.fechaHoraPublicacionRes, s.publisher,s.resultadoRecibido,
            s.diagnostico,
            
            upper(concat(u.nombre, " ",u.apellidoPaterno, " " , u.apellidoMaterno)) as solicitante,
            item.id as idItemServicio, item.nombre as servicioSolicitado, item.encabezado, item.codigo,
            ser.id as idServicio, 
            seg.id as idSeguro, seg.nombre as seguro,
            
            s.resultado, 
            se.nombre as servicio
            
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join usuario u on s.idUsuarioSol = u.id
            
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join seguro seg on s.idSeguro = seg.id
            inner join servicio se on item.idServicio = se.id
            LEFT join  intervalo i on s.idIntervalo = i.id
            WHERE s.codigoSol = ${pool.escape(dato)} order by item.encabezado desc`;
        const [rows] = await pool.query(sql)
        //   console.log(rows,'modelo')
        return rows
    }

    verSolicitudUpdate = async (dato) => {

        if (dato.rol === 4) {

            const sql = `UPDATE solicitud SET
            recibidoLab = true,
            fechaRecLab = ${pool.escape(dato.fecha)},
            horaRecLab = ${pool.escape(dato.fecha)},
            resultado = 'SERVICIO BRINDADO',
            fechaHoraPublicacionRes = ${pool.escape(dato.fecha + ' ' + dato.hora)},
            publisher = true,
            idUsuarioLab  = ${pool.escape(dato.usuario)},
            rol=${pool.escape(dato.rol)}
            WHERE codigoSol = ${pool.escape(dato.codigoSol)} and resultadoRecibido = false`;
            await pool.query(sql);
        }
        const sql =
            `SELECT s.obs, item.codigo, s.parcial,  i.id as intervalo,i.descripcion, s.id, DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha, s.horaSol,
            idPaciente, p.ci,DATE_FORMAT(p.fechaNac, "%Y-%m-%d") as fechaNac, p.sexo,
            upper(concat(p.nombre, " ",p.apellidoPaterno, " " , p.apellidoMaterno)) as paciente, p.ci,
            p.nhc, s.codigoSol,s.resultadoRecibido,  s.fechaHoraAutorizacion,
            s.fechaRecLab,s.horaRecLab, s.fechaGenInforme,s.fechaHoraPublicacionRes, s.estado, s.publisher,s.resultadoRecibido,
            s.diagnostico,
            
            upper(concat(u.nombre, " ",u.apellidoPaterno, " " , u.apellidoMaterno)) as solicitante,
            item.id as idItemServicio, item.nombre as servicioSolicitado, item.encabezado, 
            ser.id as idServicio, 
            seg.id as idSeguro, seg.nombre as seguro,
            s.resultado, 
            se.nombre as servicio
            
            FROM solicitud s 
            inner join paciente p on s.idPaciente = p.id
            inner join usuario u on s.idUsuarioSol = u.id
            
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join seguro seg on s.idSeguro = seg.id
            inner join servicio se on item.idServicio = se.id
            LEFT join  intervalo i on s.idIntervalo = i.id
          
            WHERE s.codigoSol = ${pool.escape(dato.codigoSol)} order by item.encabezado  DESC`;
        const [rows] = await pool.query(sql)
        if (rows.length > 0) {
            const sql = `UPDATE solicitud SET
            recibidoLab = true,
            idUsuarioLab  = ${pool.escape(dato.usuario)},
            rol=${pool.escape(dato.rol)},
            fechaRecLab = ${pool.escape(dato.fecha)},
            horaRecLab = ${pool.escape(dato.fecha)}
            WHERE codigoSol = ${pool.escape(dato.codigoSol)} and recibidoLab = false`;
            await pool.query(sql);

            return [rows, dato.rol]
        }
    }

    guardarResutadosLaboratorio = async (solicitud, usuario, rol) => {
        const sql = `UPDATE solicitud SET
            idUsuarioLab  = ${pool.escape(usuario)},
            rol = ${pool.escape(rol)},
            idIntervalo = ${pool.escape(solicitud.intervalo)},
            resultado = ${pool.escape(solicitud.resultado)}
            WHERE id = ${pool.escape(solicitud.id)} and resultadoRecibido = false`;
        const final = await pool.query(sql);
        return final
    }




    guardarResutadosLaboratorio = async (solicitud, usuario, rol) => {
        const sql = `UPDATE solicitud SET
            idUsuarioLab  = ${pool.escape(usuario)},
            rol = ${pool.escape(rol)},
            idIntervalo = ${pool.escape(solicitud.intervalo)},
            resultado = ${pool.escape(solicitud.resultado)}
            WHERE id = ${pool.escape(solicitud.id)} and resultadoRecibido = false`;
        const final = await pool.query(sql);
        return final
    }

    reportarLaboratorio = async (fecha, codigo, usuario) => {
        const sql = `UPDATE solicitud SET
            idUsuarioLab  = ${pool.escape(usuario)},
            fechaHoraPublicacionRes  = ${pool.escape(fecha)},
            publisher = 1
            WHERE codigoSol = ${pool.escape(codigo)} and resultadoRecibido = 0`;
        await pool.query(sql);
        return await this.verSolicitudUpdate({ codigoSol: codigo })
    }



















    insertarReporteImagen = async (dato, codigo, obs) => {

        const sql = `UPDATE solicitud SET
        resultado='FORMATO IMAGEN',
        obs = ${pool.escape(obs)},
        parcial = true
        WHERE id = ${pool.escape(dato.idSolicitud)} and resultadoRecibido = false`;
        await pool.query(sql);
        await pool.query("INSERT INTO img SET  ?", dato)
        return [await this.obtenerImagenes(dato.idSolicitud), await this.verSolicitudL(codigo)]
    }

    obtenerImagenes = async (id) => {
        // console.log(id, 'listado desde bd')
        const sql =
            `SELECT s.obs,  i.idSolicitud,  nombre as imagen from solicitud s inner join img i on i.idSolicitud = s.id
            where s.id = ${pool.escape(id)}`;

        const [rows] = await pool.query(sql)
        // console.log(rows)
        return rows
    }
    eliminarImagen = async (imagen, codigo, id) => {

        const result = await this.verSolicitudL(codigo)

        if (result[0].resultadoRecibido === 0) {
            const sql = `delete from img
            WHERE nombre = ${pool.escape(imagen)} `;
            await pool.query(sql);


            const listImg = await this.obtenerImagenes(id)
            let ok = false
            await result.forEach(async s => {
                if (listImg.length > 0) {
                    await listImg.forEach(i => {
                        if (s.id === i.idSolicitud) {
                            s.resultado = 'RESULTADO FORMATO IMAGEN'
                            ok = true
                        }
                    })
                }
                if (ok == false) {
                    const sql = `UPDATE solicitud SET
                    resultado=null,
                    obs = '',
                    parcial = false
                    WHERE id = ${pool.escape(id)}`;
                    await pool.query(sql);
                    s.resultado = null
                    ok = false
                }
            })
            const verSol = await this.verSolicitudL(codigo)
            const dataImg = await this.obtenerImagenes(id)
            return [dataImg, verSol]
        }
    }


























    ///// reportes solicitante



    graficSol = async (datos) => {

        let data = []
        const seguro = `select se.nombre as seguro, count(item.id) as cantidad
        from solicitud s
        inner join seguro se on s.idSeguro= se.id
        inner join itemservicio item on s.idItemServicio = item.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        `;

        const [rowsSeguro] = await pool.query(seguro)
        data.push(rowsSeguro)

        const servicio = `select  se.nombre as servicio, count(item.id) as cantidad
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        `;
        const [rowsServicio] = await pool.query(servicio)
        data.push(rowsServicio)



        const fecha = `select count(s.fecha) as cantidad,  DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE  s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by s.fecha, s.id
        `;
        // order by s.id asc;

        const [rowsFecha] = await pool.query(fecha)


        data.push(rowsFecha)

        // console.log(data)
        return data
    }

    reportesSSol = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
                concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
                ser.nombre as servicio, item.nombre as item
                from solicitud s
                inner join seguro se on s.idSeguro= se.id
                inner join itemservicio item on s.idItemServicio = item.id
                inner join servicio ser on item.idServicio = ser.id
                inner join usuario u on s.idUsuarioSol = u.id
                inner join paciente p on s.idPaciente = p.id
                WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and ser.id=${datos.idServicio}
                and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
                order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // no autorizados
    reportesEstadoSASol = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)}
            and item.encabezado = 1 and s.estado = 0 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // autorizados
    reportesEstadoCASol = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci,s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            left join seguro se on s.idSeguro= se.id
            left join itemservicio item on s.idItemServicio = item.id
            left join servicio ser on item.idServicio = ser.id
            left join usuario u on s.idUsuarioSol = u.id
            left join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)}
            and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }




    reportes1Sol = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and se.id = ${datos.idSeguro} and s.idUsuarioSol = ${pool.escape(datos.usuario)}
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    reportesSol = async (datos) => {
        console.log(datos)
        let data = []
        const seguro = `select id, nombre
        from seguro
        order by id desc;`;


        const [rowsSeguro] = await pool.query(seguro)


        data.push(rowsSeguro)


        const sql =
            `select  se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and s.idUsuarioSol = ${pool.escape(datos.usuario)}
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;


        const [rows] = await pool.query(sql)
        // console.log(sql)
        // console.log(rows, 'data de la solicitud')

        data.push(rows)

        const sqlServicio =
            `SELECT s.id, s.nombre FROM area a inner join servicio s on a.id = s.idArea WHERE a.laboratorio = 1`;
        const [rowsServicio] = await pool.query(sqlServicio)

        data.push(rowsServicio)

        return data
    }

























    // TECNICO DE SERVICIOS COMPLEMENTARIOS


    reportesSTec = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
                concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
                ser.nombre as servicio, item.nombre as item
                from solicitud s
                inner join seguro se on s.idSeguro= se.id
                inner join itemservicio item on s.idItemServicio = item.id
                inner join servicio ser on item.idServicio = ser.id
                inner join usuario u on s.idUsuarioSol = u.id
                inner join paciente p on s.idPaciente = p.id
                WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and item.id=${datos.idServicio}
                and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
                order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    // todas autorizados y no autorizados

    reportesMedicoTec = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and u.id = ${datos.idMedico} and ser.id= ${datos.idServicio1}
            and item.encabezado = 1 and s.estado = 1 and s.eliminar = 0
            order by se.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    reportes1Tec = async (datos) => {

        const sql =
            `select   se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and se.id = ${datos.idSeguro} and ser.id= ${datos.idServicio1}
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;

        const [rows] = await pool.query(sql)
        return rows
    }


    reportesTec = async (datos) => {
        let data = []
        const seguro = `select id, nombre
        from seguro
        order by id desc;`;


        const [rowsSeguro] = await pool.query(seguro)


        data.push(rowsSeguro)


        const sql =
            `select  se.nombre as seguro, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as solicitante,
            concat( p.nombre,' ',p.apellidoPaterno,' ' ,p.apellidoMaterno) as paciente, p.ci, s.codigosol,
            ser.nombre as servicio, item.nombre as item
            from solicitud s
            inner join seguro se on s.idSeguro= se.id
            inner join itemservicio item on s.idItemServicio = item.id
            inner join servicio ser on item.idServicio = ser.id
            inner join usuario u on s.idUsuarioSol = u.id
            inner join paciente p on s.idPaciente = p.id
            WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and ser.id= ${datos.idServicio1}
            and item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
            order by s.id desc;`;


        const [rows] = await pool.query(sql)
        // console.log(sql)
        // console.log(rows, 'data de la solicitud')

        data.push(rows)

        const sqlServicio =
            `SELECT item.id, item.nombre FROM itemServicio item 
            inner join servicio s on item.idServicio = s.id
            inner join area a on s.idArea = a.id
             WHERE a.laboratorio = 1 and s.id = ${pool.escape(datos.idServicio1)} and item.encabezado = 1`;
        const [rowsServicio] = await pool.query(sqlServicio)

        data.push(rowsServicio)

        const sqlMedico =
            `SELECT u.id, concat( u.nombre,' ',u.apellidoPaterno,' ',u.apellidoMaterno) as nombre FROM usuario u inner join rol r on r.id = u.idRol WHERE r.numero = 2`;
        const [rowsMedico] = await pool.query(sqlMedico)

        data.push(rowsMedico)
        return data
    }

    graficTec = async (datos) => {

        let data = []
        const seguro = `select se.nombre as seguro, count(item.id) as cantidad
        from solicitud s
        inner join seguro se on s.idSeguro= se.id
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio ser on item.idServicio = ser.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and ser.id = ${datos.idServicio1} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        order by s.id desc;`;

        const [rowsSeguro] = await pool.query(seguro)


        data.push(rowsSeguro)

        const servicio = `select  se.nombre as servicio, count(item.id) as cantidad
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and se.id = ${datos.idServicio1} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by se.nombre
        order by se.id desc;`;
        const [rowsServicio] = await pool.query(servicio)
        data.push(rowsServicio)



        const fecha = `select count(s.fecha) as cantidad,  DATE_FORMAT(s.fecha, "%Y-%m-%d") as fecha
        from solicitud s
        inner join itemservicio item on s.idItemServicio = item.id
        inner join servicio se on item.idServicio = se.id
        WHERE  s.fecha >= "${datos.ini}" and s.fecha <= "${datos.fin}" and se.id = ${datos.idServicio1} and
        item.encabezado = 1 and s.estado = 1 and s.recibidoLab = 1 and s.eliminar = 0
        GROUP by s.fecha
        order by s.id asc;`;

        const [rowsFecha] = await pool.query(fecha)


        data.push(rowsFecha)

        // console.log(data)
        return data
    }



}
