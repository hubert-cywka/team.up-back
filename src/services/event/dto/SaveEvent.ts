import { SportEvent } from 'types/Event';

export type SaveEvent = Omit<SportEvent, '_id'>;
