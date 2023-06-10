import { NextFunction, Router, Response, Request } from 'express';
import Controller from '../interfaces/Controller.interface';
import { Sport } from '../interfaces/Sport.interface';
import { SportModel } from '../models/Sport.model';
import SportNotFoundException from '../exceptions/sport/SportNotFoundException';
import { HttpStatusCode } from '../exceptions/HttpStatusCode';
import dtoValidation from '../middleware/DtoValidation.middleware';
import CreateSportDto from '../dto/Sport.dto';
import authTokenValidationMiddleware from '../middleware/AuthTokenValidation.middleware';

class SportController implements Controller {
  public path = '/sports';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllSports);
    this.router.delete(this.path.concat('/:id'), authTokenValidationMiddleware, this.deleteSport);
    this.router.post(
      this.path,
      authTokenValidationMiddleware,
      dtoValidation(CreateSportDto),
      this.createSport
    );
    this.router.put(
      this.path.concat('/:id'),
      authTokenValidationMiddleware,
      dtoValidation(CreateSportDto),
      this.updateSport
    );
  }

  createSport = async (request: Request, response: Response, next: NextFunction) => {
    const sport: Sport = request.body;
    const createdSport = new SportModel(sport);
    response.send(await createdSport.save());
  };

  deleteSport = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    try {
      await SportModel.findByIdAndDelete(id);
      response.sendStatus(HttpStatusCode.OK);
    } catch (e) {
      next(new SportNotFoundException());
    }
  };

  updateSport = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const sport: Sport = request.body;
    try {
      response.send(await SportModel.findByIdAndUpdate(id, sport, { new: true }));
    } catch (e) {
      next(new SportNotFoundException());
    }
  };

  getAllSports = async (request: Request, response: Response) => {
    const sports: Sport[] = await SportModel.find();
    response.send(sports);
  };
}

export default SportController;
