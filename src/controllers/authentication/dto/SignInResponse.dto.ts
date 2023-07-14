import { UserRole } from '../../../types/UserRole';

class SignInResponse {
  public _id: string;
  public name: string;
  public email: string;
  public role: UserRole;

  constructor(_id: string, name: string, email: string, role: UserRole) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export default SignInResponse;
