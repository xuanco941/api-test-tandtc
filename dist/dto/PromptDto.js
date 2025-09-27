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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PromptDto {
    contents;
    image;
    modelName;
    type;
}
exports.PromptDto = PromptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, default: "Điều 94 trong hiến pháp năm 2013 quy định điều gì?" }),
    __metadata("design:type", String)
], PromptDto.prototype, "contents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: "", description: "base64 - image/png" }),
    __metadata("design:type", String)
], PromptDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: "gemini-2.5-flash" }),
    __metadata("design:type", String)
], PromptDto.prototype, "modelName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0, description: "0: default, 1: search, 2: hiến pháp, 3: luật cán bộ, 4: tcta, 5: 4files" }),
    __metadata("design:type", Number)
], PromptDto.prototype, "type", void 0);
//# sourceMappingURL=PromptDto.js.map