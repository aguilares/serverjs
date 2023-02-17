import {config} from 'dotenv'
config()

export const PORT = process.env.PORT || 3001

export const DB_HOST = process.env.DB_HOST || 'containers-us-west-110.railway.app';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'ZHFSW66d5vLgbSo69iFg';
export const DB_DATABASE = process.env.DB_DATABASE || 'railway';
export const DB_PORT = process.env.DB_PORT || 6753;
export const KEY = process.env.KEY || 'KEY2022'
export const CLAVEGMAIL = process.env.CLAVEGMAIL || 'chwsjbjcespeucol'