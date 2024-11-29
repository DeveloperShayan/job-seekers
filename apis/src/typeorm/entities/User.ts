import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { JobSeeker } from './JobSeeker';
import { UserRole } from './UserRole';
import { Organization } from './Organization';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  firstName : string;

  @Column({ length: 20 })
  middleName : string;

  @Column({ length: 20 })
  lastName : string;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({default : null})
  forgetPasswordToken : string;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date; // This column will store the delete timestamp

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.user)
  jobSeeker: JobSeeker;

  @OneToMany(() => UserRole, (userRole) => userRole.user,{onDelete : 'CASCADE',eager : true})
  userRoles: UserRole[];

  @OneToMany(() => Organization, (organization) => organization.user,{onDelete : 'CASCADE',eager : true})
  organizations: Organization[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}
