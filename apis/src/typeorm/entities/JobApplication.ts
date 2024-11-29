import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Job } from './Job';
import { JobSeeker } from './JobSeeker';
  
  @Entity('job_applications')
  export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Job, (job) => job.jobApplications,{onDelete : 'CASCADE'})
    @JoinColumn({ name: 'job_id' })
    job: Job;
  
    @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobApplications,{onDelete : 'CASCADE'})
    @JoinColumn({ name: 'job_seeker_id' })
    jobSeeker: JobSeeker;
  
    @Column({ type: 'text', nullable: true })
    cover_letter: string;
  
    @Column({
      type: 'enum',
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending',
    })
    status: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    applied_at: Date;
  }
  