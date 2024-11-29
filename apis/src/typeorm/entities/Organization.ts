import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
import { User } from './User';
import { Job } from './Job';
  
  @Entity('organizations')
  export class Organization {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.organizations,{onDelete : 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => Job, (job) => job.organization,{onDelete : 'CASCADE',eager : true})
    jobs: Job[]; // Add this property

    @Column({ length: 100 })
    organization_name: string;
  
    @Column({ length: 255 })
    website: string;
  
    @Column({ length: 255 })
    address: string;
  
    @Column({ length: 100 })
    contact_email: string;
  
    @Column({ length: 20 })
    contact_phone: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  }
  