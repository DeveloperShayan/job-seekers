import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty({
      message: 'Username is required',
    })
    username: string;
  
    @IsNotEmpty({
      message: 'Password is required',
    })
    password: string;
  }


  export class ForgetPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;
  }
  
  export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsString()
    @IsNotEmpty()
    confirm_password: string;
  }
  
  export class UpdatePasswordDto {
  
    @IsNotEmpty()
    userId: number;
  
    @IsString()
    @IsNotEmpty()
    oldPassword: string;
  
    @IsString()
    @IsNotEmpty()
    newPassword: string;
  
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
  }
  
  export class otpDto {
    @IsString()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    otp : string;
  }