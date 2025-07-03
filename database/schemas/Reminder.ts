import { User } from "./User"

export type Reminder = {
    remId?: number,
    remTitle: string,
    remDescription: string,
    remDate: Date,
    remCreatedAt?: Date,
    remRecurrence: string,
    user?: User
}