import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
import type { Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Prompt(promptDto: PromptDto): Promise<{}>;
    Info(req: Request): string;
    Info2(req: Request): {
        promptDefault: string;
        type: string;
        cmd: string;
        promptImage: string;
    };
    Info3(req: Request): string;
}
