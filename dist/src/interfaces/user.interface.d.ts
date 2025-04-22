export interface IUser {
    user_id: string;
}
export interface IBusiness {
    business_id: string;
}
export interface UserAuthorizedRequest extends Request {
    user: IUser;
}
