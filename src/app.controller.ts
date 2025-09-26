
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
import { FileInputType } from './dto/FileInputType';
import path from 'path';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Post('/')
  @ApiOperation({ summary: 'Đặt câu lệnh muốn hỏi' })
  @ApiResponse({ status: 200, description: 'Trả về câu trả lời' })
  async Prompt(@Body() promptDto: PromptDto) {

    const files: FileInputType[] = [
      { filePath: path.join(__dirname, "assets", "hp-2013.pdf"), name: "hien-phap" },
      { filePath: path.join(__dirname, "assets", "luat-can-bo-2025.pdf"), name: "luat-can-bo-2025" },
      { filePath: path.join(__dirname, "assets", "luat-to-chuc-toa-an.pdf"), name: "luat-to-chuc-toa-an" },
      { filePath: path.join(__dirname, "assets", "toa-an-sua-doi-2025.pdf"), name: "toa-an-sua-doi-2025" }
    ]

    if (!promptDto.modelName) {
      promptDto.modelName = "gemini-2.5-flash"
    }

    let result: {};

    if (promptDto.type === 1) {
      promptDto.contents = "[Pháp luật Việt Nam] Dựa vào thông tin từ thuvienphapluat.vn và chinhphu.vn trả lời câu hỏi: " + promptDto.contents;
      result = await this.appService.PromptWithSearch(promptDto);
    }
    else if (promptDto.type === 2) {
      result = await this.appService.PromptWithFile(promptDto, [files[0]]);
    }
    else if (promptDto.type === 3) {
      result = await this.appService.PromptWithFile(promptDto, [files[1]]);
    }
    else if (promptDto.type === 4) {
      result = await this.appService.PromptWithFile(promptDto, [files[2], files[3]]);
    }
    else if (promptDto.type === 5) {
      result = await this.appService.PromptWithFile(promptDto, files);
    }
    result = await this.appService.Prompt(promptDto);

    return { ...result, note: "0: default, 1: search, 2: hiến pháp, 3: luật cán bộ, 4: tcta, 5: 4files" }

  }

  // @Get('/loadCache')
  // async LoadCache() {

  //   const modelNameDefault = "gemini-2.5-flash";
  //   const cacheName = "hp-2013";

  //   const cache = await this.appService.CreateFileCache("./assets/hp-2013.pdf", modelNameDefault, cacheName, "application/pdf", "Đây là hiến pháp năm 2013")
  //   return { message: "success", data: cache, statusCode: 200 } as ResponseDto<any>;
  // }
}
