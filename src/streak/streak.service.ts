// streak.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Streak } from './entities/streak.entity';
import { CreateStreakDto } from './dto/create-streak.dto';
import { UpdateStreakDto } from './dto/update-streak.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
// import { CronJob } from '@nestjs/schedule';
import { MyGateway } from '../gateway/gateway';

@Injectable()
export class StreakService {
  constructor(
    @InjectModel(Streak.name) private streakModel: Model<Streak>,
    private schedulerRegistry: SchedulerRegistry,
    private gateway: MyGateway,
  ) {}

  async create(createStreakDto: CreateStreakDto) {
    const streak = await this.streakModel.create(createStreakDto);
    
    if (streak.includeTime && streak.time) {
      this.schedulePrayerReminder(streak);
    }
    
    return streak.save();
  }

  async findAll(userId: string) {
    return this.streakModel.find({ userId });
  }

  async findOne(id: string, userId: string) {
    const streak = await this.streakModel.findOne({ _id: id, userId });
    if (!streak) {
      throw new NotFoundException('Streak not found');
    }
    return streak;
  }

  async update(id: string, updateStreakDto: UpdateStreakDto, userId: string) {
    const streak = await this.streakModel.findOneAndUpdate(
      { _id: id, userId },
      updateStreakDto,
      { new: true },
    );

    if (!streak) {
      throw new NotFoundException('Streak not found');
    }

    // Update cron job if time-related fields are updated
    if (streak.includeTime && streak.time) {
      this.schedulePrayerReminder(streak);
    }

    return streak;
  }

  async remove(id: string, userId: string) {
    const streak = await this.streakModel.findOneAndDelete({ _id: id, userId });
    if (!streak) {
      throw new NotFoundException('Streak not found');
    }

    // Remove associated cron job if it exists
    try {
      this.schedulerRegistry.deleteCronJob(`prayer_reminder_${streak._id}`);
    } catch (error) {
      // Job might not exist, ignore error
    }

    return streak;
  }

  async updatePrayerStatus(id: string, userId: string, status: 'i have prayed' | 'i did not pray') {
    const streak = await this.streakModel.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true },
    );

    if (!streak) {
      throw new NotFoundException('Streak not found');
    }

    return streak;
  }

  private schedulePrayerReminder(streak: Streak) {
    try {
      // Log existing job ID and check for an existing job
      const existingJob = streak._id.toString();
      console.log(`Checking for existing job with ID: ${existingJob}`);
      if (existingJob) {
        // Manually handle existing jobs if needed (can add logic if required)
      }
    } catch (error) {
      console.log('Error while checking for existing job:', error);
    }
  
    // Parse time and subtract 5 minutes for reminder
    const [hours, minutes] = streak.time.split(':').map(Number);
    const reminderTime = new Date(streak.date);
    reminderTime.setHours(hours, minutes - 5);
  
    // Log reminder time and cron expression
    console.log(`Reminder time (5 minutes before): ${reminderTime}`);
    const cronExpression = `${reminderTime.getMinutes()} ${reminderTime.getHours()} * * *`;
    console.log(`Generated cron expression: ${cronExpression}`);
  
    // Create cron job
    const job = new CronJob(cronExpression, () => {
      console.log(`Cron job executed for streak ID: ${streak._id}`);
      this.gateway.server.to(streak.userId.toString()).emit('prayerReminder', {
        streakId: streak._id,
        message: streak.description,
      });
    });
  
    // Log and start job
    console.log(`Scheduling cron job for streak ID: ${streak._id}`);
    job.start();
  }

  public testSchedulePrayerReminder(id: string) {
    this.streakModel.findById(id).then(streak => {
      if (streak) {
        this.schedulePrayerReminder(streak);
      } else {
        console.log('Streak not found');
      }
    });
  }
  

  // private schedulePrayerReminder(streak: Streak) {
  //   // Remove existing job if it exists
  //   // In 3.x you will need to manually manage cron jobs
  //   try {
  //     const existingJob = streak._id.toString();
  //     if (existingJob) {
  //       // If needed, manually delete existing cron job
  //     }
  //   } catch (error) {
  //     // Job might not exist, ignore error
  //   }

  //   // Parse time and subtract 5 minutes
  //   const [hours, minutes] = streak.time.split(':').map(Number);
  //   const reminderTime = new Date(streak.date);
  //   reminderTime.setHours(hours, minutes - 5);

  //   // Create cron expression for the reminder
  //   const cronExpression = `${reminderTime.getMinutes()} ${reminderTime.getHours()} * * *`;

  //   const job = new CronJob(cronExpression, () => {
  //     this.gateway.server.to(streak.userId.toString()).emit('prayerReminder', {
  //       streakId: streak._id,
  //       message: streak.description,
  //     });
  //   });

  //   // Start the job
  //   job.start();
  // }
  // private schedulePrayerReminder(streak: Streak) {
  //   // Remove existing job if it exists
  //   try {
  //     this.schedulerRegistry.deleteCronJob(`prayer_reminder_${streak._id}`);
  //   } catch (error) {
  //     // Job might not exist, ignore error
  //   }

  //   // Parse time and subtract 5 minutes
  //   const [hours, minutes] = streak.time.split(':').map(Number);
  //   const reminderTime = new Date(streak.date);
  //   reminderTime.setHours(hours, minutes - 5);

  //   // Create cron expression for the reminder
  //   const cronExpression = `${reminderTime.getMinutes()} ${reminderTime.getHours()} * * *`;

  //   const job = new CronJob(cronExpression, () => {
  //     this.gateway.server.to(streak.userId.toString()).emit('prayerReminder', {
  //       streakId: streak._id,
  //       message: streak.description,
  //     });
  //   });

  //   this.schedulerRegistry.addCronJob(`prayer_reminder_${streak._id}`, job);
  //   job.start();
  // }
}
