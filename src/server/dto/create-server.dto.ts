import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateServerDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name:string;
}
