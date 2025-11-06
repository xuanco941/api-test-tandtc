import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
import type { Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Prompt(promptDto: PromptDto): Promise<{}>;
    Info(req: Request): {
        promptDefault: string;
        type: string;
        cmd: string;
        promptImage: string;
    };
    Info2(req: Request): string;
    Info3(req: Request): string;
}
