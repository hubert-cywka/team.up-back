import { model, Schema } from 'mongoose';
import { SportDiscipline } from '../../../shared/types/Sport';
import { SportEventModel } from '../../event/model/SportEvent.model';

const SportDisciplineSchema = new Schema(
  { name: { required: true, unique: true, type: String } },
  { timestamps: true }
).pre('findOneAndDelete', { document: false, query: true }, async function () {
  const sport = await this.model.findOne(this.getFilter());
  await SportEventModel.deleteMany({ disciplineId: sport._id });
});

export const SportDisciplineModel = model<SportDiscipline>('SportDiscipline', SportDisciplineSchema);
