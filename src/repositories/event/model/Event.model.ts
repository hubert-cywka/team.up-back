import { model, Schema } from 'mongoose';
import Event from '../../../types/events/Event.interface';

const EventScheme = new Schema({
  minPlayers: { required: true, type: Number },
  maxPlayers: { required: true, type: Number },
  location: { required: true, type: String },
  startDate: { required: true, type: String },
  disciplineId: { ref: 'SportDiscipline', type: Schema.Types.ObjectId },
  createdBy: { ref: 'User', type: Schema.Types.ObjectId },
  createdAt: {
    type: String,
    default: new Date().toString()
  }
});

export const EventModel = model<Event>('Event', EventScheme);
