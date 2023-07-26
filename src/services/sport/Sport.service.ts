import SportRepository from '../../repositories/sport/Sport.repository';
import { SaveSportDiscipline } from './dto/SaveSportDiscipline';
import EventRepository from '../../repositories/event/Event.repository';
import moongose from 'mongoose';
import Logger from '../../shared/helpers/Logger';

class SportService {
  private sportRepository: SportRepository;
  private eventRepository: EventRepository;

  constructor(sportRepository: SportRepository, eventRepository: EventRepository) {
    this.sportRepository = sportRepository;
    this.eventRepository = eventRepository;
  }

  public existsById = async (id: string) => {
    const maybeDiscipline = await this.sportRepository.findById(id);
    return !!maybeDiscipline;
  };

  public existsByName = async (name: string) => {
    const maybeDiscipline = await this.sportRepository.findAllByName(name);
    return !!maybeDiscipline.length;
  };

  public save = async (disciplineToSave: SaveSportDiscipline) => {
    if (!(await this.existsByName(disciplineToSave.name))) {
      return await this.sportRepository.save(disciplineToSave);
    } else {
      return null;
    }
  };

  public updateById = async (id: string, disciplineToUpdate: SaveSportDiscipline) => {
    if (!(await this.existsById(id))) {
      return null;
    } else {
      return this.sportRepository.updateById(id, disciplineToUpdate);
    }
  };

  public deleteById = async (id: string) => {
    if (!(await this.existsById(id))) {
      return null;
    } else {
      return this.sportRepository.deleteById(id);
    }
  };
}

export default SportService;
