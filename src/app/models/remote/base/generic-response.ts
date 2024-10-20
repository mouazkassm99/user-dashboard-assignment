export class GenericResponse<T> {
    data: T;

    constructor(data: T) {
        this.data = data;
    }
}
