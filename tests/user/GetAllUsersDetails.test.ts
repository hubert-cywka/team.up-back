import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';

describe('Testing get all users details use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
  });

  describe(`GET ${UseCase.PATH_USERS} for admin`, () => {
    it(`should return ${HTTPStatus.OK} status`, async () => {
      await UseCase.admin.get(UseCase.PATH_USERS).send().expect(HTTPStatus.OK);
    });

    it(`should return list of all users details`, async () => {
      const res = await UseCase.admin.get(UseCase.PATH_USERS).send();

      expect(res.body).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(1);
    });
  });

  describe(`GET ${UseCase.PATH_USERS} for user`, () => {
    it(`should return ${HTTPStatus.FORBIDDEN} status`, async () => {
      await UseCase.user.get(UseCase.PATH_USERS).send().expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`GET ${UseCase.PATH_USERS} for unauthenticated`, () => {
    it(`should return ${HTTPStatus.UNAUTHORIZED} status`, async () => {
      await UseCase.unauthenticated.get(UseCase.PATH_USERS).send().expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
