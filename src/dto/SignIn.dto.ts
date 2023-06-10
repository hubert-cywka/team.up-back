import { IsString } from 'class-validator';

class SignInDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

export default SignInDto;
