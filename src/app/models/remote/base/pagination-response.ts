import { GenericResponse } from "./generic-response";

export class PaginationResponse<T> extends GenericResponse<T[]> {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;

    constructor(page: number, per_page: number, total: number, total_pages: number, data: T[]) {
        super(data);
        this.page = page;
        this.per_page = per_page;
        this.total = total;
        this.total_pages = total_pages;
    }
}