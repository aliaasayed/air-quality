import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AirQualityService } from '../services/airQuality.service';
import { AirQualityByLatAndLongQueryDto } from '../dto/airQuality.dto';

@Controller('/api/v1/air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  getByLatLong(
    @Query(new ValidationPipe({ transform: true }))
    query: AirQualityByLatAndLongQueryDto,
  ) {
    return this.airQualityService.getPollutionByLatLong(query.lat, query.long);
  }
}
