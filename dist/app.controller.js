"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const PromptDto_1 = require("./dto/PromptDto");
const app_service_1 = require("./app.service");
const path_1 = __importDefault(require("path"));
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async Prompt(promptDto) {
        const files = [
            { filePath: path_1.default.join(__dirname, "assets", "hp-2013.pdf"), name: "hien-phap-2013" },
            { filePath: path_1.default.join(__dirname, "assets", "hp-suadoi-2025.pdf"), name: "hien-phap-sua-doi-2025" },
            { filePath: path_1.default.join(__dirname, "assets", "luat-can-bo-2025.pdf"), name: "luat-can-bo-cong-chuc-2025" },
            { filePath: path_1.default.join(__dirname, "assets", "luat-to-chuc-toa-an.pdf"), name: "luat-to-chuc-toa-an-2024" },
            { filePath: path_1.default.join(__dirname, "assets", "toa-an-sua-doi-2025.pdf"), name: "luat-to-chuc-toa-an-sua-doi-2025" }
        ];
        if (!promptDto.modelName) {
            promptDto.modelName = "gemini-2.5-flash";
        }
        let result;
        if (promptDto.type === 1) {
            promptDto.contents = "[Pháp luật Việt Nam] Dựa vào thông tin từ thuvienphapluat.vn và chinhphu.vn trả lời câu hỏi: " + promptDto.contents;
            result = await this.appService.PromptWithSearch(promptDto);
        }
        else if (promptDto.type === 2) {
            result = await this.appService.PromptWithFile(promptDto, [files[0], files[1]]);
        }
        else if (promptDto.type === 3) {
            result = await this.appService.PromptWithFile(promptDto, [files[2]]);
        }
        else if (promptDto.type === 4) {
            result = await this.appService.PromptWithFile(promptDto, [files[3], files[4]]);
        }
        else if (promptDto.type === 5) {
            result = await this.appService.PromptWithFile(promptDto, files);
        }
        result = await this.appService.Prompt(promptDto);
        return { ...result, note: "0: default, 1: search, 2: hiến pháp, 3: luật cán bộ, 4: tcta, 5: 4files" };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('/post'),
    (0, swagger_1.ApiOperation)({ summary: 'Đặt câu lệnh muốn hỏi' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về câu trả lời' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PromptDto_1.PromptDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "Prompt", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map