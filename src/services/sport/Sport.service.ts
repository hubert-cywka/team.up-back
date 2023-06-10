import CreateSportDisciplineRequest from '../../controllers/sport/dto/CreateDisciplineRequest.dto';
import SportRepository from '../../repositories/sport/Sport.repository';

class SportService {
  private sportRepository = new SportRepository();

  constructor() {}

  public saveSportDiscipline = async (disciplineToSave: CreateSportDisciplineRequest) => {
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
    disciplineToUpdate: CreateSportDisciplineRequest
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
