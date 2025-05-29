//* This is the current day down to the millisecond (Only used to make other variables)
const currentDate = new Date();

//* This is the current date down to the second (This will be displayed)
const rightNow = currentDate.toLocaleString();
const DotW = currentDate.getDay();


//* These two variables contain the numeric value of the Month and Day, this will be used to perform the Checks
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

//* These two variables contain the numeric values that point to July 24, the specific event date.
const birthDate = new Date(2005, 6, 24);
const birthMonth = birthDate.getMonth();
const birthDay = birthDate.getDate;
console.log(birthDate);


/* These are the variables that will be used to manipulate the DOM, targeting each of the created divs in the */

const mainDivEl = document.getElementById('main-div');
const currentDateEl = document.getElementById('currentDate');
const countDownEl = document.getElementById('countDown');


switch(DotW){
    case 0:
        currentDateEl.textContent = `Hello! today is Sunday, ${rightNow}`;
        break;
    case 1:
        currentDateEl.textContent = `Hello! today is Monday, ${rightNow}`;
        break;
    case 2:
        currentDateEl.textContent = `Hello! today is Tuesday, ${rightNow}`;
        break;
    case 3:
        currentDateEl.textContent = `Hello! today is Wednesday, ${rightNow}`;
        break;
    case 4:
        currentDateEl.textContent = `Hello! today is Thursday, ${rightNow}`; 
        break;
    case 5:
        currentDateEl.textContent = `Hello! today is Friday, ${rightNow}`;
        break;
    case 6:
        currentDateEl.textContent = `Hello! today is Saturday, ${rightNow}`;
        break;
};


/* This is a function that will take the currentDate variable as an argument and use it to determine how many years have passed since  */
function calcYears(date){
    let date1 = new Date(date);
    let age = currentDate.getFullYear() - date1.getFullYear();
    const month = currentDate.getMonth() - date1.getMonth();

    if(month < 0 || (month === 0 && currentDate.getDate() < date1.getDate())){
        age--;
        }
    return age;
};

//* This function will calculate the amount of time remaining until the value of birthVar
function timeUntilBirthDate(targetDate, presentDate) {
  // Extract month and day from targetDate
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();
  
  // Extract month, day, and year from presentDate
  const presentMonth = presentDate.getMonth();
  const presentDay = presentDate.getDate();
  const presentYear = presentDate.getFullYear();
  
  // Create target date for current year
  let thisYearsTarget = new Date(presentYear, targetMonth, targetDay);
  
  // If the target date has already passed this year, use next year's target
  if (thisYearsTarget <= presentDate) {
    thisYearsTarget = new Date(presentYear + 1, targetMonth, targetDay);
  }
  
  // Calculate the difference in milliseconds
  const timeDiff = thisYearsTarget - presentDate;
  
  // Convert milliseconds to various time units
  const totalSeconds = Math.floor(timeDiff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Calculate months (approximate)
  const totalMonths = Math.floor(totalDays / 30.44); // Average days per month
  
  // Calculate remaining time units
  const months = totalMonths;
  const weeks = Math.floor((totalDays % (totalMonths * 30.44)) / 7);
  const days = totalDays % 7;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  return {
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    breakdown: {
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds
    },
    targetYear: thisYearsTarget.getFullYear()
  };
}

const resultR = timeUntilBirthDate(birthDate, currentDate);
countDownEl.textContent = `${resultR.breakdown.months} Months, ${resultR.breakdown.weeks} Weeks, ${resultR.breakdown.days} Days, ${resultR.breakdown.hours} Hours, ${resultR.breakdown.minutes} Minutes, ${resultR.breakdown.seconds} Seconds  Until your next birthday!`


//* This variable holds the calculated age in years.
let ageInYears = calcYears(birthDate);



//* This if statement will be used to perform birthdate logic
if(currentMonth == birthMonth && currentDay == birthDay){
    currentDateEl.textContent = `Happy Birthday!!! You're ${ageInYears} years old! How exciting!`
};

console.log(rightNow);
console.log(DotW)

