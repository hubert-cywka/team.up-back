import Event from '../../../types/events/Event.interface';

export type SaveEvent = Omit<Event, '_id'>;
