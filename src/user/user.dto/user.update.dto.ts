import { IsOptional, IsString } from "class-validator";
import { UserRole } from "../user.enum";

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  public name?: string;
  
  @IsOptional()
  public role?: UserRole;
  
  @IsOptional()
  public status?: boolean;
}