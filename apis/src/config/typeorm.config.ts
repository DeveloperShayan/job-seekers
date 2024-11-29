import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';
import { Job, JobApplication, JobSeeker, Module, Organization, Permission, Role, RolePermissionModule, User, UserRole } from "src/typeorm/entities";


dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
};


export const typeORMEntities: any = [
    User,
    UserRole,
    Role,
    Permission,
    Module,
    RolePermissionModule,
    Organization,
    Job,
    JobApplication,
    JobSeeker
];