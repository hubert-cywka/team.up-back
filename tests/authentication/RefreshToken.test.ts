import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';

describe('Testing refresh token use case', () => {
  beforeAll(async () => {
    return await UseCase.createDefaultAccountsAndLogin();
  });

  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  describe(`POST ${UseCase.PATH_REFRESH} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if user refresh token is valid`, async () => {
      await UseCase.user.post(UseCase.PATH_REFRESH).send().expect(HTTPStatus.OK);
    });

    it(`should set authorization cookie and refresh token cookie if refresh token is valid`, async () => {
      const response = await UseCase.user.post(UseCase.PATH_REFRESH).send();
      const setCookieHeaders = response.headers['set-cookie'].join('');
      expect(setCookieHeaders).toContain(UseCase.JWT_HEADER);
      expect(setCookieHeaders).toContain(UseCase.REFRESH_TOKEN_HEADER);
    });

    it(`should return ${HTTPStatus.UNAUTHORIZED} if user refresh token is invalid`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REFRESH).send().expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
