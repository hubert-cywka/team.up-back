import { IsString } from 'class-validator';

class SignInRequest {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}

export default SignInRequest;
