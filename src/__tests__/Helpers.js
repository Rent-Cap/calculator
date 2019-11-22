import { calculateTotalAmountOwedToTenant, checkFlags } from '../Helpers'
import moment from 'moment'

describe('calculateAmountOwedToTenant', () => {
  it('returns the correct result on before march 15 2020', () => {
    const rent1 = {rent: 1000, startDate: moment([2019, 2, 15]), endDate: moment([2019, 11, 31])}
    const rent2 = {rent: 1100, startDate: moment([2020, 0, 1]), endDate: moment([2020, 1, 1])}
    const rentRanges = [rent1, rent2]
    const cpi = 0.033
    const result = calculateTotalAmountOwedToTenant(rentRanges, cpi)
    // Float(17.00) == "17.00"
    expect(result).toBe("17.00")
  })
  // TODO: Write more test cases!
})

describe('checkFlags', () => {
  it('uses flags to eval a result', () => {
    const flags = {
      'voucher-q': 'yes',
      'first-q': 'no'
    }
    const arr = [['voucher-q', 'or', 'not','first-q']]
    const result = checkFlags(arr, flags)
    expect(result).toBe(true)
  })
})