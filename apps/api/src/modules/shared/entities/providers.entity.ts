import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Service } from './services.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: true })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.providers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];
}
