export interface ICompany {
    _id: string;
    companyName: string | number | readonly string[] | undefined | any,
    companyEmail: any,
    companyPassword: String,
    companyNumber: any,
    companyAddress: any,
    companyFeedbacks?: null | [],
    companyImage: string;
    companyDescription: string;
}

export interface ICompanyToken {
    _id: string;
    companyName: string | number | readonly string[] | undefined,
    companyEmail: String,
    company?: Boolean
}

export interface IFormSwitch {
    changeShowingForm: () => void,
    handleToastError?: (err: string) => void,
    handleToastSuccess?: (succ: string) => void,
    nextStep?: () => void
}