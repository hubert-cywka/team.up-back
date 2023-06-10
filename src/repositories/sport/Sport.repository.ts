import { Model } from 'mongoose';
import { SportDiscipline } from '../../interfaces/SportDiscipline.interface';
import { SportDisciplineModel } from '../../models/SportDiscipline.model';
import CreateSportDisciplineRequest from '../../controllers/sport/dto/CreateDisciplineRequest.dto';

class SportRepository {
  private sportDisciplineModel: Model<SportDiscipline> = SportDisciplineModel;

  constructor() {}

  public findAll = async () => {
    return this.sportDisciplineModel.find();
  };

  public findSportDisciplineById = async (id: string) => {
    return this.sportDisciplineModel.findOne({ _id: id });
  };

  public findSportDisciplinesByName = async (name: string) => {
    return this.sportDisciplineModel.find({ name: name });
  };

  public saveSportDiscipline = async (disciplineToSave: CreateSportDisciplineRequest) => {
    return this.sportDisciplineModel.create(disciplineToSave);
  };

  public updateSportDisciplineById = async (
    id: string,
    disciplineToSave: CreateSportDisciplineRequest
  ) => {
    return this.sportDisciplineModel.findByIdAndUpdate(id, disciplineToSave, { new: true });
  };

  public deleteSportDisciplineById = async (id: string) => {
    return this.sportDisciplineModel.findByIdAndDelete(id);
  };
}

export default SportRepository;
