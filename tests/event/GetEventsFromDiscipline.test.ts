import UseCase from '../UseCase';
import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';

describe('Testing get events from discipline use case', () => {
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

  describe(`GET ${UseCase.PATH_EVENTS} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if sport discipline exists`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      await UseCase.unauthenticated
        .get(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId))
        .send()
        .expect(HTTPStatus.OK);
    });

    it(`should return list of events`, async () => {
      const sportDisciplineId = await UseCase.findIdByNameInCollection(
        UseCase.SPORTS_COLLECTION,
        UseCase.SPORT_DISCIPLINE_SAVE_REQUEST.name
      );

      const res = await UseCase.unauthenticated.get(UseCase.PATH_EVENTS.replace(':id', sportDisciplineId)).send();

      expect(res.body).toBeTruthy();
      expect(res.body.length).toBe(1);
    });
  });
});
