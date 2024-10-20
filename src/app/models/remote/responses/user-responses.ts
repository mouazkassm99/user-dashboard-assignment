import { GenericResponse } from "../base/generic-response";
import { PaginationResponse } from "../base/pagination-response";
import { User } from "../entities/user";

export class UserPaginationResponse extends PaginationResponse<User> {

}
export class UserDetailsResponse extends GenericResponse<User> {

}