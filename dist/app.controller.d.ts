import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
import type { Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Prompt(promptDto: PromptDto): Promise<{}>;
    Info(req: Request): {
        promptImage: string;
        promptDefault: string;
        type: string;
    };
    Info2(req: Request): string;
    Info3(req: Request): string;
}
