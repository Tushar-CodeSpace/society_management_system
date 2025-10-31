import app from './app';
import { connectDb } from './utils/connectDb';
import logger from './utils/logger';

const PORT: number = Number(process.env.PORT) || 3000;
const MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/test_DB';

const startServer = async (db_uri: string, port: number) => {
    try {
        await connectDb(db_uri);
        app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        logger.error(`Error starting server: ${error}`);
        process.exit(1);
    }
}

startServer(MONGO_URI, PORT).catch((error) => {
    logger.error(`Error starting server: ${error}`);
    process.exit(1);
});
