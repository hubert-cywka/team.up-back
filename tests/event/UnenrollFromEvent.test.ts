import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

jest.setTimeout(15000);
describe('Testing unenroll from event use case', () => {
  afterEach(async () => {
    return await UseCase.dropCollections();
  });

  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeEach(async () => {
    await UseCase.createDefaultAccountsAndLogin();
    const res = (await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST)).body;
    const sportDisciplineId = res._id;
    await UseCase.admin.post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId)).send(UseCase.EVENT_CREATE_REQUEST);
    const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
    const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
      ':eventId',
      sportEvent._id.toString()
    );
    await UseCase.user.post(requestPath);
  });

  describe(`DELETE ${UseCase.PATH_EVENT_ENROLLMENT} as any authenticated user`, () => {
    it(`should return ${HTTPStatus.OK} if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      await UseCase.user.delete(requestPath).expect(HTTPStatus.OK);
    });

    it(`should enroll user for event if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      const userEventsLengthBefore = await UseCase.getCollectionLength(UseCase.USER_EVENTS_COLLECTION);
      await UseCase.user.delete(requestPath);
      const userEventsLengthAfter = await UseCase.getCollectionLength(UseCase.USER_EVENTS_COLLECTION);

      expect(userEventsLengthAfter).toBe(userEventsLengthBefore - 1);
    });

    it(`should return ${HTTPStatus.CONFLICT} if user was not enrolled`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );
      await UseCase.user.delete(requestPath).expect(HTTPStatus.OK);
      await UseCase.user.delete(requestPath).expect(HTTPStatus.CONFLICT);
    });

    it(`should not remove any enrollment if user was not enrolled`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );
      await UseCase.user.delete(requestPath);

      const userEventsLengthBefore = await UseCase.getCollectionLength(UseCase.USER_EVENTS_COLLECTION);
      await UseCase.user.delete(requestPath);
      const userEventsLengthAfter = await UseCase.getCollectionLength(UseCase.USER_EVENTS_COLLECTION);

      expect(userEventsLengthAfter).toBe(userEventsLengthBefore);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if sport discipline does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(
        ':id',
        UseCase.prepareFakeIdFromId(sportEvent.disciplineId.toString())
      ).replace(':eventId', sportEvent._id.toString());

      await UseCase.user.delete(requestPath).expect(HTTPStatus.NOT_FOUND);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if event does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        UseCase.prepareFakeIdFromId(sportEvent._id.toString())
      );

      await UseCase.user.delete(requestPath).expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`DELETE ${UseCase.PATH_EVENT_ENROLLMENT} as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED} `, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      await UseCase.unauthenticated.delete(requestPath).expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
