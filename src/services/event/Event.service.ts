import EventRepository from '../../repositories/event/Event.repository';
import { SaveEvent } from './dto/SaveEvent';
import CreateEventRequest from '../../controllers/event/dto/CreateEventRequest.dto';
import { User } from '../../shared/types/User';
import { SportEvent } from '../../shared/types/Event';
import { UserRole } from '../../shared/types/UserRole';
import UserEventRepository from '../../repositories/userevent/UserEvent.repository';
import mongoose from 'mongoose';

class EventService {
  private eventRepository: EventRepository;
  private userEventRepository: UserEventRepository;

  constructor(eventRepository: EventRepository, userEventRepository: UserEventRepository) {
    this.eventRepository = eventRepository;
    this.userEventRepository = userEventRepository;
  }

  public findAllByDisciplineId = async (id: string) => {
    return this.eventRepository.findAllByDisciplineId(id);
  };

  public findById = async (id: string) => {
    return this.eventRepository.findById(id);
  };

  public existsById = async (id: string) => {
    return this.eventRepository.existsById(id);
  };

  public saveEventWithUserIdAndDisciplineId = async (
    eventToSave: CreateEventRequest,
    userId: string,
    disciplineId: string
  ) => {
    const updatedEventToSave: SaveEvent = { ...eventToSave, disciplineId: disciplineId, createdBy: userId.toString() };

    const session = await mongoose.startSession();
    let savedEvent;

    try {
      await session.withTransaction(async () => {
        savedEvent = await this.eventRepository.save(updatedEventToSave);
        await this.userEventRepository.saveUserEvent({ eventId: savedEvent._id, userId: userId });
      });
    } catch (e) {
      return null;
    }

    await session.endSession();
    return savedEvent;
  };

  public updateEvent = async (id: string, eventToUpdate: SportEvent) => {
    return this.eventRepository.updateById(id, eventToUpdate);
  };

  public deleteEvent = async (id: string) => {
    return this.eventRepository.deleteById(id);
  };

  public isUserAuthorizedToModifyEvent = async (user: User, eventId: string) => {
    const eventToModify = (await this.findById(eventId))[0];
    return eventToModify?.createdBy.toString() === user._id.toString() || user.role === UserRole.ADMIN;
  };

  public enrollUserForEvent = async (userId: string, eventId: string) => {
    if (await this.userEventRepository.existsByUserIdAndSportEventId(userId, eventId)) {
      return null;
    } else {
      return this.userEventRepository.saveUserEvent({ userId, eventId });
    }
  };

  public unenrollUserFromEvent = async (userId: string, eventId: string) => {
    if (!(await this.userEventRepository.existsByUserIdAndSportEventId(userId, eventId))) {
      return null;
    } else {
      return this.userEventRepository.deleteUserEventByUserIdAndSportEventId(userId, eventId);
    }
  };

  public getEnrollmentsOfUserByUserId = async (userId: string) => {
    if (!(await this.userEventRepository.existsByUserId(userId))) {
      return null;
    } else {
      return this.userEventRepository.getEventsByUserId(userId);
    }
  };

  public getUserEnrolledForEventBySportEventId = async (eventId: string): Promise<User[] | null> => {
    if (!(await this.userEventRepository.existsBySportEventId(eventId))) {
      return null;
    } else {
      return this.userEventRepository.getUsersBySportEventId(eventId);
    }
  };
}

export default EventService;
