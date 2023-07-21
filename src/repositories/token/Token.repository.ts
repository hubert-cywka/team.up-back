import { Model } from 'mongoose';
import { RefreshTokenModel } from './model/RefreshToken.model';
import { AuthToken } from '../../shared/types/Token';

class TokenRepository {
  private refreshTokenModel: Model<AuthToken> = RefreshTokenModel;

  public exists = (refreshToken: string) => {
    return this.refreshTokenModel.exists({ token: refreshToken });
  };

  public save = (refreshToken: AuthToken) => {
    return this.refreshTokenModel.create(refreshToken);
  };

  public deleteByToken = (refreshToken: string) => {
    return this.refreshTokenModel.findOneAndDelete({ token: refreshToken });
  };
}

export default TokenRepository;
