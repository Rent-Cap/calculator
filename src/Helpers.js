export function handleInput(key, event) {
  const obj = {}
  obj[key] = event.target.value
  this.setState(obj)
}

function calculateRentOverpay(rent = 1, cpi = 1) {
  return cpi * rent
}

// rentSnapshots = [[date1, amount1], [date2, amount2], ...]
// date should be in unix time e.g. 1577865600000 == Jan 1, 2020 (milliseconds)
// Snapshots must be sorted by date (past --> present)
// currentDate defaults to now.
export function calculateTotalAmountOwedToTenant(rentSnapshots = [], cpi = 1, currentDate = new Date()) {
  let result = 0
  // go through snapshots until we reach a date >= jan 1, 2020 and set that as the initial value
  const start = new Date('1-1-2020')
  for(let i = 0; i < rentSnapshots.length; i++) {
    const date = rentSnapshots[i][0]
    if (date < start) continue
    const rent = rentSnapshots[i][1]
    const nextDate = i < rentSnapshots.length - 1 ? rentSnapshots[i+1][0] : currentDate
    // const monthDiff = ...
    // do overPay * monthDiff and add to result
    result += calculateRentOverpay(rent, cpi)
  }
  return result
}