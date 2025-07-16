import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TimeSlot } from './time-slots.entity';
import { Provider } from './providers.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 60 }) // Duration in minutes
  duration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Provider, (provider) => provider.services)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @Column()
  providerId: number;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.service)
  timeSlots: TimeSlot[];
}
