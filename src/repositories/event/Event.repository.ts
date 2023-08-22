import mongoose, { HydratedDocument, Model, QueryWithHelpers, Schema } from 'mongoose';
import { SportEventModel } from './model/SportEvent.model';
import { SportEvent } from 'shared/types/Event';
import { SaveEvent } from 'services/event/dto/SaveEvent';
import { DeleteResult } from 'mongodb';

class EventRepository {
  private eventModel: Model<SportEvent> = SportEventModel;

  public findAllByDisciplineIdAndDate = (id: string, date: string) => {
    return this.eventModel.aggregate([
      {
        $match: { $and: [{ disciplineId: new mongoose.Types.ObjectId(id) }, { startDate: { $gte: date } }] }
      },
      {
        $lookup: {
          from: 'userevents',
          localField: '_id',
          foreignField: 'eventId',
          as: 'usersAssigned'
        }
      },
      {
        $unwind: {
          path: '$usersAssigned',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'usersAssigned.userId',
          foreignField: '_id',
          as: 'usersAssigned.user'
        }
      },
      {
        $unwind: {
          path: '$usersAssigned.user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          minPlayers: { $first: '$minPlayers' },
          maxPlayers: { $first: '$maxPlayers' },
          location: { $first: '$location' },
          startDate: { $first: '$startDate' },
          disciplineId: { $first: '$disciplineId' },
          description: { $first: '$description' },
          createdBy: { $first: '$createdBy' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          users: { $push: '$usersAssigned.user' }
        }
      }
    ]);
  };

  public findById = (id: string) => {
    return this.eventModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'userevents',
          localField: '_id',
          foreignField: 'eventId',
          as: 'usersAssigned'
        }
      },
      {
        $unwind: {
          path: '$usersAssigned',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'usersAssigned.userId',
          foreignField: '_id',
          as: 'usersAssigned.user'
        }
      },
      {
        $unwind: {
          path: '$usersAssigned.user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: '$_id',
          minPlayers: 1,
          maxPlayers: 1,
          location: 1,
          startDate: 1,
          disciplineId: 1,
          description: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          users: '$usersAssigned'
        }
      }
    ]);
  };

  public existsById = (id: string) => {
    return this.eventModel.exists({ _id: id });
  };

  public save = (eventToSave: SaveEvent) => {
    return this.eventModel.create(eventToSave);
  };

  public updateById = (id: string, event: SportEvent) => {
    return this.eventModel.findByIdAndUpdate(id, event, { new: true });
  };

  public deleteById = (id: string) => {
    return this.eventModel.findOneAndDelete({ _id: id });
  };

  public deleteAllBySportId = (
    id: string
  ): QueryWithHelpers<DeleteResult, HydratedDocument<SportEvent, {}, {}>, {}, SportEvent, 'deleteMany'> => {
    return this.eventModel.deleteMany({ disciplineId: id });
  };
}

export default EventRepository;
