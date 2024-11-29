import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "src/typeorm/entities";
import { Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import { MailService } from "src/modules/general/mail/mail.service";
import { ChangePasswordDto, ForgetPasswordDto, LoginDto, UpdatePasswordDto } from "src/dtos";
import * as bcrypt from 'bcrypt';
import { otpGenerate, randomStringGenerate } from "src/helper";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
        private jwt: JwtService,
        private config: ConfigService,
        private mailService: MailService,
    ) { }
    async authenticate(dto: LoginDto): Promise<{ message: string; status: boolean }> {
        try {
            const user = await this.userRepository.findOne({ where: { username: dto.username } });
            switch (true) {
                case (user && user.is_active == false): throw new HttpException('Account is not active!', HttpStatus.BAD_REQUEST);
                case (!user || user.password === null): throw new HttpException('Email or Password is invalid', HttpStatus.BAD_REQUEST);
                case (!(await bcrypt.compare(dto.password, user.password))): throw new HttpException('Email or Password is invalid', HttpStatus.BAD_REQUEST);
                default: break;
            }
            const opt = otpGenerate();
            user.otp = opt;
            await this.userRepository.save(user);
            await this.mailService.sendMail(user.email, 'OTP received from Jobseekers.', 'admin-auth-otp', { otp: opt, route: 'auth/verify-otp', name: 'Super Admin' });
            return { message: 'For security purposes, you will receive an OTP (One-Time Password) on your email to proceed further.', status: true }
        }
        catch (error) { throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); }
    };
    async verifyOtp(otp: string) {
        try {
            const user = await this.userRepository.findOne({ where: { username: 'shayan.niaz' }, relations: ['userRoles', 'userRoles.role'] });
            if (!user) throw new HttpException("User Not Found!", HttpStatus.NOT_FOUND);
            if (otp !== user.otp) throw new HttpException("Incorrect OTP", HttpStatus.BAD_REQUEST)
            const token: string = await this.jwtToken(user.id, user.email);
            const userRole = user.userRoles[0].role.name;
            const userRolePermissions = await this.getUserRolePermissions(user.userRoles[0].id);
            user.otp = null;
            await this.userRepository.save(user);
            return { status: true, token, user: { username: user.username, email: user.email, is_active: user.is_active, }, userRolePermissions, userRole };
        }
        catch (error) { throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); };
    };
    async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<{ status: boolean; message: string; }> {
        const user = await this.userRepository.findOneBy({ email: forgetPasswordDto.email });
        if (!user) throw new HttpException('Email is invalid', HttpStatus.BAD_REQUEST);
        const forgetPasswordToken = randomStringGenerate();
        user.forgetPasswordToken = forgetPasswordToken;
        this.userRepository.save(user);
        await this.mailService.sendMail(user.email,
            'Password Reset Request for Your JobSeekers Account',
            'forgetPassword',
            {
                forgetPasswordToken: forgetPasswordToken,
                route: 'auth/forget-password',
                name: user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ' ' + user.middleName.charAt(0).toUpperCase() + user.middleName.slice(1) + ' ' + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
            },
        );

        return {
            status: true,
            message: 'Email sent sucessfully',
        };
    }
    async changePassword(changePasswordDto: ChangePasswordDto, token: string,): Promise<{ status: boolean; message: string; }> {
        const user = await this.userRepository.findOneBy({ forgetPasswordToken: token, });
        if (!user) throw new HttpException('Invalid token', HttpStatus.NOT_FOUND);
        try {
            if (changePasswordDto.password != changePasswordDto.confirm_password) throw new HttpException('Confirm password must be same', HttpStatus.BAD_REQUEST)
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(changePasswordDto.password, salt);
            user.forgetPasswordToken = null;
            user.password = hash;
            this.userRepository.save(user);
            return {
                status: true,
                message: 'Password Changed Sucessfully',
            };
        } catch (error) { throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR,); }
    }
    async updatePassword(updatePasswordDto: UpdatePasswordDto) {
        try {
            const user = await this.userRepository.findOneBy({ id: updatePasswordDto.userId });
            if (!user) throw new HttpException('Invalid token', HttpStatus.NOT_FOUND);
            const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
            if (!isMatch) throw new HttpException('Password is invalid', HttpStatus.NOT_FOUND,);
            if (updatePasswordDto.confirmPassword != updatePasswordDto.newPassword) throw new HttpException('Confirm password must be same', HttpStatus.BAD_REQUEST)
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(updatePasswordDto.newPassword, salt);
            user.password = hash;
            await this.userRepository.save(user);
            return { status: true, message: 'Password Changed Sucessfully', }
        }
        catch (error) { throw new HttpException(error.message, HttpStatus.BAD_REQUEST); }
    };
    private async jwtToken(id: number, email: string): Promise<string> {
        const payload: { sub: number; email: string } = { sub: id, email };
        const access_token = await this.jwt.signAsync(payload, { expiresIn: '100d', secret: this.config.get<string>('JWT_SECRET') });
        return access_token;
    };
    private async getUserRolePermissions(role_id: number) {
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .leftJoinAndSelect('role.rolePermissionsModules', 'rolePermissionsModules')
            .leftJoinAndSelect('rolePermissionsModules.module', 'module')
            .leftJoinAndSelect('rolePermissionsModules.permission', 'permission')
            .where('userRole.id = :role_id', { role_id });
        const userRole = await queryBuilder.getOne();
        if (!userRole) throw new HttpException("User Role Not Found!", HttpStatus.NOT_FOUND);
        if (userRole.role.rolePermissionsModules.length == 0) return [];
        const modulePermissions: { module: string; permissions: string[] }[] = [];
        userRole.role.rolePermissionsModules.forEach((value) => {
            const existingModule = modulePermissions.find((item) => item.module === value.module.name);
            if (existingModule) { existingModule.permissions.push(value.permission.name); }
            else { modulePermissions.push({ module: value.module.name, permissions: [value.permission.name], }); }
        });
        return modulePermissions;
    };

}