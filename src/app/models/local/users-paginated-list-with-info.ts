import { User } from "../remote/entities/user";

export class UsersPaginatedListWithInfo {

    users: User[];
    totalPages: number;

    constructor(users: User[], totalPages: number) {
        this.users = users;
        this.totalPages = totalPages;
    }

}