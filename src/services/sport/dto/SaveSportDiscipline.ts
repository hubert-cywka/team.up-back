import { SportDiscipline } from '../../../types/sports/SportDiscipline.interface';

export type SaveSportDiscipline = Omit<SportDiscipline, '_id'>;
