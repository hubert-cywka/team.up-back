import { HTTPStatus } from '../../src/helpers/HTTPStatus';
import UseCase from '../UseCase';
import CreateSportDisciplineRequest from '../../src/controllers/sport/dto/CreateDisciplineRequest.dto';
import { UserRole } from '../../src/types/users/UserRole';

describe('Testing create sport discipline use case', () => {
  afterAll(() => {
    UseCase.closeDatabase();
  });

  describe(`POST ${UseCase.PATH_SPORTS} as admin`, () => {
    beforeAll(async () => {
      await UseCase.registerAndLoginAs(UseCase.admin, UseCase.ADMIN_EMAIL, UserRole.ADMIN);
    });

    it(`should return ${HTTPStatus.OK} with added discipline if discipline does not exist`, async () => {
      const saveRequest: CreateSportDisciplineRequest = { name: UseCase.SPORT_DISCIPLINE.name };
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(saveRequest).expect(HTTPStatus.OK);
    });

    it(`should return ${HTTPStatus.CONFLICT} if discipline already exists`, async () => {
      const saveRequest: CreateSportDisciplineRequest = { name: UseCase.SPORT_DISCIPLINE.name };
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(saveRequest).expect(HTTPStatus.CONFLICT);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} when request does not have necessary fields`, async () => {
      await UseCase.admin
        .post(UseCase.PATH_SPORTS)
        .send({ invalid: 'INVALID' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} when name is empty`, async () => {
      await UseCase.admin
        .post(UseCase.PATH_SPORTS)
        .send({ name: '' })
        .expect(HTTPStatus.BAD_REQUEST);
    });
  });

  describe(`POST ${UseCase.PATH_SPORTS} as user`, () => {
    beforeAll(async () => {
      await UseCase.logoutAs(UseCase.admin);
      await UseCase.registerAndLoginAs(UseCase.user, UseCase.USER_EMAIL, UserRole.USER);
    });

    it(`should always return ${HTTPStatus.FORBIDDEN}`, async () => {
      const saveRequest: CreateSportDisciplineRequest = { name: UseCase.SPORT_DISCIPLINE.name };
      await UseCase.user.post(UseCase.PATH_SPORTS).send(saveRequest).expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`POST ${UseCase.PATH_SPORTS} as unauthorized user`, () => {
    beforeAll(async () => {
      await UseCase.logoutAs(UseCase.user);
    });

    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      const saveRequest: CreateSportDisciplineRequest = { name: UseCase.SPORT_DISCIPLINE.name };
      await UseCase.user
        .post(UseCase.PATH_SPORTS)
        .send(saveRequest)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
