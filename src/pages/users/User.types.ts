export interface IUserToken {
    _id: String,
    email: String,
    user?: Boolean
}

export interface IFormSwitch {
    changeShowingForm: () => void,
    handleToastError?: (err: string) => void,
    handleToastSuccess?: (succ: string) => void
}