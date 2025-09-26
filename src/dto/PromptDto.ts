import { ApiProperty } from "@nestjs/swagger";

export class PromptDto {
    @ApiProperty({ required: true, default: "Điều 94 trong hiến pháp năm 2013 quy định điều gì?" })
    contents: string;
    @ApiProperty({ required: false, default: "gemini-2.5-flash" })
    modelName: string;
    @ApiProperty({ required: false, default: 0, description: "0: default, 1: search, 2: hiến pháp, 3: luật cán bộ, 4: tcta, 5: 4files" })
    type?: number;
}