import { Injectable } from '@nestjs/common';
import { ApiError, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from 'src/configuration';
import { ResponseDto } from './dto/ResponseDto';
import { PromptDto } from './dto/PromptDto';
import * as fs from "fs";
import path from 'path';
import { FileInputType } from './dto/FileInputType';

@Injectable()
export class AppService {

  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService<AppConfigType>) {
    this.ai = new GoogleGenAI({ apiKey: configService.get("GEMINI_API_KEY") });
  }

  async Prompt(prompt: PromptDto): Promise<ResponseDto<string>> {
    try {
      const response = await this.ai.models.generateContent({
        model: prompt.modelName,
        contents: prompt.contents,
        // config: {
        //   thinkingConfig: {
        //     thinkingBudget: 0, // Disables thinking
        //   },
        //   cachedContent: 'a'
        // }
      });
      console.log(response.text);
      return {
        statusCode: 200,
        message: prompt.contents,
        data: response.text ?? "Data is undefined"
      }
    }
    catch (e) {
      if (e instanceof ApiError) {
        return {
          statusCode: e.status,
          message: e.name,
          data: e.message
        }
      }
      return {
        statusCode: 500,
        message: "Lỗi hệ thống",
        data: "Lỗi hệ thống"
      }

    }
  }
  async PromptWithSearch(prompt: PromptDto): Promise<ResponseDto<string>> {
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
      }
    }
    catch (e) {
      if (e instanceof ApiError) {
        return {
          statusCode: e.status,
          message: e.name,
          data: e.message
        }
      }
      return {
        statusCode: 500,
        message: "Lỗi hệ thống",
        data: "Lỗi hệ thống"
      }

    }
  }
  async PromptWithFile(prompt: PromptDto, files: FileInputType[]): Promise<ResponseDto<string>> {
    try {
      const content: any = [prompt.contents];

      for (const item of files) {
        let file1 = await this.UploadRemotePDF(item.filePath, item.name)
        if (file1) {
          if (file1.uri && file1.mimeType) {
            const fileContent = createPartFromUri(file1.uri, file1.mimeType);
            content.push(fileContent);
          }
        }
      }

      // let file2 = await this.UploadRemotePDF(path.join(__dirname, "assets", "luat-to-chuc-toa-an.pdf"), "luat-to-chuc-toa-an")
      // if (file2) {
      //   if (file2.uri && file2.mimeType) {
      //     const fileContent = createPartFromUri(file2.uri, file2.mimeType);
      //     content.push(fileContent);
      //   }
      // }
      // let file4 = await this.UploadRemotePDF(path.join(__dirname, "assets", "toa-an-sua-doi-2025.pdf"), "toa-an-sua-doi-2025")
      // if (file4) {
      //   if (file4.uri && file4.mimeType) {
      //     const fileContent = createPartFromUri(file4.uri, file4.mimeType);
      //     content.push(fileContent);
      //   }
      // }
      // let file3 = await this.UploadRemotePDF(path.join(__dirname, "assets", "luat-can-bo-2025.pdf"), "luat-can-bo-2025")
      // if (file3) {
      //   if (file3.uri && file3.mimeType) {
      //     const fileContent = createPartFromUri(file3.uri, file3.mimeType);
      //     content.push(fileContent);
      //   }
      // }


      const response = await this.ai.models.generateContent({
        model: prompt.modelName,
        contents: content,
      });

      console.log(response.text);
      return {
        statusCode: 200,
        message: prompt.contents,
        data: response.text ?? "Data is undefined"
      }
    }
    catch (e) {
      console.log(e)
      if (e instanceof ApiError) {
        return {
          statusCode: e.status,
          message: e.name,
          data: e.message
        }
      }
      return {
        statusCode: 500,
        message: "Lỗi hệ thống",
        data: "Lỗi hệ thống"
      }

    }
  }
  async PromptWithImage(prompt: PromptDto): Promise<ResponseDto<string>> {
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
      }
    }
    catch (e) {
      if (e instanceof ApiError) {
        return {
          statusCode: e.status,
          message: e.name,
          data: e.message
        }
      }
      return {
        statusCode: 500,
        message: "Lỗi hệ thống",
        data: "Lỗi hệ thống"
      }

    }
  }



  async PromptWithCache(prompt: PromptDto, cacheName: string): Promise<ResponseDto<string>> {
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
      }
    }
    catch (e) {
      if (e instanceof ApiError) {
        return {
          statusCode: e.status,
          message: e.name,
          data: e.message
        }
      }
      return {
        statusCode: 500,
        message: "Lỗi hệ thống",
        data: "Lỗi hệ thống"
      }

    }
  }
  async CreateFileCache(pdfPath: string, modelName: string, cacheName: string, mimeType: string = "application/pdf",
    systemInstruction: string = "You are an expert analyzing transcripts.", ttl: number = 1555200000) {
    try {
      const doc = await this.ai.files.upload({
        file: pdfPath,
        config: { mimeType: mimeType },
      });

      if (doc && doc.uri && doc.mimeType) {
        const cache = await this.ai.caches.create({
          model: modelName,
          config: {
            contents: createUserContent(createPartFromUri(doc.uri, doc.mimeType)),
            systemInstruction: systemInstruction,
            // expireTime: `${expireYear}-01-01T00:00:00Z`,
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
  async DeleteCache(cacheName: string) {
    await this.ai.caches.delete({ name: cacheName });

  }
  async GetListModels() {
    const list = await this.ai.models.list();
    // for await (const model of list) {
    //   console.log(model);
    // }
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
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }
  }
  async IsCachesExist(cacheName: string) {
    const cache = await this.ai.caches.get({ name: cacheName });
    return cache ? true : false;
  }
  async UploadRemotePDF(filePath, displayName) {
    const pdfBuffer = fs.readFileSync(filePath); // Buffer nhị phân

    const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    const file = await this.ai.files.upload({
      file: fileBlob,
      config: {
        displayName: displayName,
      },
    });

    if (!file.name) {
      return null
    }

    // Wait for the file to be processed.
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
}
