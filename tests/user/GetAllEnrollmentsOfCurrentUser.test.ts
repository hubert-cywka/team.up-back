import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

jest.setTimeout(15000);
describe('Testing get all enrollments of current user use case', () => {
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

    await UseCase.user.post(requestPath).expect(HTTPStatus.OK);
  });

  describe(`GET ${UseCase.PATH_USER_ENROLLMENTS} any authenticated user`, () => {
    it(`should return ${HTTPStatus.OK} if request is correct`, async () => {
      await UseCase.user.get(UseCase.PATH_USER_ENROLLMENTS).expect(HTTPStatus.OK);
    });

    it(`should return list events if request is correct`, async () => {
      const res = (await UseCase.user.get(UseCase.PATH_USER_ENROLLMENTS)).body;
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe(`GET ${UseCase.PATH_USER_ENROLLMENTS} as unauthenticated user`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED} `, async () => {
      await UseCase.unauthenticated.get(UseCase.PATH_USER_ENROLLMENTS).expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
