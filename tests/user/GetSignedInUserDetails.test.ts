import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';

jest.setTimeout(15000);
describe('Testing get signed in user details use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
  });

  describe(`GET ${UseCase.PATH_USERS_ME} for admin`, () => {
    it(`should return ${HTTPStatus.OK} status`, async () => {
      await UseCase.admin.get(UseCase.PATH_USERS_ME).send().expect(HTTPStatus.OK);
    });

    it(`should return admin details`, async () => {
      const res = await UseCase.admin.get(UseCase.PATH_USERS_ME).send();

      expect(res.body).toBeTruthy();
      expect(res.body.email).toBe(UseCase.ADMIN_EMAIL);
    });
  });

  describe(`GET ${UseCase.PATH_USERS_ME} for user`, () => {
    it(`should return ${HTTPStatus.OK} status`, async () => {
      await UseCase.user.get(UseCase.PATH_USERS_ME).send().expect(HTTPStatus.OK);
    });

    it(`should return admin details`, async () => {
      const res = await UseCase.user.get(UseCase.PATH_USERS_ME).send();

      expect(res.body).toBeTruthy();
      expect(res.body.email).toBe(UseCase.USER_EMAIL);
    });
  });

  describe(`GET ${UseCase.PATH_USERS_ME} for unauthenticated`, () => {
    it(`should return ${HTTPStatus.UNAUTHORIZED} status`, async () => {
      await UseCase.unauthenticated.get(UseCase.PATH_USERS_ME).send().expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
