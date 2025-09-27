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
        if (!promptDto.contents) {
            promptDto.contents = "Xin chào";
        }
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
        else if (promptDto.type === 6 || promptDto.image) {
            promptDto.image = promptDto.image.replace(/^data:image\/\w+;base64,/, '');
            result = await this.appService.PromptWithImage(promptDto);
        }
        else {
            result = await this.appService.Prompt(promptDto);
        }
        return result;
    }
    Info(req) {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const domain = `${protocol}://${host}`;
        const info = {
            promptImage: `async function pasteImage(){try{const items=await navigator.clipboard.read();for(const item of items){if(item.types.includes("image/png")){const blob=await item.getType("image/png");const reader=new FileReader();reader.onloadend=()=>{const base64=reader.result;fetch("${domain}/post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:"Bạn đang làm câu hỏi trắc nghiệm từ ảnh, hãy chọn đáp án đúng và trả lời ngắn gọn:",image:base64})}).then((res)=>res.json()).then(data=>{console.log(data);alert(data.data)})};reader.readAsDataURL(blob)}}}catch(err){console.error("Clipboard error:",err)}}document.addEventListener('keydown',(e)=>{if(e.key.toLowerCase()==='p'||e.key.toLocaleLowerCase()==='y'){console.log(e.key);pasteImage()}});`,
            promptDefault: `fetch("${domain}/post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:"",type:0})}).then((res)=>res.json()).then(data=>{console.log(data)});`,
            type: `1:search, 2:hiến pháp, 3:luật cán bộ, 4:tòa án, 5:all files, 6:image`
        };
        return info;
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
__decorate([
    (0, common_1.Get)("/"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "Info", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map