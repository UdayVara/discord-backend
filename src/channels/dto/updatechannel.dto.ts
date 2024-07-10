import { ApiProperty } from "@nestjs/swagger";
import { ChannelType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class updateChannelDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(ChannelType)
    type:ChannelType;
}