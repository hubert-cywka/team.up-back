import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../types/UserRole';

class ChangeRoleRequest {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

export default ChangeRoleRequest;
