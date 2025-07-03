import { User } from "./User"

export type Budget = {
    bdgtId?: number,
    bdgtName: string,
    bdgtAmount: number,
    bdgtCapacity: number,
    startDate: Date,
    endDate: Date,
    user?: User
}