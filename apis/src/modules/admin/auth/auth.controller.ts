import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ForgetPasswordDto, LoginDto } from "src/dtos";

@Controller('api/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('authenticate')
  authenticate(@Body() dto: LoginDto): Promise<{ message: string; status: boolean }> { return this.authService.authenticate(dto); };
  @Post('otp-verification')
  verifyOtp(@Body() body: { otp: string }) { return this.authService.verifyOtp(body.otp); };
  @Post('forget-password')
  forgetPassword(@Body() forgetpasswordDto: ForgetPasswordDto): Promise<{ status: boolean; message: string; }> { return this.authService.forgetPassword(forgetpasswordDto); }
}