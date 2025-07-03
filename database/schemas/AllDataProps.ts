export type AllDataProps = {
    id: number,
    name: string,
    //transaction
    transId?: number,
    type: string, 
    amount : number, 
    description : string, 
    transDate: string,
    transCreatedAt?: string,
    transRecurrence: string,
    //budget
    bdgtId: number,
    bdgtName: string,
    bdgtAmount: number,
    bdgtCapacity: number,
    startDate: Date,
    endDate: Date,
    //categ
    categId: number,
    categName: string,
    categColor: string,
    categIcon: string,
}