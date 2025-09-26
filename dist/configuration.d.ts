import { ConfigType } from "@nestjs/config";
export declare const configuration: () => {
    PORT: string | undefined;
    GEMINI_API_KEY: string | undefined;
};
export type AppConfigType = ConfigType<typeof configuration>;
