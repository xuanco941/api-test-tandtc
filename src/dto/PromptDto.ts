import { ApiProperty } from "@nestjs/swagger";

export class PromptDto {
    @ApiProperty({ required: true, default: "Điều 94 trong hiến pháp năm 2013 quy định điều gì?" })
    contents: string;
    @ApiProperty({ required: false, default: "gemini-2.5-flash" })
    modelName: string;
    @ApiProperty({ required: false, default: false })
    search: boolean;
}