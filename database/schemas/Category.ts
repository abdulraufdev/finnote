import { User } from "./User"

export type Category = {
    categId?: number,
    categName: string,
    categColor: string,
    categIcon: string,
    user?: User
}