"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
let AppService = class AppService {
    configService;
    ai;
    constructor(configService) {
        this.configService = configService;
        this.ai = new genai_1.GoogleGenAI({ apiKey: configService.get("GEMINI_API_KEY") });
    }
    async Prompt(prompt) {
        try {
            const response = await this.ai.models.generateContent({
                model: prompt.modelName,
                contents: prompt.contents,
            });
            console.log(response.text);
            return {
                statusCode: 200,
                message: prompt.contents,
                data: response.text ?? "Data is undefined"
            };
        }
        catch (e) {
            if (e instanceof genai_1.ApiError) {
                return {
                    statusCode: e.status,
                    message: e.name,
                    data: e.message
                };
            }
            return {
                statusCode: 500,
                message: "Lỗi hệ thống",
                data: "Lỗi hệ thống"
            };
        }
    }
    async PromptWithSearch(prompt) {
        try {
            const groundingTool = {
                googleSearch: {},
            };
            const response = await this.ai.models.generateContent({
                model: prompt.modelName,
                contents: prompt.contents,
                config: {
                    tools: [groundingTool]
                }
            });
            console.log(response.text);
            return {
                statusCode: 200,
                message: prompt.contents,
                data: response.text ?? "Data is undefined"
            };
        }
        catch (e) {
            if (e instanceof genai_1.ApiError) {
                return {
                    statusCode: e.status,
                    message: e.name,
                    data: e.message
                };
            }
            return {
                statusCode: 500,
                message: "Lỗi hệ thống",
                data: "Lỗi hệ thống"
            };
        }
    }
    async PromptWithFile(prompt, files) {
        try {
            const content = [prompt.contents];
            for (const item of files) {
                let file1 = await this.UploadRemotePDF(item.filePath, item.name);
                if (file1) {
                    if (file1.uri && file1.mimeType) {
                        const fileContent = (0, genai_1.createPartFromUri)(file1.uri, file1.mimeType);
                        content.push(fileContent);
                    }
                }
            }
            const response = await this.ai.models.generateContent({
                model: prompt.modelName,
                contents: content,
            });
            console.log(response.text);
            return {
                statusCode: 200,
                message: prompt.contents,
                data: response.text ?? "Data is undefined"
            };
        }
        catch (e) {
            console.log(e);
            if (e instanceof genai_1.ApiError) {
                return {
                    statusCode: e.status,
                    message: e.name,
                    data: e.message
                };
            }
            return {
                statusCode: 500,
                message: "Lỗi hệ thống",
                data: "Lỗi hệ thống"
            };
        }
    }
    async PromptWithImage(prompt) {
        try {
            const response = await this.ai.models.generateContent({
                model: prompt.modelName,
                contents: [
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: prompt.image,
                        },
                    },
                    { text: prompt.contents }
                ],
            });
            console.log(response.text);
            return {
                statusCode: 200,
                message: "success",
                data: response.text ?? "Data is undefined"
            };
        }
        catch (e) {
            if (e instanceof genai_1.ApiError) {
                return {
                    statusCode: e.status,
                    message: e.name,
                    data: e.message
                };
            }
            return {
                statusCode: 500,
                message: "Lỗi hệ thống",
                data: "Lỗi hệ thống"
            };
        }
    }
    async PromptWithCache(prompt, cacheName) {
        try {
            const response = await this.ai.models.generateContent({
                model: prompt.modelName,
                contents: prompt.contents,
                config: {
                    cachedContent: cacheName
                }
            });
            console.log(response.text);
            return {
                statusCode: 200,
                message: 'success',
                data: response.text ?? "Data is undefined"
            };
        }
        catch (e) {
            if (e instanceof genai_1.ApiError) {
                return {
                    statusCode: e.status,
                    message: e.name,
                    data: e.message
                };
            }
            return {
                statusCode: 500,
                message: "Lỗi hệ thống",
                data: "Lỗi hệ thống"
            };
        }
    }
    async CreateFileCache(pdfPath, modelName, cacheName, mimeType = "application/pdf", systemInstruction = "You are an expert analyzing transcripts.", ttl = 1555200000) {
        try {
            const doc = await this.ai.files.upload({
                file: pdfPath,
                config: { mimeType: mimeType },
            });
            if (doc && doc.uri && doc.mimeType) {
                const cache = await this.ai.caches.create({
                    model: modelName,
                    config: {
                        contents: (0, genai_1.createUserContent)((0, genai_1.createPartFromUri)(doc.uri, doc.mimeType)),
                        systemInstruction: systemInstruction,
                        ttl: `${ttl}s`,
                        displayName: cacheName
                    },
                });
                return cache;
            }
            return null;
        }
        catch (e) {
            return e;
        }
    }
    async DeleteCache(cacheName) {
        await this.ai.caches.delete({ name: cacheName });
    }
    async GetListModels() {
        const list = await this.ai.models.list();
        return list;
    }
    async GetListCaches() {
        console.log("My caches:");
        const pager = await this.ai.caches.list({ config: { pageSize: 10 } });
        let page = pager.page;
        while (true) {
            for (const c of page) {
                console.log("    ", c.name);
            }
            if (!pager.hasNextPage())
                break;
            page = await pager.nextPage();
        }
    }
    async IsCachesExist(cacheName) {
        const cache = await this.ai.caches.get({ name: cacheName });
        return cache ? true : false;
    }
    async UploadRemotePDF(filePath, displayName) {
        const pdfBuffer = fs.readFileSync(filePath);
        const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });
        const file = await this.ai.files.upload({
            file: fileBlob,
            config: {
                displayName: displayName,
            },
        });
        if (!file.name) {
            return null;
        }
        let getFile = await this.ai.files.get({ name: file.name });
        while (getFile.state === 'PROCESSING') {
            getFile = await this.ai.files.get({ name: file.name });
            console.log(`current file status: ${getFile.state}`);
            console.log('File is still processing, retrying in 5 seconds');
            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
        if (file.state === 'FAILED') {
            throw new Error('File processing failed.');
        }
        return file;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map