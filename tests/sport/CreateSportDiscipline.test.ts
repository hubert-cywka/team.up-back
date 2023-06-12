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

    it(`should return ${HTTPStatus.OK} if discipline does not exist yet`, async () => {
      await UseCase.admin
        .post(UseCase.PATH_SPORTS)
        .send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)
        .expect(HTTPStatus.OK);
    });

    it(`should save discipline if it does not exist yet`, async () => {
      const saveRequest: CreateSportDisciplineRequest = { name: 'Football' };
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(saveRequest);

      const createdDiscipline = await UseCase.findInCollection(UseCase.SPORTS_COLLECTION, {
        name: 'Football'
      });

      expect(createdDiscipline).toBeTruthy();
    });

    it(`should return ${HTTPStatus.CONFLICT} if discipline already exists`, async () => {
      await UseCase.admin
        .post(UseCase.PATH_SPORTS)
        .send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)
        .expect(HTTPStatus.CONFLICT);
    });

    it(`should not save discipline if it already exists`, async () => {
      const countBefore = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);

      const countAfter = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      expect(countAfter).toBe(countBefore);
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
      await UseCase.user
        .post(UseCase.PATH_SPORTS)
        .send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)
        .expect(HTTPStatus.FORBIDDEN);
    });

    it(`should never save to database`, async () => {
      const countBefore = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      await UseCase.user.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
      const countAfter = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      expect(countAfter).toBe(countBefore);
    });
  });

  describe(`POST ${UseCase.PATH_SPORTS} as unauthorized user`, () => {
    beforeAll(async () => {
      await UseCase.logoutAs(UseCase.user);
    });

    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      await UseCase.user
        .post(UseCase.PATH_SPORTS)
        .send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });

    it(`should never save to database`, async () => {
      const countBefore = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      await UseCase.user.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
      const countAfter = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      expect(countAfter).toBe(countBefore);
    });
  });
});
