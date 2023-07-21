import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

describe('Testing create event use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
    await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
  });

  describe(`POST ${UseCase.PATH_EVENTS} as any authenticated user`, () => {
    it(`should return ${HTTPStatus.CREATED} if request is correct`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.CREATED);
    });

    it(`should save event if request is correct`, async () => {
      const sizeBefore = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST);

      const sizeAfter = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);
      expect(sizeAfter).toBe(sizeBefore + 1);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if request is not correct`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send({ wrongRequest: 'WRONG_REQUEST' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if sport discipline does not exist`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const fakeSportDisciplineId = UseCase.prepareFakeIdFromId(sportDisciplineId);

      await UseCase.admin
        .post(UseCase.PATH_EVENTS.replace(':id', fakeSportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`POST ${UseCase.PATH_EVENTS} as unauthenticated user`, () => {
    it(`should return ${HTTPStatus.UNAUTHORIZED} if request is correct`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.unauthenticated
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
