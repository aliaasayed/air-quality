import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../../app.service';
import { AirQuality } from '../entities/airQuality.entity';
import { ApiClient } from '../../apiClient/apiClient';
import {
  AirQualityByLatAndLongResponseDto,
  IqAirByLatAndLongResponseDto,
} from '../dto/airQuality.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AirQualityService {
  private iqairKey: string;

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly apiClient: ApiClient,
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
  ) {
    this.apiClient._host = this.configService.get<string>(
      'AIRQUALITY_BASE_URL',
    );
    this.iqairKey = this.configService.get<string>('AIRQUALITY_API_KEY');
  }

  async getPollutionByLatLong(
    lat: string,
    long: string,
  ): Promise<AirQualityByLatAndLongResponseDto> {
    const url = this.appService.appendQueriesToUrl(
      { lat, long, key: this.iqairKey },
      '/nearest_city',
    );
    try {
      const response = await this.apiClient.get(url);

      return {
        pollution: new IqAirByLatAndLongResponseDto(
          response.data?.data?.current?.pollution,
        ),
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || 400,
      );
    }
  }
}
