import { config } from "dotenv";
config({ quiet: true });

import { createServer } from "http";
import app from "./app.js";
import { connectMongo } from "./services/mongo.service";

const port = Number(process.env.PORT || 4000);

await connectMongo();
createServer(app).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API http://localhost:${port}`);
});
