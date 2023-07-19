import mongoose from 'mongoose';
import request, { SuperAgentTest } from 'supertest';
import { Filter } from 'mongodb';
import CreateSportDisciplineRequest from '../src/controllers/sport/dto/CreateDisciplineRequest.dto';
import ChangeRoleRequest from '../src/controllers/user/dto/ChangeRoleRequest.dto';
import SignUpRequestBody from '../src/controllers/authentication/dto/SignUpRequestBody.dto';
import SignInRequestBody from '../src/controllers/authentication/dto/SignInRequestBody.dto';
import CreateEventRequest from '../src/controllers/event/dto/CreateEventRequest.dto';
import { UserRole } from '../src/types/UserRole';
import { SportDiscipline } from '../src/types/Sport';

const app = require('../src/server');

export default class UseCase {
  public static BASE_PATH = '/app';

  public static PATH_USERS = this.BASE_PATH.concat('/users');
  public static PATH_USERS_ME = this.PATH_USERS.concat('/me');

  public static PATH_SPORTS = this.BASE_PATH.concat('/sports');
  public static PATH_EVENTS = this.PATH_SPORTS.concat('/:id/events');

  public static PATH_AUTH = this.BASE_PATH.concat('/auth');
  public static PATH_LOGIN = this.PATH_AUTH.concat('/login');
  public static PATH_REGISTER = this.PATH_AUTH.concat('/register');
  public static PATH_REFRESH = this.PATH_AUTH.concat('/refresh');

  public static SPORTS_COLLECTION = 'sportdisciplines';
  public static USERS_COLLECTION = 'users';
  public static EVENTS_COLLECTION = 'sportevents';

  public static SPORT_DISCIPLINE: SportDiscipline = { _id: 'a12c', name: 'Volleyball' };
  public static UPDATED_SPORT_DISCIPLINE: SportDiscipline = { _id: 'c21a', name: 'Basketball' };
  public static SPORT_DISCIPLINE_SAVE_REQUEST: CreateSportDisciplineRequest = {
    name: UseCase.SPORT_DISCIPLINE.name
  };
  public static SPORT_DISCIPLINE_UPDATE_REQUEST: CreateSportDisciplineRequest = {
    name: UseCase.UPDATED_SPORT_DISCIPLINE.name
  };

  public static EVENT_CREATE_REQUEST: CreateEventRequest = {
    maxPlayers: 8,
    minPlayers: 4,
    startDate: '2030-10-10',
    location: { lat: 50, lng: 10 },
    description: '2 x 30 minutes, no extra time.'
  };

  public static CHANGE_ROLE_TO_ADMIN_REQUEST: ChangeRoleRequest = { role: UserRole.ADMIN };
  public static CHANGE_ROLE_TO_USER_REQUEST: ChangeRoleRequest = { role: UserRole.USER };

  public static SIGN_UP_REQUEST: SignUpRequestBody = {
    name: 'NAME',
    email: 'email@email.com',
    birthdate: '2000-10-10',
    password: 'PASSWORD'
  };

  public static SIGN_IN_REQUEST: SignInRequestBody = {
    email: this.SIGN_UP_REQUEST.email,
    password: this.SIGN_UP_REQUEST.password
  };

  public static JWT_HEADER = 'Authorization';
  public static REFRESH_TOKEN_HEADER = 'RefreshToken';

  public static ADMIN_EMAIL = 'admin@email.com';
  public static USER_EMAIL = 'user@email.com';
  public static PASSWORD = 'UserPassword';

  public static admin = request.agent(app);
  public static user = request.agent(app);
  public static unauthenticated = request.agent(app);

  public static clearDatabase = async () => {
    await this.dropCollections();
    await mongoose.connection.close();
  };

  public static dropCollections = async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.drop();
    }
  };

  public static dropCollectionByName = async (name: string) => {
    const collection = await mongoose.connection.db.collection(name);
    await collection.drop();
  };

  public static registerAndLoginAs = async (as: SuperAgentTest, email: string, role: UserRole) => {
    await as.post(this.PATH_AUTH.concat('/register')).send({
      name: 'User',
      email: email,
      password: this.PASSWORD,
      birthdate: '2000-01-01'
    });
    await mongoose.connection.db.collection('users').findOneAndUpdate({ email: email }, { $set: { role: role } });
    await as.post(this.PATH_AUTH.concat('/login')).send({ email: email, password: this.PASSWORD });
  };

  public static createDefaultAccountsAndLogin = async () => {
    await this.registerAndLoginAs(this.admin, this.ADMIN_EMAIL, UserRole.ADMIN);
    await this.registerAndLoginAs(this.user, this.USER_EMAIL, UserRole.USER);
  };

  public static logoutAll = async () => {
    await this.user.post(this.PATH_AUTH.concat('/logout'));
    await this.admin.post(this.PATH_AUTH.concat('/logout'));
  };

  public static getCollectionLength = async (collection: string) => {
    return await mongoose.connection.db.collection(collection).countDocuments();
  };

  public static findInCollection = async (collection: string, filter: Filter<mongoose.mongo.BSON.Document>) => {
    return await mongoose.connection.db.collection(collection).findOne(filter);
  };

  public static findIdByNameInCollection = async (collection: string, name: string, preventThrow: boolean = false) => {
    const item = await mongoose.connection.db.collection(collection).findOne({ name: name });
    if (!item?._id && !preventThrow)
      throw new Error(`Item with name: '${name}' not found in collection: '${collection}'`);
    return item?._id.toString() ?? '-1';
  };

  public static findFirstInCollection = async (collection: string) => {
    return await mongoose.connection.db.collection(collection).findOne();
  };

  public static prepareFakeIdFromId = (id: string) => {
    return 'f'.repeat(id.length);
  };

  public static prepareFakeString = () => {
    return Math.random().toString(36).slice(2, 7);
  };
}
