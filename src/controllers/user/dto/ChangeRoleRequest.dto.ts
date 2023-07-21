import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../shared/types/UserRole';

class ChangeRoleRequest {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}

export default ChangeRoleRequest;
