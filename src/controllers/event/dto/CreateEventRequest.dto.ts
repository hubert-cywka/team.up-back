import {
  IsDateString,
  IsDefined,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsLongitude()
  @IsNotEmpty()
  lng!: number;

  @IsLatitude()
  @IsNotEmpty()
  lat!: number;
}

class CreateEventRequest {
  @IsNumber()
  @Min(2)
  minPlayers!: number;

  @IsNumber()
  @Max(1000)
  maxPlayers!: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export default CreateEventRequest;
