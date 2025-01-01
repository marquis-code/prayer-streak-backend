import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StreakModule } from './streak/streak.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported here
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    StreakModule,
    GatewayModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
