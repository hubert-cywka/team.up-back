import { IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

class CreateEventRequest {
  @IsNumber()
  @Min(2)
  minPlayers!: number;

  @IsNumber()
  @Max(1000)
  maxPlayers!: number;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;
}

export default CreateEventRequest;
