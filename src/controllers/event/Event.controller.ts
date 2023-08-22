import { NextFunction, Request, Response, Router } from 'express';
import EventService from '../../services/event/Event.service';
import SportService from '../../services/sport/Sport.service';
import SportDisciplineNotFoundResponse from '../sport/dto/SportDisciplineNotFoundResponse';
import EventNotFoundResponse from './dto/EventNotFoundResponse.dto';
import NotAuthorizedToModifyEventResponse from './dto/NotAuthorizedToModifyEventResponse.dto';
import authTokenValidation from '../../middleware/authentication/AuthTokenValidation.middleware';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import CreateEventRequest from './dto/CreateEventRequest.dto';
import { Controller } from '../../shared/types/Controller';
import { RequestWithUser } from '../../shared/types/User';
import { HTTPStatus } from '../../shared/helpers/HTTPStatus';
import AlreadyEnrolledForEventResponse from './dto/AlreadyEnrolledForEventResponse.dto';
import NeverEnrolledForEventResponse from './dto/NeverEnrolledForEventResponse.dto';
import authorizationValidation from '../../middleware/authorization/AuthorizationValidation.middleware';
import { UserRole } from '../../shared/types/UserRole';
import UserService from '../../services/user/User.service';

class EventController implements Controller {
  public path = '/sports';
  public router = Router();
  private eventService: EventService;
  private sportService: SportService;
  private userService: UserService;

  constructor(eventService: EventService, sportService: SportService, userService: UserService) {
    this.eventService = eventService;
    this.sportService = sportService;
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .get(this.path.concat('/:id/events'), this.validateDisciplineExistence, this.getEventsFromDiscipline)
      .get(
        this.path.concat('/:id/events/:eventId'),
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.getEventFromDisciplineById
      )
      .post(
        this.path.concat('/:id/events'),
        authTokenValidation,
        dtoValidation(CreateEventRequest),
        this.validateDisciplineExistence,
        this.createEvent
      )
      .put(
        this.path.concat('/:id/events/:eventId'),
        authTokenValidation,
        dtoValidation(CreateEventRequest),
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.updateEvent
      )
      .delete(
        this.path.concat('/:id/events/:eventId'),
        authTokenValidation,
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.deleteEvent
      )
      .post(
        this.path.concat('/:id/events/:eventId/enrollment'),
        authTokenValidation,
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.enrollForEvent
      )
      .delete(
        this.path.concat('/:id/events/:eventId/enrollment'),
        authTokenValidation,
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.unenrollFromEvent
      )
      .get(
        this.path.concat('/:id/events/:eventId/enrollment'),
        authTokenValidation,
        this.validateDisciplineExistence,
        this.validateEventExistence,
        this.getAllUsersEnrolledForEvent
      );
  }

  private validateDisciplineExistence = async (request: Request, response: Response, next: NextFunction) => {
    const disciplineId = request.params.id;
    if (!(await this.sportService.existsById(disciplineId))) {
      next(new SportDisciplineNotFoundResponse());
    } else {
      next();
    }
  };

  private validateEventExistence = async (request: Request, response: Response, next: NextFunction) => {
    const eventId = request.params.eventId;
    if (!(await this.eventService.existsById(eventId))) {
      next(new EventNotFoundResponse());
    } else {
      next();
    }
  };

  private getEventsFromDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const minimumStartDate = request.params.startDate ?? new Date().toISOString();
    response.send(await this.eventService.findAllByDisciplineIdAndDate(request.params.id, minimumStartDate));
  };

  private getEventFromDisciplineById = async (request: Request, response: Response, next: NextFunction) => {
    response.send(await this.eventService.findOneById(request.params.eventId));
  };

  private createEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const savedEvent = await this.eventService.saveEventWithUserIdAndDisciplineId(
      requestWithUser.body,
      requestWithUser.user._id,
      requestWithUser.params.id
    );
    response.status(HTTPStatus.CREATED).send(savedEvent);
  };

  private updateEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const eventId = requestWithUser.params.eventId;
    const user = requestWithUser.user;

    if (!(await this.eventService.isUserAuthorizedToModifyEvent(user, eventId))) {
      return next(new NotAuthorizedToModifyEventResponse());
    }

    response.send(await this.eventService.updateEvent(eventId, request.body));
  };

  private deleteEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const eventId = requestWithUser.params.eventId;
    const user = requestWithUser.user;

    if (!(await this.eventService.isUserAuthorizedToModifyEvent(user, eventId))) {
      return next(new NotAuthorizedToModifyEventResponse());
    }

    response.send(await this.eventService.deleteEvent(eventId));
  };

  private enrollForEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const eventId = requestWithUser.params.eventId;
    const user = requestWithUser.user;

    const enrollment = await this.eventService.enrollUserForEvent(user._id, eventId);
    if (!enrollment) {
      return next(new AlreadyEnrolledForEventResponse());
    }

    response.send(enrollment);
  };

  private unenrollFromEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const eventId = requestWithUser.params.eventId;
    const user = requestWithUser.user;

    if (!(await this.eventService.unenrollUserFromEvent(user._id, eventId))) {
      return next(new NeverEnrolledForEventResponse());
    }

    response.sendStatus(HTTPStatus.OK);
  };

  private getAllUsersEnrolledForEvent = async (request: Request, response: Response, next: NextFunction) => {
    const requestWithUser = request as RequestWithUser;
    const eventId = requestWithUser.params.eventId;

    const users = await this.eventService.getUserEnrolledForEventBySportEventId(eventId);
    if (users) {
      const prepared = this.userService.prepareDetailsFromUsers(users);
      response.send(prepared);
    } else {
      next(new EventNotFoundResponse());
    }
  };
}

export default EventController;
