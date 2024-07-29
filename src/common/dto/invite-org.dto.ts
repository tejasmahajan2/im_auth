import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InviteOrgDto {
  org_id: string;

  @IsNotEmpty()
  @IsString()
  org_name: string;


  @IsNotEmpty()
  @IsString()
  email: string;


  @IsNotEmpty()
  @IsString()
  country_code: string;


  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  street_address: string;

  @IsNotEmpty()
  @IsString()
  city: string;


  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  reg_no: number;
}
