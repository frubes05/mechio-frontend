export interface IPaginate {
    getPageNumbers: number[],
    paginate: (elem: number) => void
}