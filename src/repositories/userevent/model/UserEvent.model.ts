import { model, Schema } from 'mongoose';
import { UserEvent } from '../../../shared/types/Event';

const UserEventSchema = new Schema({
  userId: { ref: 'User', type: Schema.Types.ObjectId },
  eventId: { ref: 'SportEvent', type: Schema.Types.ObjectId }
});

export const UserEventModel = model<UserEvent>('UserEvent', UserEventSchema);
