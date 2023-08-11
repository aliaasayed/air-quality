import { Module } from '@nestjs/common';
import { AirQualityController } from './controllers/airQuality.controller';
import { AirQualityService } from './services/airQuality.service';
import { HttpModule } from '@nestjs/axios';
import { AppService } from '../app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQuality } from './entities/airQuality.entity';
import { ApiClient } from '../apiClient/apiClient';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([AirQuality]),
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService, AppService, ApiClient],
})
export class AirQualityModule {}
