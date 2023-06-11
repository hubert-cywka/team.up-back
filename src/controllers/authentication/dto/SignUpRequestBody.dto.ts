import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Exclude, Expose } from 'class-transformer';

class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password!: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate!: string;
}

export default SignUpRequest;
