import { Budget } from "./Budget"
import { Category } from "./Category"
import { User } from "./User"

export type Transaction = {
    transId?: number,
    type: string, 
    amount : number, 
    description : string, 
    transDate: Date,
    transCreatedAt?: string,
    transRecurrence: string,
    bdgtId: number,
    categId: number,
    category?: Category,
    budget?: Budget,
    user?: User
}