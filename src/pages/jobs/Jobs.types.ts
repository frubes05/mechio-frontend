export interface IJobs {
    _id: string,
    companyId?: string,
    company: string,
    companyImage: string,
    position: string,
    skillsList: string,
    requirementsList: string,
    benefitsList: string,
    description: string,
    location: string,
    seniority: string,
    pay: string,
    date: Date
}

export interface IJobsList {
    jobs: IJobs[]
}

export interface IJob {
    job: IJobs
}