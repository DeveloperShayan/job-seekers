import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { User } from './User';
import { JobApplication } from './JobApplication';

  
  @Entity('job_seekers')
  export class JobSeeker {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => User, (user) => user.jobSeeker)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ length: 100 })
    first_name: string;
  
    @Column({ length: 100 })
    last_name: string;
  
    @Column({ length: 255 })
    resume: string;
  
    @Column({ type: 'text', nullable: true })
    bio: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  
    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.jobSeeker,{onDelete : 'CASCADE',eager : true})
    jobApplications: JobApplication[];
  }
  