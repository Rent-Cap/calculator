import { calculateTotalAmountOwedToTenant, determineRentOnDateFromRentRanges, determineMaxRentFromRentRanges, checkFlags } from '../Helpers'
import moment from 'moment'

// Move In date: January 1st, 2019
// Rent on January 1st, 2019: $1000
// First Rent Increase: February 1st, 2019
// Rent on February 1st, 2019: $1200 
// CPI: 4%

const jan1st2019 = moment([2019, 0, 1])
const feb1st2019 = moment([2019, 1, 1])
const mar142019 = moment([2019, 2, 14])
const mar152019 = moment([2019, 2, 15])
const mar162019 = moment([2019, 2, 16])
const july1st2019 = moment([2019, 6, 1])
const jan1st2020 = moment([2020, 0, 1])
const feb1st2020 = moment([2020, 1, 1])
const apr1st2020 = moment([2020, 3, 1])
const july1st2020 = moment([2019, 6, 1])
const cpi = 0.04

describe('calculateAmountOwedToTenant', () => {
  it('Scenario #1: Landlord cannot raise rent by more than CPI+5%/10% in any 12-month period.', () => {
    const rent1 = {rent: 1000, startDate: jan1st2019, endDate: feb1st2019}
    const rent2 = {rent: 1200, startDate: feb1st2019, endDate: july1st2019}
    const rent3 = {rent: 1300, startDate: feb1st2020, endDate: apr1st2020}
    const rentRanges = [rent1, rent2, rent3]
    const result = calculateTotalAmountOwedToTenant(rentRanges, cpi)
    expect(result).toBe(0)
  })
  it('Scenario #2: After January 1st, 2020, tenants are eligible for refund if rent is over legal amount', () => {
    const rent1 = {rent: 1000, startDate: jan1st2019, endDate: feb1st2019}
    const rent2 = {rent: 1200, startDate: feb1st2019, endDate: july1st2020}
    const rent3 = {rent: 1300, startDate: july1st2019, endDate: feb1st2020}
    const rent4 = {rent: 1400, startDate: feb1st2020, endDate: apr1st2020}
    const rentRanges = [rent1, rent2, rent3, rent4]
    const result = calculateTotalAmountOwedToTenant(rentRanges, cpi)
    expect(result).toBe("184.00")
  })
})

describe('determineRentOnDateFromRentRanges', () => {
  it('Ignores dates before target', () => {
    const rent1 = {rent: 100, startDate: jan1st2019, endDate: feb1st2019}
    const rent2 = {rent: 200, startDate: feb1st2019, endDate: july1st2020}
    const rentRanges = [rent1, rent2]
    const result = determineRentOnDateFromRentRanges(mar152019, rentRanges)
    expect(result).toBe(200)
  })
  it('Checks off by 1', () => {
    const rent1 = {rent: 100, startDate: jan1st2019, endDate: mar142019}
    const rent2 = {rent: 600, startDate: mar152019, endDate: july1st2020}
    const rentRanges = [rent1, rent2]
    const result = determineRentOnDateFromRentRanges(mar152019, rentRanges)
    expect(result).toBe(600)
  })
  it('Checks off by 1 #2', () => {
    const rent1 = {rent: 100, startDate: jan1st2019, endDate: mar152019}
    const rent2 = {rent: 600, startDate: mar162019, endDate: july1st2020}
    const rentRanges = [rent1, rent2]
    const result = determineRentOnDateFromRentRanges(mar152019, rentRanges)
    expect(result).toBe(100)
  })
  it('Checks off by 1 #3', () => {
    const rent1 = {rent: 900, startDate: mar152019, endDate: mar152019}
    const rent2 = {rent: 600, startDate: mar162019, endDate: july1st2020}
    const rentRanges = [rent1, rent2]
    const result = determineRentOnDateFromRentRanges(mar152019, rentRanges)
    expect(result).toBe(900)
  })
  it('Throws error if no target', () => {
    expect(() => determineRentOnDateFromRentRanges(null, [])).toThrow()
  })
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

describe('determineMaxRentFromRentRanges', () => {
  it('Returns max rent given ranges', () => {
    const rent1 = {rent: 100, startDate: jan1st2019, endDate: mar152019}
    const rent2 = {rent: 600, startDate: mar162019, endDate: july1st2020}
    const rentRanges = [rent1, rent2]
    const result = determineMaxRentFromRentRanges(mar152019, rentRanges, cpi)
    expect(result).toBe("109.00")
  })
  it('Check scenario #1', () => {
    const rent1 = {rent: 1000, startDate: jan1st2019, endDate: feb1st2019}
    const rent2 = {rent: 1200, startDate: feb1st2019, endDate: july1st2020}
    const rent3 = {rent: 1300, startDate: jan1st2020, endDate: july1st2020}
    const rentRanges = [rent1, rent2, rent3]
    const result = determineMaxRentFromRentRanges(mar152019, rentRanges, cpi)
    expect(result).toBe("1308.00")
  })
  it('Throws error if no target', () => {
    expect(() => determineMaxRentFromRentRanges(null, [], cpi)).toThrow()
  })
})
// Scenario #1
// Landlord cannot raise rent by more than CPI+5%/10% in any 12-month period	
// Current Date: January 1st, 2020
// Current Rent: $1300
// Rent on March 15th, 2019: $1200
// Date of Last Rent Increase: July 1st, 2019
// > Output: Your current rent is legal. You maximum rent until July 1st, 2020 is $1308 (can only raise $8 more from now until July 1st, 2020)
// mar_15_2019_rent * 1.09 = $1200 * 1.09 = $1308


// Scenario #2
// After January 1st, 2020, tenants are eligible for refund if rent is over legal amount
// Current Date: April 1st, 2020
// Current Rent: $1400
// Rent on March 15th, 2019: $1200
// Date of Last Rent Increase: February 1st, 2020
// > Output: Your rent should be rolled back to the maximum amount of $1308 (or is it void, so it’s back to $1300?). You should receive a refund of $184.
// mar_15_2019_rent * 1.09 = $1200 * 1.09 = $1308
// Refund: $1400-$1308 = $92 * 2 months = $184

// Scenario #3
// After the 12-month period of no rent increases over the maximum lawful amount
// Current Date: August 1st, 2020
// Current Rent: $1300
// Rent one year ago (Aug 1st, 2019): $1300 
// Date of Last (lawful) Rent Increase: July 1st, 2019
// > Output: Your rent is legal. The maximum amount your rent can go to today is $1417.
// aug_1_2019_rent * 1.09 = $1300 1.09 = $1417

// Scenario #4
// Project how much rent can increase within the year
// Current Date: August 1st, 2020
// Current Rent: $1400
// Estimate CPI on August 1st, 2021: 4%
// > Output: The maximum amount your rent can go up to on August 1st, 2021 is $1526
// aug_1_2020_rent * 1.09 = $1400 * 1.09 = $1526
