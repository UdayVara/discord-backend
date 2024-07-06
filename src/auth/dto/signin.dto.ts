import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";



export class signindto{



    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    password:string;
}