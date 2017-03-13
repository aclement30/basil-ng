export class Tag {
    _id?: string;
    name: string;
    alias: string;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }
}
