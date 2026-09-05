import app from "./app.js";
import { pool } from "./config/db.js";
import { config } from "./config/index.js";


async function bootstrap() {
    try {
        const client = await pool.connect();
        console.log("Database Connected");
        client.release();

        const server = app.listen(config.port, () => {
            console.log('Server running')
        });

        const exitHandler = () => {
            if(server) {
                server.close(() => {
                    console.log("Server Closed");
                    process.exit(1);
                }) 
            }
            else{
                     process.exit(1);
                }
        }

process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection detected:', err);
      exitHandler();
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception detected:', err);
      exitHandler();
    });
    } catch (error) {
        console.log('Database connection Failed');
        process.exit(1);
    }
}

bootstrap();