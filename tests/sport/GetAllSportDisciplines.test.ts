import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';
import { UserRole } from '../../src/shared/types/UserRole';

jest.setTimeout(15000);
describe('Testing get all sport discipline use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.registerAndLoginAs(UseCase.admin, UseCase.ADMIN_EMAIL, UserRole.ADMIN);
    await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
  });

  describe(`GET ${UseCase.PATH_SPORTS} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if user role is ${UserRole.ADMIN}`, async () => {
      await UseCase.admin.get(UseCase.PATH_SPORTS).send().expect(HTTPStatus.OK);
    });

    it(`should return ${HTTPStatus.OK} if user role is ${UserRole.USER}`, async () => {
      await UseCase.user.get(UseCase.PATH_SPORTS).send().expect(HTTPStatus.OK);
    });

    it(`should return ${HTTPStatus.OK} if user is not authenticated`, async () => {
      await UseCase.unauthenticated.get(UseCase.PATH_SPORTS).send().expect(HTTPStatus.OK);
    });

    it(`should return list of sport disciplines`, async () => {
      const res = await UseCase.admin.get(UseCase.PATH_SPORTS).send();

      expect(res.body).toBeTruthy();
      expect(res.body.length).toBe(1);
    });
  });
});
