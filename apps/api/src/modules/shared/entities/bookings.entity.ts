import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Service } from './services.entity';
import { TimeSlot } from './time-slots.entity';
import { BookingStatus } from '../enums/booking.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('timestamp')
  bookedAt: Date;

  @Column({ default: false })
  reminderSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: number;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.bookings)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot: TimeSlot;

  @Column()
  timeSlotId: number;
}
