import { UserRole } from '../../../types/users/UserRole';

class UserDetailsResponse {
  public id: string;
  public name: string;
  public email: string;
  public role: UserRole;

  constructor(id: string, name: string, email: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export default UserDetailsResponse;
