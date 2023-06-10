import { IsString } from 'class-validator';

class CreateSportDisciplineRequest {
  @IsString()
  public name!: string;
}

export default CreateSportDisciplineRequest;
