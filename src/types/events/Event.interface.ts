interface Event {
  _id: string;
  minPlayers: number;
  maxPlayers: number;
  location: string;
  startDate: string;
  disciplineId: string;
  createdBy: string;
  createdAt?: string;
}

export default Event;
