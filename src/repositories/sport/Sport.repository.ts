import { Model } from 'mongoose';
import { SportDiscipline } from '../../types/sports/SportDiscipline.interface';
import { SportDisciplineModel } from './model/SportDiscipline.model';
import { SaveSportDiscipline } from '../../services/sport/dto/SaveSportDiscipline';

class SportRepository {
  private sportDisciplineModel: Model<SportDiscipline> = SportDisciplineModel;

  public findAll = () => {
    return this.sportDisciplineModel.find();
  };

  public findById = (id: string) => {
    return this.sportDisciplineModel.findOne({ _id: id });
  };

  public findAllByName = (name: string) => {
    return this.sportDisciplineModel.find({ name: name });
  };

  public save = (disciplineToSave: SaveSportDiscipline) => {
    return this.sportDisciplineModel.create(disciplineToSave);
  };

  public updateById = (id: string, disciplineToSave: SaveSportDiscipline) => {
    return this.sportDisciplineModel.findByIdAndUpdate(id, disciplineToSave, { new: true });
  };

  public deleteById = (id: string) => {
    return this.sportDisciplineModel.findByIdAndDelete(id);
  };
}

export default SportRepository;
