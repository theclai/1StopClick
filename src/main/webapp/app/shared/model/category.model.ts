export interface ICategory {
    id?: string;
    categoryName?: string;
}

export class Category implements ICategory {
    constructor(public id?: string, public categoryName?: string) {}
}
