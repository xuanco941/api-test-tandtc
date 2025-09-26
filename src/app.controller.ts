
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Post('/')
  @ApiOperation({ summary: 'Đặt câu lệnh muốn hỏi' })
  @ApiResponse({ status: 200, description: 'Trả về câu trả lời' })
  async Prompt(@Body() promptDto: PromptDto) {

    if (!promptDto.modelName) {
      promptDto.modelName = "gemini-2.5-flash"
    }

    if (promptDto.search === true) {
      promptDto.contents = "Dựa vào thông tin tìm kiếm từ thuvienphapluat.vn hoặc chinhphu.vn hãy lấy thông tin từ 2 trang này và trả lời cho tôi: " + promptDto.contents;
      return await this.appService.PromptWithSearch(promptDto);
    }
    return await this.appService.Prompt(promptDto);

  }

  // @Get('/loadCache')
  // async LoadCache() {

  //   const modelNameDefault = "gemini-2.5-flash";
  //   const cacheName = "hp-2013";

  //   const cache = await this.appService.CreateFileCache("./assets/hp-2013.pdf", modelNameDefault, cacheName, "application/pdf", "Đây là hiến pháp năm 2013")
  //   return { message: "success", data: cache, statusCode: 200 } as ResponseDto<any>;
  // }
}
