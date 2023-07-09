import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

class CreateSportDisciplineRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  public name!: string;
}

export default CreateSportDisciplineRequest;
