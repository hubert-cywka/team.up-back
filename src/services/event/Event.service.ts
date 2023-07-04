import EventRepository from '../../repositories/event/Event.repository';
import { SaveEvent } from './dto/SaveEvent';
import CreateEventRequest from '../../controllers/event/dto/CreateEventRequest.dto';
import { User } from '../../types/users/User.interface';
import Event from '../../types/events/Event.interface';
import { UserRole } from '../../types/users/UserRole';

class EventService {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  public findAllByDisciplineId = async (id: string) => {
    return this.eventRepository.findAllByDisciplineId(id);
  };

  public findById = async (id: string) => {
    return this.eventRepository.findById(id);
  };

  public saveEventWithUserIdAndDisciplineId = async (
    eventToSave: CreateEventRequest,
    userId: string,
    disciplineId: string
  ) => {
    const updatedEventToSave: SaveEvent = { ...eventToSave, disciplineId: disciplineId, createdBy: userId };
    return this.eventRepository.save(updatedEventToSave);
  };

  public updateEvent = async (id: string, eventToUpdate: Event) => {
    return this.eventRepository.updateById(id, eventToUpdate);
  };

  public deleteEvent = async (id: string) => {
    return this.eventRepository.deleteById(id);
  };

  public isUserAuthorizedToModifyEvent = async (user: User, eventId: string) => {
    const eventToModify = await this.findById(eventId);
    return eventToModify?.createdBy === user._id || user.role === UserRole.ADMIN;
  };
}

export default EventService;
