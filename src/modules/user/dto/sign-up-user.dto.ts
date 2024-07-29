import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    password: string;
    role: string;
    createdBy: string;
}
