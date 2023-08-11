import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AirQualityService } from '../services/airQuality.service';
import { CacheService } from '../services/cache.service';

@Injectable()
export class AirQualityJobService {
  private readonly logger = new Logger(AirQualityJobService.name);
  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly cacheService: CacheService,
  ) {}

  @Cron('*/1 * * * *')
  async handleCron() {
    this.logger.debug(
      'Running every minute but will save new data every hour as it is not changed',
    );

    // data will be saved after 1hour as it is changed after 1 hour
    const isLastUpdateSaved = await this.cacheService.get(
      'paris:pollution:lastfetch',
    );

    if (!isLastUpdateSaved) {
      const data = await this.airQualityService.getPollutionByLatLon(
        '48.856613',
        '2.352222',
      );
      await this.airQualityService.saveParisData(data.pollution);

      await this.cacheService.set(
        'paris:pollution:lastfetch',
        data.pollution.ts,
        3600,
      );
    }
  }
}
