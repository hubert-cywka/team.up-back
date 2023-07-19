import EventRepository from '../../repositories/event/Event.repository';
import { SaveEvent } from './dto/SaveEvent';
import CreateEventRequest from '../../controllers/event/dto/CreateEventRequest.dto';
import { User } from '../../types/User';
import { SportEvent } from '../../types/Event';
import { UserRole } from '../../types/UserRole';

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
    const updatedEventToSave: SaveEvent = { ...eventToSave, disciplineId: disciplineId, createdBy: userId.toString() };
    return this.eventRepository.save(updatedEventToSave);
  };

  public updateEvent = async (id: string, eventToUpdate: SportEvent) => {
    return this.eventRepository.updateById(id, eventToUpdate);
  };

  public deleteEvent = async (id: string) => {
    return this.eventRepository.deleteById(id);
  };

  public isUserAuthorizedToModifyEvent = async (user: User, eventId: string) => {
    const eventToModify = await this.findById(eventId);
    return eventToModify?.createdBy.toString() === user._id.toString() || user.role === UserRole.ADMIN;
  };
}

export default EventService;
