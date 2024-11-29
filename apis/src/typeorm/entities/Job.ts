import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
import { JobApplication } from './JobApplication';
import { Organization } from './Organization';
  
  @Entity('jobs')
  export class Job {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Organization, (organization) => organization.jobs,{onDelete : 'CASCADE'})
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;
  
    @Column({ length: 255 })
    title: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'text' })
    requirements: string;
  
    @Column({ length: 50 })
    salary_range: string;
  
    @Column({ length: 255 })
    location: string;
  
    @Column({
      type: 'enum',
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
    })
    job_type: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    posted_at: Date;
  
    @Column({ type: 'date' })
    application_deadline: Date;
  
    @OneToMany(() => JobApplication, (jobApplication) => jobApplication.job,{onDelete : 'CASCADE',eager : true})
    jobApplications: JobApplication[];
  }
  