import { model, Schema } from 'mongoose';
import { SportDiscipline } from '../../../shared/types/Sport';

const SportDisciplineSchema = new Schema(
  { name: { required: true, unique: true, type: String } },
  { timestamps: true }
);

export const SportDisciplineModel = model<SportDiscipline>('SportDiscipline', SportDisciplineSchema);
