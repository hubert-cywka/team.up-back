import { IsNotEmpty, IsString } from 'class-validator';

class CreateSportDisciplineRequest {
  @IsString()
  @IsNotEmpty()
  public name!: string;
}

export default CreateSportDisciplineRequest;
