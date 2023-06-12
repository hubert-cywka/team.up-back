import { UserRole } from '../../../types/users/UserRole';
import { IsEnum, IsNotEmpty } from 'class-validator';

class ChangeRoleRequest {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

export default ChangeRoleRequest;
