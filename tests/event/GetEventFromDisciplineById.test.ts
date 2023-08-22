import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

jest.setTimeout(15000);
describe('Testing get event from discipline use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
    await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
    const sportDisciplineId = await UseCase.findIdByNameInCollection(
      UseCase.SPORTS_COLLECTION,
      UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
    );
    await UseCase.admin.post(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId)).send(UseCase.EVENT_CREATE_REQUEST);
  });

  describe(`GET ${UseCase.PATH_EVENT} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if sport discipline exists`, async () => {
      const event = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);

      await UseCase.unauthenticated
        .get(UseCase.PATH_EVENT.replace(':id', event.disciplineId.toString()).replace(':eventId', event._id.toString()))
        .send()
        .expect(HTTPStatus.OK);
    });

    it(`should return one event`, async () => {
      const event = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);

      const res = await UseCase.unauthenticated
        .get(UseCase.PATH_EVENT.replace(':id', event.disciplineId.toString()).replace(':eventId', event._id.toString()))
        .send();

      expect(res.body).toBeTruthy();
      expect(res.body._id).toBe(event._id.toString());
    });

    it(`should return 404 if event does not exist`, async () => {
      const event = await UseCase.findFirstInCollection(UseCase.EVENTS_COLLECTION);

      await UseCase.unauthenticated
        .get(
          UseCase.PATH_EVENT.replace(':id', event.disciplineId.toString()).replace(
            ':eventId',
            UseCase.prepareFakeIdFromId(event._id.toString())
          )
        )
        .send()
        .expect(404);
    });
  });
});
