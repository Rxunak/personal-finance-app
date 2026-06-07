import "dotenv/config"

class Env{
    static APP_NAME = process.env.APP_NAME || "Finance App"
    // static APP_ENV = process.env.APP_ENV || "development"
    static APP_PORT = process.env.APP_PORT
        ? Number(process.env.APP_PORT)
        : process.env.PORT
          ? Number(process.env.PORT)
          : 8000
    static JWT_SECRET = process.env.JWT_SECRET || "STRONG_SECRET"
    static DATABASE_URL = process.env.DATABASE_URL || ""
    static OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
    static OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini"

}

export default Env;
