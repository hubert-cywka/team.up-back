import { model, Schema } from 'mongoose';
import { SportDiscipline } from '../interfaces/SportDiscipline.interface';

const SportDisciplineScheme = new Schema({ name: String });

export const SportDisciplineModel = model<SportDiscipline>(
  'SportDiscipline',
  SportDisciplineScheme
);
