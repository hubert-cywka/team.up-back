import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

describe('Testing update event use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
    const res = (await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)).body;
    const sportDisciplineId = res._id;
    await UseCase.admin.post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId)).send(UseCase.EVENT_CREATE_REQUEST);
  });

  describe(`PUT ${UseCase.PATH_EVENTS}/{:id} as admin`, () => {
    it(`should return ${HTTPStatus.OK} if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.OK);
    });

    it(`should never create new event`, async () => {
      const sizeBefore = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);

      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST);

      const sizeAfter = await UseCase.getCollectionLength(UseCase.EVENTS_COLLECTION);
      expect(sizeAfter).toBe(sizeBefore);
    });

    it(`should update event if request is correct`, async () => {
      const mockDescription = 'This should be new description';

      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const res = await UseCase.admin
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send({ ...UseCase.EVENT_CREATE_REQUEST, description: mockDescription });

      expect(res.body.description).toBe(mockDescription);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if request is not correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.admin
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send({ incorrect: 'Incorrect' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if sport discipline does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const fakeSportDisciplineId = UseCase.prepareFakeIdFromId(sportDisciplineId);

      await UseCase.admin
        .put(UseCase.PATH_EVENTS.replace(':id', fakeSportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
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
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${fakeSportEventId}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`PUT ${UseCase.PATH_EVENTS}/{:id} as user`, () => {
    it(`should return ${HTTPStatus.OK} if user is creator of event`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const res = await UseCase.user
        .post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send(UseCase.EVENT_CREATE_REQUEST);

      await UseCase.user
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${res.body._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.OK);
    });

    it(`should return ${HTTPStatus.FORBIDDEN} if user is not creator of event`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.user
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`PUT ${UseCase.PATH_EVENTS}/{:id} as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.unauthenticated
        .put(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId).concat(`/${sportEvent?._id}`))
        .send(UseCase.EVENT_CREATE_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
