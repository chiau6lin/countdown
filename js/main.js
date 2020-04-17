(function () {

  const { month, date } = askBirthday()

  let birthdayDate
  const now = new Date()

  if (now.getMonth() + 1 > month || now.getDate() > date) {
    birthdayDate = new Date(now.getFullYear() + 1, month - 1, +date)
  } else {
    birthdayDate = new Date(now.getFullYear(), month - 1, +date)
  }

  setCountdownTarget(birthdayDate)

  const countdownConfig = {
    template: '.timer__box',
    endDate: birthdayDate
  }

  const countdown = new Countdown(countdownConfig)
  
  countdown.start()

  function askBirthday () {
    const month = prompt('Month of Your Birthday : ', 1)
    const date = prompt('Date of Your Birthday : ', 1)

    return {
      month,
      date
    }
  }

  function setCountdownTarget(date) {
    const target = document.querySelector('.countdown__target')

    const datetime = date.toLocaleString('en-GB', { year: 'numeric' }) +
      '-' + date.toLocaleString('en-GB', { month: '2-digit' }) +
      '-' + date.toLocaleString('en-GB', { day: '2-digit' })
    
      target.setAttribute('datetime', datetime)
  }

})(window)