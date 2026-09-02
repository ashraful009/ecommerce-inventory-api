import dotenv from 'dotenv'
import path from 'path';

dotenv.config({path : path.join(process.cwd(), '.env')})

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt (process.env.PORT || '5000', 10),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecommerce_db',
    },
};