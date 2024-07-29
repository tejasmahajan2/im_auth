import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class VerifyOtp {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    otp: number;
}
