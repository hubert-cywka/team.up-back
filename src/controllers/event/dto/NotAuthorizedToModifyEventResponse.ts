import ErrorResponse from '../../../shared/helpers/ErrorResponse';
import { HTTPStatus } from '../../../shared/helpers/HTTPStatus';

class NotAuthorizedToModifyEventResponse extends ErrorResponse {
  constructor() {
    super(HTTPStatus.FORBIDDEN, `This event can't be modified by this user.`);
  }
}

export default NotAuthorizedToModifyEventResponse;
