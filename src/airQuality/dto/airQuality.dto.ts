import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export class AirQualityByLatAndLongQueryDto {
  @ApiProperty()
  @IsLatitude()
  public lat: string;

  @ApiProperty()
  @IsLongitude()
  public long: string;
}

export class IqAirByLatAndLongResponseDto {
  public ts: string;
  public aqius: number;
  public aqicn: number;
  public maincn: string;
  public mainus: string;
  constructor(data) {
    Object.assign(this, data);
  }
}
export type AirQualityByLatAndLongResponseDto = {
  pollution: IqAirByLatAndLongResponseDto;
};
