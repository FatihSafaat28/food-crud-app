import { formatPrice, isValidEmail, truncate } from "@/app/lib/utils"

describe('formatPrice', () => {
  it('formats number as IDR currency', () => {
    expect(formatPrice(1000)).toContain('1.000')
    expect(formatPrice(1000)).toMatch(/Rp|IDR/i)
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toContain('0')
  })

  it('handles large numbers with thousand separators', () => {
    const formatted = formatPrice(1000000)
    expect(formatted).toContain('1.000.000')
  })
  
  it('handles decimal numbers', () => {
    expect(formatPrice(1000.50)).toContain('1.000,5')
  })
})

describe(`isValidEmail`, () => {
    it(`test email` , () => {
        expect(isValidEmail(`fatihsafaat@gmail.com`)).toBe(true)
    })
    it(`not a email` , () => {
        expect(isValidEmail(`fatih`)).toBe(false)
    })
    it(`without name`, () => {
        expect(isValidEmail(`@gmail.com`)).toBe(false)
    })
    it(`without domain`, () => {
        expect(isValidEmail(`fatih@`)).toBe(false)
    })
})

describe(`truncate`, () => {
    it(`truncate text`, () => {
        expect(truncate(`fatih`, 3)).toBe(`...`)
    })
    it(`not a truncate text`, () => {
        expect(truncate(`fatih`, 10)).toBe(`fatih`)
    })
})