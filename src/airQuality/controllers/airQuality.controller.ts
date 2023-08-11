import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AirQualityService } from '../services/airQuality.service';
import { AirQualityByLatAndLonQueryDto } from '../dto/airQuality.dto';

@Controller('/api/v1/air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  getByLatLon(
    @Query(new ValidationPipe({ transform: true }))
    query: AirQualityByLatAndLonQueryDto,
  ) {
    return this.airQualityService.getPollutionByLatLon(query.lat, query.lon);
  }

  @Get('/paris')
  getParisMostPolluted() {
    return this.airQualityService.getParisMostPollutedTime();
  }
}
