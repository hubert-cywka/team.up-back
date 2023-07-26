import { User } from './User';

export interface SportEvent {
  _id: string;
  minPlayers: number;
  maxPlayers: number;
  location: GeoPosition;
  startDate: string;
  disciplineId: string;
  description: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeoPosition {
  lat: number;
  lng: number;
}

export interface UserEvent {
  userId: string;
  eventId: string;
}

export interface SportEventWithUsers extends SportEvent {
  users: User[];
}
