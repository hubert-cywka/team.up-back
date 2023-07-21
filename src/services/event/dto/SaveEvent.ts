import { SportEvent } from 'shared/types/Event';

export type SaveEvent = Omit<SportEvent, '_id'>;
