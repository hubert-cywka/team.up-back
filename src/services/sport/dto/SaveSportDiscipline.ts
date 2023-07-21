import { SportDiscipline } from '../../../shared/types/sports/SportDiscipline.interface';

export type SaveSportDiscipline = Omit<SportDiscipline, '_id'>;
