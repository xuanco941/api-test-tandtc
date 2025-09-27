
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromptDto } from './dto/PromptDto';
import { AppService } from './app.service';
import { FileInputType } from './dto/FileInputType';
import path from 'path';
import type { Request, Response } from 'express'; // Or from '@nestjs/platform-fastify' if using Fastify


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Post('/post')
  @ApiOperation({ summary: 'Đặt câu lệnh muốn hỏi' })
  @ApiResponse({ status: 200, description: 'Trả về câu trả lời' })
  async Prompt(@Body() promptDto: PromptDto) {

    const files: FileInputType[] = [
      { filePath: path.join(__dirname, "assets", "hp-2013.pdf"), name: "hien-phap-2013" },
      { filePath: path.join(__dirname, "assets", "hp-suadoi-2025.pdf"), name: "hien-phap-sua-doi-2025" },
      { filePath: path.join(__dirname, "assets", "luat-can-bo-2025.pdf"), name: "luat-can-bo-cong-chuc-2025" },
      { filePath: path.join(__dirname, "assets", "luat-to-chuc-toa-an.pdf"), name: "luat-to-chuc-toa-an-2024" },
      { filePath: path.join(__dirname, "assets", "toa-an-sua-doi-2025.pdf"), name: "luat-to-chuc-toa-an-sua-doi-2025" }
    ]

    if (!promptDto.contents) {
      promptDto.contents = "Xin chào";
    }

    if (!promptDto.modelName) {
      promptDto.modelName = "gemini-2.5-flash";
    }

    let result: {};

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

  @Get("/")
  Info(@Req() req: Request) {
    const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol;
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host');
    const domain = `${protocol}://${host}`;

    const info = {
      promptImage: `async function pasteImage(){try{const items=await navigator.clipboard.read();for(const item of items){if(item.types.includes("image/png")){const blob=await item.getType("image/png");const reader=new FileReader();reader.onloadend=()=>{const base64=reader.result;fetch("${domain}/post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:"Bạn đang làm câu hỏi trắc nghiệm từ ảnh, hãy chọn đáp án đúng và trả lời ngắn gọn:",image:base64})}).then((res)=>res.json()).then(data=>{console.log(data);alert(data.data)})};reader.readAsDataURL(blob)}}}catch(err){console.error("Clipboard error:",err)}}document.addEventListener('keydown',(e)=>{if(e.key.toLowerCase()==='p'||e.key.toLocaleLowerCase()==='y'){console.log(e.key);pasteImage()}});`,
      promptDefault: `fetch("${domain}/post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:"",type:0})}).then((res)=>res.json()).then(data=>{console.log(data)});`,
      type: `1:search, 2:hiến pháp, 3:luật cán bộ, 4:tòa án, 5:all files, 6:image`
    }
    return info;
  }


  // @Get('/loadCache')
  // async LoadCache() {

  //   const modelNameDefault = "gemini-2.5-flash";
  //   const cacheName = "hp-2013";

  //   const cache = await this.appService.CreateFileCache("./assets/hp-2013.pdf", modelNameDefault, cacheName, "application/pdf", "Đây là hiến pháp năm 2013")
  //   return { message: "success", data: cache, statusCode: 200 } as ResponseDto<any>;
  // }
}
