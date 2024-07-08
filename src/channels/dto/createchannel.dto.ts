import { ApiProperty } from "@nestjs/swagger";
import { ChannelType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class createChannelDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    serverId:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(ChannelType)
    type:ChannelType;
}