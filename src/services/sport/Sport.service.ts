import SportRepository from '../../repositories/sport/Sport.repository';
import { SaveSportDiscipline } from './dto/SaveSportDiscipline';

class SportService {
  private sportRepository: SportRepository;

  constructor(sportRepository: SportRepository) {
    this.sportRepository = sportRepository;
  }

  public saveSportDiscipline = async (disciplineToSave: SaveSportDiscipline) => {
    const disciplinesWithGivenName = await this.sportRepository.findSportDisciplinesByName(
      disciplineToSave.name
    );

    if (disciplinesWithGivenName.length) {
      return null;
    } else {
      return await this.sportRepository.saveSportDiscipline(disciplineToSave);
    }
  };

  public updateSportDisciplineById = async (
    id: string,
    disciplineToUpdate: SaveSportDiscipline
  ) => {
    const foundDiscipline = this.sportRepository.findSportDisciplineById(id);

    if (!foundDiscipline) {
      return null;
    } else {
      return await this.sportRepository.updateSportDisciplineById(id, disciplineToUpdate);
    }
  };

  public deleteSportDisciplineById = async (id: string) => {
    const foundDiscipline = this.sportRepository.findSportDisciplineById(id);

    if (!foundDiscipline) {
      return null;
    } else {
      return await this.sportRepository.deleteSportDisciplineById(id);
    }
  };
}

export default SportService;
