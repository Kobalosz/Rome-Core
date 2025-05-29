import { useState, useEffect } from 'react';

export default function BirthdayCountdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState('');
  const [dateMessage, setDateMessage] = useState('');

  // Birth date configuration
  const birthDate = new Date(2005, 6, 24); // July 24, 2005

  // Function to calculate age in years
  const calcYears = (date) => {
    let date1 = new Date(date);
    let age = currentTime.getFullYear() - date1.getFullYear();
    const month = currentTime.getMonth() - date1.getMonth();

    if (month < 0 || (month === 0 && currentTime.getDate() < date1.getDate())) {
      age--;
    }
    return age;
  };

  // Function to calculate time until birthday
  const timeUntilBirthDate = (targetDate, presentDate) => {
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    const presentYear = presentDate.getFullYear();
    
    let thisYearsTarget = new Date(presentYear, targetMonth, targetDay);
    
    if (thisYearsTarget <= presentDate) {
      thisYearsTarget = new Date(presentYear + 1, targetMonth, targetDay);
    }
    
    const timeDiff = thisYearsTarget - presentDate;
    
    const totalSeconds = Math.floor(timeDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    
    const totalMonths = Math.floor(totalDays / 30.44);
    
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
  };

  // Get day of week name
  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  // Get month of the year name
  const getMonthName = (monthNum) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum];
  };


  // Update time and calculations
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      const rightNow = now.toLocaleString();
      const dayOfWeek = now.getDay();
      const dayName = getDayName(dayOfWeek);

      const currentMonth = now.getMonth();
      const monthName = getMonthName(currentMonth);
      const currentDay = now.getDate();
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      // Check if it's birthday
      if (currentMonth === birthMonth && currentDay === birthDay) {
        const age = calcYears(birthDate);
        setDateMessage(`Happy Birthday!!! You're ${age} years old! How exciting!`);
        setCountdown('🎉 It\'s your birthday! 🎉');
      } else {
        setDateMessage(`Hello! today is ${dayName}, ${monthName}, ${currentDay}. ${rightNow}`);
        
        const result = timeUntilBirthDate(birthDate, now);
        setCountdown(
          `${result.breakdown.months} Months, ${result.breakdown.weeks} Weeks, ${result.breakdown.days} Days, ${result.breakdown.hours} Hours, ${result.breakdown.minutes} Minutes, ${result.breakdown.seconds} Seconds Until your next birthday!`
        );
      }
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg">
      <div className="text-center space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm" id='dateContainer'>
          <h1 className="text-lg font-semibold text-gray-800 mb-2" id='dateTitle'>Current Date & Time</h1>
          <p className="text-gray-600">{dateMessage}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm" id='countDownContainer'>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Birthday Countdown</h2>
          <p className="text-purple-600 font-medium">{countdown}</p>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
}