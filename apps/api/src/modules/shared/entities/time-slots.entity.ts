import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Service } from './services.entity';
import { Booking } from './bookings.entity';

@Entity('time_slots')
@Index(['serviceId', 'date', 'startTime'])
@Index(['serviceId', 'dayOfWeek', 'isRecurring'])
@Check(`"dayOfWeek" >= 0 AND "dayOfWeek" <= 6`)
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column() // e.g., "14:00"
  startTime: Date;

  @Column() // e.g., "14:00"
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (for recurring slots)
  
  @Column({ default: true })
  isRecurring: boolean;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Service, (service) => service.timeSlots)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: number;

  @OneToMany(() => Booking, (booking) => booking.timeSlot)
  bookings: Booking[];
}
