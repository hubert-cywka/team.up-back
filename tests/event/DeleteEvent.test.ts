import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

jest.setTimeout(15000);
describe('Testing delete event use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
    await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
  });

  beforeEach(async () => {
    const sportDisciplineId = await UseCase.findIdByNameInCollection(
      UseCase.SPORTS_COLLECTION,
      UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
    );
    await UseCase.admin.post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId)).send(UseCase.EVENT_CREATE_REQUEST);
  });

  describe(`DELETE ${UseCase.PATH_EVENTS}/{:id} as admin`, () => {
    it(`should return ${HTTPStatus.OK} if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send()
        .expect(HTTPStatus.OK);
    });

    it(`should delete event if request is correct`, async () => {
      const sizeBefore = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);

      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send();

      const sizeAfter = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);
      expect(sizeAfter).toBe(sizeBefore - 1);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if sport discipline does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const fakeSportDisciplineId = UseCase.prepareFakeIdFromId(sportDisciplineId);

      await UseCase.admin
        .delete(UseCase.PATH_EVENTS.replace(':id', fakeSportDisciplineId).concat(`/${sportEvent?._id}`))
        .send()
        .expect(HTTPStatus.NOT_FOUND);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if sport event does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const fakeSportEventId = UseCase.prepareFakeIdFromId(sportEvent?._id.toString() ?? '');

      await UseCase.admin
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${fakeSportEventId}`))
        .send()
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`DELETE ${UseCase.PATH_EVENTS}/{:id} as user`, () => {
    it(`should return ${HTTPStatus.OK} if user is creator of event`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const res = await UseCase.user
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST);

      await UseCase.user
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${res.body._id}`))
        .send()
        .expect(HTTPStatus.OK);
    });

    it(`should return ${HTTPStatus.FORBIDDEN} if user is not creator of event`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.user
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send()
        .expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`DELETE ${UseCase.PATH_EVENTS}/{:id} as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.unauthenticated
        .delete(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
