import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './airQuality.service';
import { AppService } from '../../app.service';
import { ConfigService } from '@nestjs/config';
import { ApiClient } from '../../apiClient/apiClient';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirQuality } from '../entities/airQuality.entity';
import { Repository } from 'typeorm';
import { IqAirByLatAndLonResponseDto } from '../dto/airQuality.dto';
import { HttpException } from '@nestjs/common';

jest.mock('../../apiClient/apiClient');

describe('AirQualityService', () => {
  let service: AirQualityService;
  let apiClient: ApiClient;
  const fakeRepo: Partial<Repository<AirQuality>> = {
    findOneBy: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        AppService,
        ConfigService,
        ApiClient,
        {
          provide: getRepositoryToken(AirQuality),
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    apiClient = module.get<ApiClient>(ApiClient);
  });

  describe('the getPollutionByLatLon() method', () => {
    it('should return empty pollution object because the api did not return anything', async () => {
      const getSpy = jest
        .spyOn(apiClient, 'get')
        .mockResolvedValue({ response: { data: {} } });
      const result = await service.getPollutionByLatLon('20', '30');

      expect(getSpy).toBeCalledWith('/nearest_city?lat=20&lon=30');
      expect(result).toMatchObject({ pollution: {} });
    });

    it('should return http error because api validation', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValue('error');
      await expect(service.getPollutionByLatLon('20', '150')).rejects.toThrow(
        HttpException,
      );
    });

    it('should return empty pollution object with data filled', async () => {
      const mockedResolvedResponse = {
        data: {
          data: {
            current: {
              pollution: {
                ts: '2023-08-11T12:00:00.000Z',
                aqius: 62,
                mainus: 'p2',
                aqicn: 24,
                maincn: 'p2',
              },
            },
          },
        },
      };

      const mockedAirQualityValue = new IqAirByLatAndLonResponseDto({
        ts: '2023-08-11T12:00:00.000Z',
        aqius: 62,
        mainus: 'p2',
        aqicn: 24,
        maincn: 'p2',
      });

      const getSpy = jest
        .spyOn(apiClient, 'get')
        .mockResolvedValue(mockedResolvedResponse);
      const result = await service.getPollutionByLatLon('20', '30');
      expect(getSpy).toBeCalledWith('/nearest_city?lat=20&lon=30');
      expect(result).toMatchObject({ pollution: mockedAirQualityValue });
    });
  });
});
