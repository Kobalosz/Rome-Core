import React, { useState, useEffect } from 'react';

const BirthdayCountdown = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState('');
  const [dateMessage, setDateMessage] = useState('');
  const [timeUnits, setTimeUnits] = useState({});
  const [isBirthday, setIsBirthday] = useState(false);
  
  // Quote/Poem states
  const [currentContent, setCurrentContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    
    const presentMonth = presentDate.getMonth();
    const presentDay = presentDate.getDate();
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
    
    const totalMonths = Math.floor(totalDays / 30.44);
    
    const months = totalMonths;
    const weeks = Math.floor((totalDays % (totalMonths * 30.44)) / 7);
    const days = totalDays % 7;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    return {
      totalMonths,
      totalDays,
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

  // Generate content with Gemini API
  const generateWithGemini = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const contentType = Math.random() > 0.5 ? 'quote' : 'poem';
      const GEMINI_API_KEY = 'AIzaSyDtTnrCgTwmKvrUFhDo8H6gXHsBh4kE1Vg';
      
      const prompt = contentType === 'quote'
        ? "Provide a random inspirational quote about life, success, womanhood, or personal growth. Provide both the quote and attribute it to the wise person. Respond in JSON format with 'text' and 'author' fields."
        : "Provide a random short inspirational poem (4-8 lines) about hope, dreams, or overcoming challenges. Provide the poem and attribute it to a the poet. Respond in JSON format with 'text' and 'author' fields.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let generatedText = data.candidates[0].content.parts[0].text;
      
      let content;
      try {
        generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (parseError) {
        content = getFallbackContent();
      }
      
      setCurrentContent({
        type: contentType,
        text: content.text || 'Every day is a new opportunity to grow.',
        author: content.author || (contentType === 'poem' ? 'AI Poet' : 'Digital Sage')
      });

    } catch (err) {
      setError(`Failed to generate content: ${err.message}`);
      const fallbackContent = getFallbackContent();
      setCurrentContent(fallbackContent);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback content if API fails
  const getFallbackContent = () => {
    const fallbacks = [
      {
        type: 'quote',
        text: "Every moment is a fresh beginning.",
        author: "T.S. Eliot"
      },
      {
        type: 'poem',
        text: "Stars can't shine without darkness,\nFlowers can't bloom without rain,\nAnd you can't grow without challenges\nThat help you break every chain.",
        author: "Anonymous"
      },
      {
        type: 'quote',
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
      }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Get day of week name
  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  // Update time and calculations
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      const dayOfWeek = now.getDay();
      const dayName = getDayName(dayOfWeek);
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      // Check if it's birthday
      if (currentMonth === birthMonth && currentDay === birthDay) {
        const age = calcYears(birthDate);
        setDateMessage(`Happy Birthday!!! You're ${age} years old! 🎉`);
        setCountdown('🎉 It\'s your birthday! 🎉');
        setIsBirthday(true);
        setTimeUnits({});
      } else {
        setDateMessage(`${dateString} • ${timeString}`);
        setIsBirthday(false);
        
        const result = timeUntilBirthDate(birthDate, now);
        setTimeUnits(result.breakdown);
        setCountdown(
          `${result.breakdown.months} Months, ${result.breakdown.weeks} Weeks, ${result.breakdown.days} Days until Romalyn's next birthday!`
        );
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  const CountdownCard = ({ value, label, color }) => (
    <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/30 transform transition-all duration-300 hover:scale-105 hover:bg-white/30`}>
      <div className={`text-3xl md:text-4xl font-bold ${color} mb-2 font-mono`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
            Welcome to 
            <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent"> Roma Core </span>
            🧸❤️
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium">
            {dateMessage}
          </p>
        </div>

        {/* Birthday Countdown Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {isBirthday ? (
            <div className="text-center space-y-6">
              <div className="text-6xl md:text-8xl animate-bounce">🎉</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Happy Birthday!
              </h2>
              <div className="flex justify-center space-x-4 text-4xl animate-pulse">
                <span>🎂</span>
                <span>🎈</span>
                <span>🎁</span>
                <span>✨</span>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                Countdown to Romalyn's Birthday
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <CountdownCard value={timeUnits.months || 0} label="Months" color="text-pink-600" />
                <CountdownCard value={timeUnits.weeks || 0} label="Weeks" color="text-purple-600" />
                <CountdownCard value={timeUnits.days || 0} label="Days" color="text-blue-600" />
                <CountdownCard value={timeUnits.hours || 0} label="Hours" color="text-green-600" />
                <CountdownCard value={timeUnits.minutes || 0} label="Minutes" color="text-yellow-600" />
                <CountdownCard value={timeUnits.seconds || 0} label="Seconds" color="text-red-600" />
              </div>
            </div>
          )}
        </div>

        {/* AI Inspiration Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-3xl animate-spin">✨</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Daily Inspiration</h2>
              <div className="text-3xl animate-spin">🤖</div>
            </div>
            
            <button
              onClick={generateWithGemini}
              disabled={isLoading}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating inspiration...</span>
                  </div>
                ) : (
                  'Click for a dose of some Roma core ✨'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-red-100 rounded-2xl">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {currentContent && (
              <div className={`mt-8 p-8 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 transition-all duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'} hover:bg-white/30`}>
                
                <div className="flex items-center justify-center mb-6">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full border-2 ${
                    currentContent.type === 'poem' 
                      ? 'bg-purple-500/20 text-purple-100 border-purple-300/30' 
                      : 'bg-blue-500/20 text-blue-100 border-blue-300/30'
                  }`}>
                    {currentContent.type === 'poem' ? '📜 Poem' : '💭 Quote'}
                  </span>
                </div>

                <blockquote className={`text-xl md:text-2xl leading-relaxed mb-6 text-white text-center ${
                  currentContent.type === 'poem' ? 'italic font-medium whitespace-pre-line' : 'font-light'
                }`}>
                  "{currentContent.text}"
                </blockquote>
                
                <footer className="text-center">
                  <cite className="text-white/80 font-medium text-lg">
                    — {currentContent.author}
                  </cite>
                </footer>
              </div>
            )}

            {!currentContent && !isLoading && (
              <div className="mt-8 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/30">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-white/70 text-lg">
                  Click the button above to generate some Romalyn-coded inspirational quotes and poems! ✨🤖
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 pb-8">
          <p className="text-sm">Made with ❤️ for Romalyn • Developed by Imanuel Dartey ✨</p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCountdown;