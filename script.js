//* This is the current day down to the millisecond (Only used to make other variables)
const currentDate = new Date()

//* This is the current date down to the second (This will be displayed)
const rightNow = currentDate.toLocaleString()

//* These two variables contain the numeric value of the Month and Day, this will be used to perform the Checks
const currentMonth = currentDate.getMonth()
const currentDay = currentDate.getDate()

//* These two variables contain the numeric values that point to July 24, the specific event date.
const birthMonth = 6;
const birthDay = 24;


//* This if statement will be used to perform birthdate logic
if(currentMonth == birthMonth && currentDay == birthDay){

}

console.log(rightNow);


