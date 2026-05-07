import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({default:""})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({default:""})
    @IsNotEmpty()
    name:string

    @ApiProperty({default:""})
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @ApiProperty({default:""})
    @IsNotEmpty()
    @MinLength(6)
    re_password: string
}
