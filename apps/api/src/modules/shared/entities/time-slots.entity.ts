import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Service } from './services.entity';
import { Booking } from './bookings.entity';

@Entity('time_slots')
@Index(['serviceId', 'startTime'])
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Service, (service) => service.timeSlots)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: number;

  @OneToMany(() => Booking, (booking) => booking.timeSlot)
  bookings: Booking[];
}
