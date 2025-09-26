import { ConfigService } from '@nestjs/config';
import { AppConfigType } from 'src/configuration';
import { ResponseDto } from './dto/ResponseDto';
import { PromptDto } from './dto/PromptDto';
import { FileInputType } from './dto/FileInputType';
export declare class AppService {
    private readonly configService;
    private readonly ai;
    constructor(configService: ConfigService<AppConfigType>);
    Prompt(prompt: PromptDto): Promise<ResponseDto<string>>;
    PromptWithSearch(prompt: PromptDto): Promise<ResponseDto<string>>;
    PromptWithFile(prompt: PromptDto, files: FileInputType[]): Promise<ResponseDto<string>>;
    PromptWithCache(prompt: PromptDto, cacheName: string): Promise<ResponseDto<string>>;
    CreateFileCache(pdfPath: string, modelName: string, cacheName: string, mimeType?: string, systemInstruction?: string, ttl?: number): Promise<any>;
    DeleteCache(cacheName: string): Promise<void>;
    GetListModels(): Promise<import("@google/genai", { with: { "resolution-mode": "import" } }).Pager<import("@google/genai", { with: { "resolution-mode": "import" } }).Model>>;
    GetListCaches(): Promise<void>;
    IsCachesExist(cacheName: string): Promise<boolean>;
    UploadRemotePDF(filePath: any, displayName: any): Promise<import("@google/genai", { with: { "resolution-mode": "import" } }).File | null>;
}
