import { ApiProperty } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { IsEnum, IsNotEmpty,  IsUUID } from "class-validator";

export class SetRoleDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    serverId:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    memberId:string;


    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(RoleType)
    role:RoleType;
}
