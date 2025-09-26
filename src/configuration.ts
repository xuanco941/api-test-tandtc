import { ConfigType } from "@nestjs/config";

export const configuration = () => ({
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
});

export type AppConfigType = ConfigType<typeof configuration>;