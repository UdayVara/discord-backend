import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { signupdto } from './dto/signup.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { signindto } from './dto/signin.dto';


@Injectable()
export class AuthService {

    constructor(private prisma :PrismaService,private jwt:JwtService){}

    async signup(credentials:signupdto){
        try {
            const chekUser = await this.prisma.users.findFirst({
                where:{
                    email:credentials.email
                }
            })

            if(chekUser){
                return {statusCode:403,message:"User With Email Already Exists"}
            }else{
                console.log(process.env.SALT_ROUNDS)
                const hashedPassword = bcrypt.hashSync(credentials.password,+process.env.SALT_ROUNDS)


                const newUser = await this.prisma.users.create({
                    data:{
                        ...credentials,
                        password:hashedPassword
                    }
                })

                if(newUser){
                    const token = this.jwt.sign({id:newUser.id})

                    return {statusCode:201,message:"User Signup Successfully",token:token,user:newUser}
                }else{
                    return  new InternalServerErrorException();
                }
            }
        } catch (error) {
            console.log("error",error)
            throw new InternalServerErrorException()
        }
    }
    async signin(credentials:signindto){
        try {
            const chekUser = await this.prisma.users.findFirst({
                where:{
                    email:credentials.email
                }
            })

            if(chekUser){
                const comaprePass = bcrypt.compareSync(credentials.password,chekUser.password)

                if(comaprePass){
                    const token = this.jwt.sign({id:chekUser.id})

                    return {statusCode:201,message:"User Signin Successfully",user:chekUser,token}
                }else{
                    return {statusCode:403,message:"Incorrect Password"}
                }
            }else{
                return {statusCode:403,message:"User With Email Does Not Exists"}
            }
        } catch (error) {
            console.log("error",error)
            throw new InternalServerErrorException()
        }
    }



}
