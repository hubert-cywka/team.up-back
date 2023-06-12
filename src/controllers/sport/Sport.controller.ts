import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../../types/controllers/Controller.interface';
import authTokenValidationMiddleware from '../../middleware/authentication/AuthTokenValidation.middleware';
import dtoValidation from '../../middleware/error-handling/DtoValidation.middleware';
import CreateSportDisciplineRequest from './dto/CreateDisciplineRequest.dto';
import { HttpStatusCode } from '../../helpers/HttpStatusCode';
import SportDisciplineNotFoundResponse from './dto/SportDisciplineNotFoundResponse';
import SportService from '../../services/sport/Sport.service';
import SportDisciplineAlreadyExistsResponse from './dto/SportDisciplineAlreadyExistsResponse';
import SportRepository from '../../repositories/sport/Sport.repository';
import authorizationValidation from '../../middleware/authorization/AuthorizationValidation.middleware';
import { UserRole } from '../../types/users/UserRole';

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
    this.router.post(
      this.path,
      authTokenValidationMiddleware,
      authorizationValidation([UserRole.ADMIN]),
      dtoValidation(CreateSportDisciplineRequest),
      this.createSportDiscipline
    );
    this.router
      .all(
        this.path.concat('/:id'),
        authTokenValidationMiddleware,
        authorizationValidation([UserRole.ADMIN])
      )
      .put(
        this.path.concat('/:id'),
        dtoValidation(CreateSportDisciplineRequest),
        this.updateSportDiscipline
      )
      .delete(this.path.concat('/:id'), this.deleteSportDiscipline);
  }

  createSportDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const createdSportDiscipline = await this.sportService.saveSportDiscipline(request.body);

    if (createdSportDiscipline) {
      response.send(createdSportDiscipline);
    } else {
      next(new SportDisciplineAlreadyExistsResponse());
    }
  };

  deleteSportDiscipline = async (request: Request, response: Response, next: NextFunction) => {
    const deletedDiscipline = await this.sportService.deleteSportDisciplineById(request.params.id);

    if (deletedDiscipline) {
      response.sendStatus(HttpStatusCode.OK);
    } else {
      next(new SportDisciplineNotFoundResponse());
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
      next(new SportDisciplineNotFoundResponse());
    }
  };

  getAllSportDisciplines = async (request: Request, response: Response, next: NextFunction) => {
    response.send(await this.sportRepository.findAll());
  };
}

export default SportController;
