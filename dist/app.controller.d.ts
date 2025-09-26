import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Prompt(promptDto: PromptDto): Promise<{
        note: string;
    }>;
}
