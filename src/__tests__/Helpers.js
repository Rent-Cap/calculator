import { calculateTotalAmountOwedToTenant } from '../Helpers'

describe('calculateAmountOwedToTenant', () => {
  it('returns 0 on null parameters', () => {
    const result = calculateTotalAmountOwedToTenant()
    expect(result).toBe(0)
  })
})
