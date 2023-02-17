import { createPool } from "mysql2/promise"
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from '../config.js'

const pool = createPool({
    user: 'root',
    password: 'ZHFSW66d5vLgbSo69iFg',
    host: 'containers-us-west-110.railway.app',
    port: 6753,
    database: 'railway'
})

// const pool = createPool({
//     host: DB_HOST,
//     user: DB_USER,
//     password: DB_PASSWORD,
//     database:DB_DATABASE
//    })



export default pool