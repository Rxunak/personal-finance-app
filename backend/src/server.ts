import app from "./app.js";
import Env from "./utils/env.js";

const start = async () => {
    await app.listen({ port:Env.APP_PORT });
    console.log(`Server started at http://localhost:${Env.APP_PORT} ....`);
}



start()
