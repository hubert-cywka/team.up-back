import { UserRole } from '../../../shared/types/UserRole';

class UserDetailsResponse {
  public _id: string;
  public name: string;
  public email: string;
  public role: UserRole;
  public image: string;

  constructor(_id: string, name: string, email: string, role: UserRole, image: string) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.image = image;
  }
}

export default UserDetailsResponse;
