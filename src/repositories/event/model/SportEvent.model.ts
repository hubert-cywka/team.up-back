import { model, Schema } from 'mongoose';
import { SportEvent } from 'shared/types/Event';
import { UserEventModel } from '../../userevent/model/UserEvent.model';

const LocationSchema = new Schema({
  lat: { required: true, type: Number },
  lng: { required: true, type: Number }
});

const SportEventSchema = new Schema(
  {
    minPlayers: { required: true, type: Number },
    maxPlayers: { required: true, type: Number },
    startDate: { required: true, type: String },
    description: { required: true, type: String },
    location: { required: true, type: LocationSchema },
    disciplineId: { ref: 'SportDiscipline', type: Schema.Types.ObjectId },
    createdBy: { ref: 'User', type: Schema.Types.ObjectId }
  },
  { timestamps: true }
).pre('findOneAndDelete', { document: false, query: true }, async function () {
  const event = await this.model.findOne(this.getFilter());
  await UserEventModel.deleteMany({ eventId: event._id });
});

export const SportEventModel = model<SportEvent>('SportEvent', SportEventSchema);
