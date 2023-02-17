import {config} from 'dotenv'
config()

export const PORT = process.env.PORT || 3001

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'spclaver';
export const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
export const DB_DATABASE = process.env.DB_DATABASE || 'sp';
export const DB_PORT = process.env.DB_PORT || 3306;
export const KEY = process.env.KEY || 'KEY2022'
export const CLAVEGMAIL = process.env.CLAVEGMAIL || 'chwsjbjcespeucol'