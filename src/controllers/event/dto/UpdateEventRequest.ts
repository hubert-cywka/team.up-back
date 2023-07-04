import CreateEventRequest from './CreateEventRequest.dto';
import { IsNotEmpty, IsString } from 'class-validator';

class UpdateEventRequest extends CreateEventRequest {
  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @IsString()
  @IsNotEmpty()
  disciplineId!: string;
}

export default UpdateEventRequest;
