import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ApiClient } from '../src/apiClient/apiClient';
const mockApiClientProps = {
  get: jest.fn(),
};

describe('AirQuality (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ApiClient)
      .useValue(mockApiClientProps)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('The /Get by lat and lon ', () => {
    it('Should return data', async () => {
      mockApiClientProps.get.mockResolvedValue({
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
      });

      const response = await request(app.getHttpServer()).get(
        `/api/v1/air-quality?lat=20&lon=30`,
      );

      expect(response.body).toMatchObject({
        pollution: {
          ts: '2023-08-11T12:00:00.000Z',
          aqius: 62,
          mainus: 'p2',
          aqicn: 24,
          maincn: 'p2',
        },
      });
      expect(response.status).toBe(200);
      expect(response.ok).toBeTruthy();
    });

    it('Should return error', async () => {
      mockApiClientProps.get.mockRejectedValue(new Error('failed request'));

      const response = await request(app.getHttpServer()).get(
        `/api/v1/air-quality?lat=20&lon=30`,
      );

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: 'failed request',
      });
      expect(response.status).toBe(400);
      expect(response.ok).toBeFalsy();
      expect(response.badRequest).toBe(true);
    });
  });
});
