import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';

jest.setTimeout(15000);
describe('Testing delete sport discipline use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
  });

  beforeEach(async () => {
    await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
  });

  describe(`DELETE ${UseCase.PATH_SPORTS}:/id as admin`, () => {
    it(`should return ${HTTPStatus.OK} if discipline does exist`, async () => {
      const sportDisciplineID = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE.name
      );

      await UseCase.admin
        .delete(UseCase.PATH_SPORTS.concat(`/${sportDisciplineID}`))
        .send()
        .expect(HTTPStatus.OK);
    });

    it(`should delete discipline if it does exist`, async () => {
      const sportDisciplineID = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE.name
      );

      await UseCase.admin
        .delete(UseCase.PATH_SPORTS.concat(`/${sportDisciplineID}`))
        .send()
        .expect(HTTPStatus.OK);

      const deletedDiscipline = await UseCase.findInCollection(UseCase.SPORTS_COLLECTION, {
        name: UseCase.SPORT_DISCIPLINE.name
      });

      expect(deletedDiscipline).toBeFalsy();
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if discipline does not exist`, async () => {
      const sportDisciplineID = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE.name,
        true
      );

      await UseCase.admin
        .delete(UseCase.PATH_SPORTS.concat(`/${UseCase.prepareFakeIdFromId(sportDisciplineID)}`))
        .send()
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`DELETE ${UseCase.PATH_SPORTS}:/id as user`, () => {
    it(`should always return ${HTTPStatus.FORBIDDEN}`, async () => {
      const sportDisciplineID = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE.name
      );

      await UseCase.user
        .delete(UseCase.PATH_SPORTS.concat(`/${sportDisciplineID}`))
        .send()
        .expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`DELETE ${UseCase.PATH_SPORTS}:/id as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      const sportDisciplineID = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE.name
      );

      await UseCase.unauthenticated
        .delete(UseCase.PATH_SPORTS.concat(`/${sportDisciplineID}`))
        .send()
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
