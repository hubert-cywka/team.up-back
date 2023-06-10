import { NextFunction, Router, Response, Request } from 'express';
import Controller from '../../interfaces/Controller.interface';
import authTokenValidationMiddleware from '../../middleware/authentication/AuthTokenValidation.middleware';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import CreateSportDisciplineRequest from './dto/CreateDisciplineRequest.dto';
import { SportDiscipline } from '../../interfaces/SportDiscipline.interface';
import { HttpStatusCode } from '../../exceptions/HttpStatusCode';
import SportDisciplineNotFoundException from '../../exceptions/sport/SportDisciplineNotFoundException';
import SportService from '../../services/sport/Sport.service';
import SportDisciplineAlreadyExistsException from '../../exceptions/sport/SportDisciplineAlreadyExistsException';
import SportRepository from '../../repositories/sport/Sport.repository';

class SportController implements Controller {
  public path = '/sports';
  public router = Router();
  private sportService = new SportService();
  private sportRepository = new SportRepository();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllSportDisciplines);
    this.router.delete(
      this.path.concat('/:id'),
      authTokenValidationMiddleware,
      this.deleteSportDiscipline
    );
    this.router.post(
      this.path,
      authTokenValidationMiddleware,
      dtoValidation(CreateSportDisciplineRequest),
      this.createSportDiscipline
    );
    this.router.put(
      this.path.concat('/:id'),
      authTokenValidationMiddleware,
      dtoValidation(CreateSportDisciplineRequest),
      this.updateSportDiscipline
    );
  }

  createSportDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const createdSportDiscipline = await this.sportService.saveSportDiscipline(request.body);

    if (createdSportDiscipline) {
      response.send(createdSportDiscipline);
    } else {
      next(new SportDisciplineAlreadyExistsException());
    }
  };

  deleteSportDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const deletedDiscipline = await this.sportService.deleteSportDisciplineById(request.params.id);

    if (deletedDiscipline) {
      response.sendStatus(HttpStatusCode.OK);
    } else {
      next(new SportDisciplineNotFoundException());
    }
  };

  updateSportDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const updatedDiscipline = await this.sportService.updateSportDisciplineById(
      request.params.id,
      request.body
    );

    if (updatedDiscipline) {
      response.send(updatedDiscipline);
    } else {
      next(new SportDisciplineNotFoundException());
    }
  };

  getAllSportDisciplines = async (request: Request, response: Response) => {
    const sportDisciplines: SportDiscipline[] = await this.sportRepository.findAll();
    response.send(sportDisciplines);
  };
}

export default SportController;
