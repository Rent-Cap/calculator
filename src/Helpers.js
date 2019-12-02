import moment from "moment"

export function handleInput(key, event) {
  const obj = {}
  obj[key] = event.target.value
  this.setState(obj)
}

export function calculateMaxRent(pastRent = 0, cpi = 0.033) {
  const plusTenPercent = pastRent * 1.1
  const cpiCalc = pastRent * (1 + 0.05 + parseFloat(cpi))
  const min = Math.min(plusTenPercent, cpiCalc)
  return parseFloat(min).toFixed(2)
}

// Used to determine the rent on march 15 2019 from range data
export function determineRentOnDateFromRentRanges(targetDate, rentRanges = []) {
  if (!targetDate) throw new Error('No target date given.')
  let rent
  for(let i = 0; i < rentRanges.length; i++) {
    const daysBefore = targetDate.diff(rentRanges[i].startDate, 'days', true)
    const daysAfter = rentRanges[i].endDate.diff(targetDate, 'days', true)
    if (daysBefore >= 0 && daysAfter >= 0) rent = rentRanges[i].rent
  }
  return rent
}

export function determineMaxRentFromRentRanges(targetDate, rentRanges = [], cpi = 0.033) {
  const rentOnTargetDate = determineRentOnDateFromRentRanges(targetDate, rentRanges)
  return calculateMaxRent(rentOnTargetDate, cpi)
}

export function calculateTotalAmountOwedToTenant(rentRanges = [], cpi = 0.033) {
  // NOTE: rentRanges must be sorted past --> present
  // WARNING: Only accurate before mar 15 2020!
  let result = 0
  if (rentRanges.length < 1) return result
  const mar152019 = moment([2019, 2, 15])
  const pastRent = determineRentOnDateFromRentRanges(mar152019, rentRanges)

  for (let i = 0; i < rentRanges.length; i++) {
    const rent = rentRanges[i].rent
    const start = rentRanges[i].startDate
    const end = rentRanges[i].endDate
    
    const maxRent = calculateMaxRent(pastRent, cpi)
    const janFirst2020 = moment([2020, 0, 1])
    const diff = rentRanges[i].endDate.diff(janFirst2020, 'months', true)
    const isAfterJan2020 = diff > 0 ? true : false
    const monthsPaidAfterJan2020 = isAfterJan2020 ? end.diff(start, 'months', true) : 0

    result += (rent > maxRent) ? (rent - maxRent) * monthsPaidAfterJan2020 : 0
  }
  return result > 0 ? parseFloat(result).toFixed(2) : 0
}

export const checkFlags = (str, flags) => {
  if (!str) return false
  const logicalOperators = {
    'and': '&&',
    'or': '||',
    'not': '!'
  }
  const mapping = Object.assign(logicalOperators, flags)
  let i = 0
  // lazy way of forcing an eval at the end without checking for end of string
  str += ' '
  let result = ''
  let term = ''
  while (i < str.length) {
    const token = str[i]
    if (token !== ' ' && token !== '(' && token !== ')') {
      term += token
    } else {
      let op = mapping[term]
      if (op === 'yes') op = true
      if (op === 'no') op = false
      if (op === 'unknown') {
        console.log('Unknown flag, breaking out of function')
        return false
      }
      if (typeof op !== 'undefined') result += op
      result += token
      term = ''
    }
    i++
  }
  console.log('result', result)
  return eval(result)

}
