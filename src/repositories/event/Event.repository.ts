import { Model } from 'mongoose';
import { SportEventModel } from './model/SportEvent.model';
import { SportEvent } from 'types/Event';
import { SaveEvent } from 'services/event/dto/SaveEvent';

class EventRepository {
  private eventModel: Model<SportEvent> = SportEventModel;

  public findAllByDisciplineId = (id: string) => {
    return this.eventModel.find({ disciplineId: id });
  };

  public findById = (id: string) => {
    return this.eventModel.findOne({ _id: id });
  };

  public save = (eventToSave: SaveEvent) => {
    return this.eventModel.create(eventToSave);
  };

  public updateById = (id: string, event: SportEvent) => {
    return this.eventModel.findByIdAndUpdate(id, event, { new: true });
  };

  public deleteById = (id: string) => {
    return this.eventModel.findByIdAndDelete(id);
  };
}

export default EventRepository;
