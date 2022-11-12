export interface IFeedback {
    _id: string;
    companyId: string,
    companyImage: string,
    companyName?: string,
    date: Date,
    category: string,
    negatives: string,
    positives: string,
    rating: string,
    position: string,
    userId: String
}