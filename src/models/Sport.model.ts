import { Sport } from '../interfaces/Sport.interface';
import { model, Schema } from 'mongoose';

const sportSchema = new Schema({ name: String });

export const SportModel = model<Sport>('Sport', sportSchema);
