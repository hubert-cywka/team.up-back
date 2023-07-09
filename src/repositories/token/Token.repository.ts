import { Model } from 'mongoose';
import { AuthToken } from 'types/token/AuthToken.interface';
import { RefreshTokenModel } from './model/RefreshToken.model';

class TokenRepository {
  private refreshTokenModel: Model<AuthToken> = RefreshTokenModel;

  public exists = (refreshToken: string) => {
    return this.refreshTokenModel.exists({token: refreshToken});
  }

  public save = (refreshToken: AuthToken) => {
    return this.refreshTokenModel.create(refreshToken);
  };

  public deleteByToken = (refreshToken: string) => {
    return this.refreshTokenModel.findOneAndDelete({token: refreshToken});
  };
}

export default TokenRepository;
