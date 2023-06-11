import { model, Schema } from 'mongoose';
import { SportDiscipline } from '../../../types/sports/SportDiscipline.interface';

const SportDisciplineScheme = new Schema({ name: { required: true, unique: true, type: String } });

export const SportDisciplineModel = model<SportDiscipline>(
  'SportDiscipline',
  SportDisciplineScheme
);
