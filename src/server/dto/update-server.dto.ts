import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateServerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
