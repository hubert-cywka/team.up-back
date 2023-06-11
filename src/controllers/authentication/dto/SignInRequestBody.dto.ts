import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class SignInRequestBody {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export default SignInRequestBody;
