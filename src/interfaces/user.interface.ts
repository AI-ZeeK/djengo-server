export interface IUser {
  user_id: string;
}
export interface IBusiness {
  organization_id: string;
}
export interface UserAuthorizedRequest extends Request {
  user: IUser;
}

export interface OrganizationRequest extends Request {
  user: IUser & IBusiness;
}
