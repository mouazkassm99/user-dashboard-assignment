export class User {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;

    constructor(id: number, first_name: string, last_name: string, avatar: string, email: string) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar = avatar;
        this.email = email;
    }
}
