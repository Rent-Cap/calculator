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
  let result = 0
  // TODO: ignore ranges before 1-1-2020
  if (rentRanges.length < 1) return result
  const pastRent = rentRanges[0].rent
  const maxRent = calculateMaxRent(pastRent, cpi)
  for(let i = 0; i < rentRanges.length; i++) {
    const rent = rentRanges[i].rent
    const monthsPaid = rentRanges[i].totalMonthsPaid
    result += (rent > maxRent) ? (rent - maxRent) * monthsPaid : 0
  }
  return parseFloat(result).toFixed(2)
}