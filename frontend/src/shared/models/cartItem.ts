import { Jewellery } from "./jewellery";

export class cartItem {
    

    constructor(public jewellery: Jewellery) {}
    quantity: number = 1;
    get price(): number {
        return this.jewellery.price;
    }
}