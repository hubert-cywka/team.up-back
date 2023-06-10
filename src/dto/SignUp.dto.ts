import { IsDateString, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

class SignUpDto {
  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  email!: string;

  @IsString()
  @Exclude({ toPlainOnly: true })
  password!: string;

  @IsDateString()
  @Expose()
  birthdate!: string;
}

export default SignUpDto;