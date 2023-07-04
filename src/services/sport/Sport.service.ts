import SportRepository from '../../repositories/sport/Sport.repository';
import { SaveSportDiscipline } from './dto/SaveSportDiscipline';

class SportService {
  private sportRepository: SportRepository;

  constructor(sportRepository: SportRepository) {
    this.sportRepository = sportRepository;
  }

  public existsById = async (id: string) => {
    const maybeDiscipline = this.sportRepository.findById(id);
    return !!maybeDiscipline;
  };

  public existsByName = async (name: string) => {
    const maybeDiscipline = this.sportRepository.findAllByName(name);
    return !!maybeDiscipline;
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
