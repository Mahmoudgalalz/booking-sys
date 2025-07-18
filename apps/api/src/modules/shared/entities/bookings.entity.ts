import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
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

  @Column({ default: false })
  reminderSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.bookings)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot: TimeSlot;

  @Column()
  timeSlotId: number;
}
