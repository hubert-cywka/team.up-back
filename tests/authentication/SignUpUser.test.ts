import { HTTPStatus } from '../../src/helpers/HTTPStatus';
import UseCase from '../UseCase';
import { UserRole } from '../../src/types/UserRole';

describe('Testing sign up use case', () => {
  afterEach(async () => {
    return await UseCase.dropCollections();
  });

  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  describe(`POST ${UseCase.PATH_REGISTER} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if user does not have account yet`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST).expect(HTTPStatus.OK);
    });

    it(`should create new user if user does not have account yet`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST);
      const createdUser = await UseCase.findInCollection(UseCase.USERS_COLLECTION, {
        email: UseCase.SIGN_UP_REQUEST.email
      });
      expect(createdUser).toBeTruthy();
      expect(createdUser?.email).toBe(UseCase.SIGN_UP_REQUEST.email);
    });

    it(`should cipher user password on sign up`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST);
      const createdUser = await UseCase.findInCollection(UseCase.USERS_COLLECTION, {
        email: UseCase.SIGN_UP_REQUEST.email
      });
      expect(createdUser?.password).not.toBe(UseCase.SIGN_UP_REQUEST.password);
    });

    it(`should return ${HTTPStatus.CONFLICT} if user with same email exists`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST);
      await UseCase.unauthenticated
        .post(UseCase.PATH_REGISTER)
        .send(UseCase.SIGN_UP_REQUEST)
        .expect(HTTPStatus.CONFLICT);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if sign up request is not valid`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send({ ...UseCase.SIGN_UP_REQUEST, email: '' });
    });

    it(`should set ${UserRole.USER} role as default`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST);
      const createdUser = await UseCase.findInCollection(UseCase.USERS_COLLECTION, {
        email: UseCase.SIGN_UP_REQUEST.email
      });
      expect(createdUser?.role).toBe(UserRole.USER);
    });
  });
});
