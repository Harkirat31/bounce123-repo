/*
convert date to UTC at midnight 
for example date 1/1/2023 time 20:00 hours is utc 2/1/2023 1 am
so by converting dirct setUTChours(0,0,0,0) just convrt to 2/1/2023 midnight
so it get day of the date from normal date and add to setUTCDate() , so that date is same as normal date of client side 
*/
export const convertToUTC = (date: Date) => {
    let newDate = new Date(date)
    newDate.setUTCDate(date.getDate())
    newDate.setUTCFullYear(date.getFullYear())
    newDate.setUTCMonth(date.getMonth())
    newDate.setUTCHours(0, 0, 0, 0)
    return newDate
}