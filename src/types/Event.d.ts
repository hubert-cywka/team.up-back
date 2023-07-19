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
