import { HTTPStatus } from '../../src/helpers/HTTPStatus';
import UseCase from '../UseCase';

describe('Testing update sport discipline use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
  });

  describe(`PUT ${UseCase.PATH_SPORTS}:/id as admin`, () => {
    beforeAll(async () => {
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
    });

    it(`should return ${HTTPStatus.OK} if discipline does exist`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);

      await UseCase.admin
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send(UseCase.SPORT_DISCIPLINE_UPDATE_REQUEST)
        .expect(HTTPStatus.OK);
    });

    it(`should update discipline if it does exist`, async () => {
      const sportDisciplineBeforeUpdate = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);
      const randomDisciplineName = UseCase.prepareFakeString();

      await UseCase.admin
        .put(UseCase.PATH_SPORTS.concat(`/${sportDisciplineBeforeUpdate?._id}`))
        .send({ name: randomDisciplineName })
        .expect(HTTPStatus.OK);

      const updatedDiscipline = await UseCase.findInCollection(UseCase.SPORTS_COLLECTION, {
        name: randomDisciplineName
      });
      expect(updatedDiscipline).toBeTruthy();

      const previousDiscipline = await UseCase.findInCollection(UseCase.SPORTS_COLLECTION, {
        name: sportDisciplineBeforeUpdate?.name
      });
      expect(previousDiscipline).toBeFalsy();
    });

    it(`should not change collection size`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);
      const collectionSizeBefore = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);

      await UseCase.admin
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send(UseCase.SPORT_DISCIPLINE_UPDATE_REQUEST)
        .expect(HTTPStatus.OK);

      const collectionSizeAfter = await UseCase.getCollectionLength(UseCase.SPORTS_COLLECTION);
      expect(collectionSizeAfter).toBe(collectionSizeBefore);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if request body is invalid`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);

      await UseCase.admin
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send({ invalid: 'INVALID' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if request body is invalid`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);

      await UseCase.admin
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send({ name: '' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} if discipline does not exist`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);
      const fakeId = UseCase.prepareFakeIdFromId(sportDiscipline?._id.toString() ?? '1');

      await UseCase.admin
        .post(UseCase.PATH_SPORTS.concat(`/${fakeId}`))
        .send(UseCase.SPORT_DISCIPLINE_UPDATE_REQUEST)
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`PUT ${UseCase.PATH_SPORTS}:/id as user`, () => {
    beforeAll(async () => {
      await UseCase.admin.post(UseCase.PATH_SPORTS).send(UseCase.SPORT_DISCIPLINE_SAVE_REQUEST);
    });

    it(`should always return ${HTTPStatus.FORBIDDEN}`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);

      await UseCase.user
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send(UseCase.SPORT_DISCIPLINE_UPDATE_REQUEST)
        .expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`PUT ${UseCase.PATH_SPORTS}:/id as unauthenticated`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED}`, async () => {
      const sportDiscipline = await UseCase.findFirstInCollection(UseCase.SPORTS_COLLECTION);

      await UseCase.unauthenticated
        .put(UseCase.PATH_SPORTS.concat(`/${sportDiscipline?._id}`))
        .send(UseCase.SPORT_DISCIPLINE_UPDATE_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
