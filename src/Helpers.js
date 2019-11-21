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

export function calculateTotalAmountOwedToTenant(rentRanges = [], cpi = 0.033) {
  // NOTE: rentRanges must be sorted past --> present
  let result = 0
  if (rentRanges.length < 1) return result
  let pastRent
  let maxRent

  for(let i = 0; i < rentRanges.length; i++) {
    const rent = rentRanges[i].rent
    const daysBeforeMar152019 = moment([2019, 2, 15]).diff(rentRanges[i].startDate, 'days', true)

    // skip rentRanges until we come across one >= mar 15 2019
    if (!pastRent && daysBeforeMar152019 >= -1) {
      pastRent = rent
      maxRent = calculateMaxRent(pastRent, cpi)
    } else if (pastRent) {
      const monthsPaidAfterJan2020 = rentRanges[i].totalMonthsPaidAfterJan2020
      result += (rent > maxRent) ? (rent - maxRent) * monthsPaidAfterJan2020 : 0
    }
  }

  return parseFloat(result).toFixed(2)
}