// import { Module } from '@nestjs/common';
// import { StreakService } from './streak.service';
// import { StreakController } from './streak.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './entities/streak.entity';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Streak.name, schema: StreakSchema }]),
//   ],
//   controllers: [StreakController],
//   providers: [StreakService],
// })
// export class UsersModule {}

// streak.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerRegistry } from '@nestjs/schedule';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { Streak, StreakSchema } from './entities/streak.entity';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Streak.name, schema: StreakSchema }]),
    ScheduleModule.forRoot(),
    GatewayModule,
  ],
  controllers: [StreakController],
  providers: [StreakService, SchedulerRegistry],
})
export class StreakModule {}