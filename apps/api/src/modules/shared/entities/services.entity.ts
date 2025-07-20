import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TimeSlot } from './time-slots.entity';
import { Provider } from './providers.entity';
import { Booking } from './bookings.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ default: 60 }) // Duration in minutes
  duration: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Provider, (provider) => provider.services)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @Column()
  providerId: number;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.service)
  timeSlots: TimeSlot[];

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];
}
