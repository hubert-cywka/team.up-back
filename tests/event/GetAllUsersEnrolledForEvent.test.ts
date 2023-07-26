import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UserDetailsResponse from '../../src/controllers/user/dto/UserDetailsResponse.dto';

jest.setTimeout(15000);
describe('Testing get all users enrolled for event use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
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
    await UseCase.admin.post(requestPath);
  });

  describe(`GET ${UseCase.PATH_EVENT_ENROLLMENT} as any authenticated user`, () => {
    it(`should return ${HTTPStatus.OK} if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      await UseCase.admin.get(requestPath).expect(HTTPStatus.OK);
    });

    it(`should return list of enrolled users if request is correct`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      const res = (await UseCase.user.get(requestPath)).body;

      expect(res.length).toBeGreaterThan(0);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if event does not exist`, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        UseCase.prepareFakeIdFromId(sportEvent._id.toString())
      );

      await UseCase.user.post(requestPath).expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`GET ${UseCase.PATH_EVENT_ENROLLMENT} as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED} `, async () => {
      const sportEvent = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);
      const requestPath = UseCase.PATH_EVENT_ENROLLMENT.replace(':id', sportEvent.disciplineId.toString()).replace(
        ':eventId',
        sportEvent._id.toString()
      );

      await UseCase.unauthenticated.get(requestPath).expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
