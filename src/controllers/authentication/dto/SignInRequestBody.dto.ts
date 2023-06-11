import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

class SignInRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export default SignInRequest;
