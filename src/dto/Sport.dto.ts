import { IsString } from 'class-validator';

class CreateSportDto {
  @IsString()
  public name!: string;
}

export default CreateSportDto;
