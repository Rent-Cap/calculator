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
    
    if (!pastRent && daysBeforeMar152019 >= -1) {
      // pastRent: the user's rent on march 15 2019
      pastRent = rent
      maxRent = calculateMaxRent(pastRent, cpi)
    } else if (pastRent) {
      const janFirst2020 = moment([2020, 0, 1])
      const diff = rentRanges[i].endDate.diff(janFirst2020, 'months', true)
      const monthsPaidAfterJan2020 = diff > 0 ? diff : 0
      result += (rent > maxRent) ? (rent - maxRent) * monthsPaidAfterJan2020 : 0
    }
  }

  return result > 0 ? parseFloat(result).toFixed(2) : 0
}

export const checkFlags = (arr, flags) => {
  let result = ''
  const mapping = {
    'and': ' && ',
    'or': ' || ',
    'not': '!'
  }
  for(let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'object') {
      for(let j = 0; j < arr[i].length; j++) {
        const flagVal = flags[arr[i][j]]
        const mappingVal = mapping[arr[i][j]]
        if (typeof flagVal !== 'undefined') {
          let term
          if (flagVal === 'yes') {
            term = true
          } else if (flagVal === 'no') {
            term = false
          }
          if (typeof term !== 'undefined') result += term
        } else if (typeof mappingVal !== 'undefined') {
          result += mappingVal
        } else {
          throw new Error('Unknown flag or mapping')
        }
      }
    } else {
      result += mapping[arr[i]]
    }
  }
  return eval(result)
}