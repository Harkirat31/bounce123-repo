export const convertToUTC = (date: Date) => {
    let newDate = new Date(date)
    newDate.setUTCDate(date.getDate())
    newDate.setUTCFullYear(date.getFullYear())
    newDate.setUTCMonth(date.getMonth())
    newDate.setUTCHours(0, 0, 0, 0)
    return newDate
}