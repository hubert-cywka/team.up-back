import mongoose, { Model } from 'mongoose';
import { UserEvent } from '../../shared/types/Event';
import { UserEventModel } from './model/UserEvent.model';

class UserEventRepository {
  private userEventModel: Model<UserEvent> = UserEventModel;

  public saveUserEvent = (userEvent: UserEvent) => {
    return this.userEventModel.create(userEvent);
  };

  public existsByUserIdAndSportEventId = (userId: string, eventId: string) => {
    return this.userEventModel.exists({ eventId: eventId, userId: userId });
  };

  public existsByUserId = (userId: string) => {
    return this.userEventModel.exists({ userId: userId });
  };

  public existsBySportEventId = (eventId: string) => {
    return this.userEventModel.exists({ eventId: eventId });
  };

  public deleteUserEventByUserIdAndSportEventId = (userId: string, eventId: string) => {
    return this.userEventModel.findOneAndDelete({ userId: userId, eventId: eventId });
  };

  public getEventsByUserId = (userId: string) => {
    return this.userEventModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'sportevents',
          localField: 'eventId',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $group: {
          _id: '$_id',
          minPlayers: { $first: '$eventData.minPlayers' },
          maxPlayers: { $first: '$eventData.maxPlayers' },
          location: { $first: '$eventData.location' },
          startDate: { $first: '$eventData.startDate' },
          disciplineId: { $first: '$eventData.disciplineId' },
          description: { $first: '$eventData.description' },
          createdBy: { $first: '$eventData.createdBy' },
          createdAt: { $first: '$eventData.createdAt' },
          updatedAt: { $first: '$eventData.updatedAt' },
          users: { $push: '$userData' }
        }
      }
    ]);
  };

  public getUsersBySportEventId = (eventId: string) => {
    return this.userEventModel.aggregate([
      {
        $match: { eventId: new mongoose.Types.ObjectId(eventId) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $replaceRoot: {
          newRoot: '$userData'
        }
      }
    ]);
  };
}

export default UserEventRepository;
