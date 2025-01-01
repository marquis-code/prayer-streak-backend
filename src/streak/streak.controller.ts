import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, BadRequestException } from '@nestjs/common';
import { StreakService } from './streak.service';
import { CreateStreakDto } from './dto/create-streak.dto';
import { UpdateStreakDto } from './dto/update-streak.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { isValidObjectId, Types } from 'mongoose';

@Controller('streak')
@UseGuards(JwtAuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@GetUser() user: User, @Body() createStreakDto: CreateStreakDto) {
    createStreakDto.userId = user.id;
    return await this.streakService.create(createStreakDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User) {
    return await this.streakService.findAll(user.id);
  }

//   @Get('test-cron/:id')
// async testCronJob(@Param('id') id: string) {
//   const streak = await this.streakService.findOne(id, 'someUserId');  // Replace with actual userId
//   this.streakService.schedulePrayerReminder(streak);
//   return { message: 'Cron job triggered manually for streak ID: ' + id };
// }

// @Get('test-cron/:id')
// async testCronJob(@Param('id') id: string) {
//   const streak = await this.streakService.findOne(id, 'someUserId');  // Replace with actual userId
//   this.streakService.testSchedulePrayerReminder(id);  // Call the test method
//   return { message: 'Cron job triggered manually for streak ID: ' + id };
// }
@Get('test-cron/:id')
async testCronJob(@Param('id') id: string) {
  // Convert the string ID to an ObjectId before calling the service method
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid ID format');
  }
  
  // Ensure the userId is properly passed or retrieved as needed
  const streak = await this.streakService.findOne(id, 'someUserId');  // Replace with actual userId
  this.streakService.testSchedulePrayerReminder(id);  // Call the test method with the ObjectId
  return { message: 'Cron job triggered manually for streak ID: ' + id };
}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@GetUser() user: User, @Param('id') id: string) {
    return await this.streakService.findOne(id, user.id);
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // async update(
  //   @GetUser() user: User,
  //   @Param('id') id: string,
  //   @Body() updateStreakDto: UpdateStreakDto,
  // ) {
  //   return await this.streakService.update(id, updateStreakDto, user.id);
  // }
  @Patch(':id')
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateStreakDto: UpdateStreakDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this.streakService.update(id, updateStreakDto, user.id);
  }

  // @Patch(':id/status')
  // @UseGuards(JwtAuthGuard)
  // async updateStatus(
  //   @GetUser() user: User,
  //   @Param('id') id: string,
  //   @Body('status') status: 'i have prayed' | 'i did not pray',
  // ) {
  //   return await this.streakService.updatePrayerStatus(id, user.id, status);
  // }
  @Patch(':id/status')
  async updatePrayerStatus(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body('status') status: 'i have prayed' | 'i did not pray',
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this.streakService.updatePrayerStatus(id, user.id, status);
  }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // async remove(@GetUser() user: User, @Param('id') id: string) {
  //   return await this.streakService.remove(id, user.id);
  // }'  @Delete(':id')
  async remove(@GetUser() user: User, @Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this.streakService.remove(id, user.id);
  }

}