/**
 * Helper Function
 * 
 * Take precise part from float number.
 * 
 * @param {number} number - float number
 * @returns {number} precise part
 */
function getDecimal(number) {
	return (number - Math.floor(number))
}

class ExtendDate extends Date {

  constructor () {
    super()

    // assign static property to class (`static` keyword not supported by Safari)
    Object.defineProperty(ExtendDate, 'MONTHS_OF_YEAR', {
      value: 12,
      enumerable: true
    })
  }

  get now () {
    return new Date()
  }

  static isLeapYear(year) {
    return !(year % 400) || (!(year % 4) && (year % 100))
  }

  static getDaysInYear(year) {
    return isLeapYear(year)
      ? 366
      : 365
  }

  static toMilliseconds(unit) {
    const SECONDS = 1000
    const MINUTES = SECONDS * 60
    const HOURS = MINUTES * 60
    const DAYS = HOURS * 24
    
    const UNIT = {
      seconds: SECONDS,
      minutes: MINUTES,
      hours: HOURS,
      days: DAYS
    }

    return UNIT[unit] || 0
  }

  static clone(copiedDate = new Date()) {
    const cloneDate = new Date(copiedDate.getTime())
    return cloneDate
  }

  static getDaysInMonth(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const lastDayOfMonth = new Date(year, month + 1, 0)
    return lastDayOfMonth.getDate()
  }

  getDifferenceInTime(toDate) {
    return toDate - this.now
  }

  getYearsTo(toDate) {
    let yearDiff = toDate.getFullYear() - this.now.getFullYear()

    if (toDate.getMonth() < this.now.getMonth()) {
      yearDiff -= 1
    } else if (toDate.getDate() < this.now.getDate()) {
      yearDiff -= 1
    }

    return yearDiff
  }

  getMonthsTo(toDate) {
    const yearDiff = toDate.getFullYear() - this.now.getFullYear()
    let monthDiff = toDate.getMonth() + yearDiff * ExtendDate.MONTHS_OF_YEAR - this.now.getMonth()

    if (toDate.getDate() <= this.now.getDate()) {
      monthDiff -= 1
    }

    this.setNumberOfEachMonths(monthDiff)

    return monthDiff
  }

  getDaysTotalInBetween(toDate) {
    const differenceMillSecs = this.getDifferenceInTime(toDate)
    const difference = differenceMillSecs / ExtendDate.toMilliseconds('days')

    return difference
  }

  setNumberOfEachMonths(monthDiff) {
    this.eachNumberOfMonths = Array.from({length: monthDiff})
      .map((_, index) => {
        const currentDate = ExtendDate.clone()
        currentDate.setMonth(this.now.getMonth() + index)
        return ExtendDate.getDaysInMonth(currentDate)
      })
  }
}

class Countdown {

  /**
   * 
   * @param {Object} config          - The `Countdown` class config
   * @param {string} config.template - The `date` and `time` box
   * @param {Date} config.endDate    - The end date of `Countdown`
   */
  constructor({template, endDate}) {
    this.template = template
    this.endDate = endDate
    this.dateUtils = new ExtendDate()

    // assign static property to class (`static` keyword not supported by Safari)
    Object.defineProperty(Countdown, 'INTERVAL_SECONDS', {
      value: 1000,
      enumerable: true
    })
  }

  start() {
    this.boxes = document.querySelectorAll(this.template)
    this.render()
    this.timer = setInterval(() => this.render(), Countdown.INTERVAL_SECONDS)
  }

  stop() {
    clearInterval(this.timer)
  }

  render() {
    this.startDate = new Date()
    const countdownDistance = this.calcCountdown()

    const updateTimer = (box) => {
      const unit = box.dataset.unit
      const timer = box.querySelector(`[data-${unit}]`)
      const distance = countdownDistance[unit]
      timer.textContent = distance
    }

    this.boxes.forEach(updateTimer)
  }

  calcCountdown () {
    const { years, months, days } = this.getDateDiff()
    const remaining = getDecimal(this.dateUtils.getDaysTotalInBetween(this.endDate)) * ExtendDate.toMilliseconds('days')
    const { minutes, hours, seconds } = this.getTimeDiff(remaining)

    return {
      years,
      months,
      days,
      minutes,
      hours,
      seconds
    }
  }

  getDateDiff () {
    const years  = this.dateUtils.getYearsTo(this.endDate)
    const months = this.dateUtils.getMonthsTo(this.endDate) - years * ExtendDate.MONTHS_OF_YEAR
    const totalDays = Math.floor(this.dateUtils.getDaysTotalInBetween(this.endDate))
    const days = this.dateUtils.eachNumberOfMonths.reduce((remaining, number) => remaining - number, totalDays)
    return {
      years,
      months,
      days
    }
  }

  /**
   * Calculate remaining milliseconds to correspond `hours, minutes, seconds`
   * @param {number=} remainingDiff - if provided, means some milliseconds be taken from `years` or `months` or `days` or both; 
   *  otherwise countdown have format `hours, minutes, seconds` that take whole remaining milliseconds.
   * @returns {Object} correspond remaining timer
   */
  getTimeDiff (remainingDiff) {
    let difference = remainingDiff ? remainingDiff : this.endDate - this.startDate
    
    const daysDiff = () => {
      return Math.floor(difference / ExtendDate.toMilliseconds('days'))
    }

    const hoursDiff = () => {
      return Math.floor(difference % ExtendDate.toMilliseconds('days') / ExtendDate.toMilliseconds('hours'))
    }

    const minutesDiff = () => {
      return Math.floor(difference % ExtendDate.toMilliseconds('hours') / ExtendDate.toMilliseconds('minutes'))
    }

    const secondsDiff = () => {
      return Math.floor(difference % ExtendDate.toMilliseconds('minutes') / ExtendDate.toMilliseconds('seconds'))
    }

    return {
      days: daysDiff(),
      hours: hoursDiff(),
      minutes: minutesDiff(),
      seconds: secondsDiff()
    }
  }
}