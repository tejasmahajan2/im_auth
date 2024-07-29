import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";

export class RequestPayload extends PartialType(CreateUserDto) {
    email?: string;
    role?: string;
}