import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { BookingRepository } from '../shared/repositories/booking.repository';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendAppointmentReminders() {
    this.logger.debug('Checking for appointments that need reminders...');
    
    const now = new Date();
    
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    
    const bookings = await this.bookingRepository.find({
      where: {
        status: 'confirmed',
        reminderSent: false,
        timeSlot: {
          startTime: LessThan(thirtyMinutesFromNow),
          endTime: MoreThan(now),
        },
      },
      relations: ['user', 'timeSlot', 'timeSlot.service'],
    });
    
    for (const booking of bookings) {
      try {
        // In a real application, you would send an email here
        this.logger.log(`Sending reminder email to ${booking.user.email} for appointment at ${booking.timeSlot.startTime}`);
        
        // For demonstration purposes, we'll just log the reminder
        this.logger.log(`
          Subject: Reminder: Your appointment is in 30 minutes
          
          Dear ${booking.user.name},
          
          This is a reminder that your appointment for ${booking.timeSlot.service.title} 
          is scheduled to begin in 30 minutes at ${booking.timeSlot.startTime}.
          
          Thank you for using our service!
        `);
        
        // Mark the reminder as sent
        booking.reminderSent = true;
        await this.bookingRepository.save(booking);
      } catch (error) {
        this.logger.error(`Failed to send reminder for booking ${booking.id}`, error);
      }
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async markCompletedAppointments() {
    this.logger.debug('Marking completed appointments...');
    
    const now = new Date();
    
    const bookings = await this.bookingRepository.find({
      where: {
        status: 'confirmed',
        timeSlot: {
          endTime: LessThan(now),
        },
      },
    });
    
    for (const booking of bookings) {
      try {
        booking.status = 'completed';
        await this.bookingRepository.save(booking);
        this.logger.log(`Marked booking ${booking.id} as completed`);
      } catch (error) {
        this.logger.error(`Failed to mark booking ${booking.id} as completed`, error);
      }
    }
  }
}
