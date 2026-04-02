import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPct, formatNumber, deltaColor, deltaSign } from '@/lib/formatters'

// ── formatCurrency ─────────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  describe('compact mode', () => {
    it('formats billions', () => {
      expect(formatCurrency(1_500_000_000, true)).toBe('$1.5B')
      expect(formatCurrency(2_000_000_000, true)).toBe('$2.0B')
    })

    it('formats millions', () => {
      expect(formatCurrency(298_500_000, true)).toBe('$298.5M')
      expect(formatCurrency(1_000_000, true)).toBe('$1.0M')
      expect(formatCurrency(22_400_000, true)).toBe('$22.4M')
    })

    it('formats thousands', () => {
      expect(formatCurrency(85_000, true)).toBe('$85.0K')
      expect(formatCurrency(1_000, true)).toBe('$1.0K')
    })

    it('formats values under 1000 without suffix', () => {
      const result = formatCurrency(500, true)
      expect(result).toContain('500')
    })
  })

  describe('full mode (default)', () => {
    it('formats with MXN currency style', () => {
      const result = formatCurrency(1000)
      // Intl.NumberFormat with es-MX returns something like "$1,000"
      expect(result).toContain('1')
      expect(result).toContain('000')
    })

    it('does not use compact suffixes in full mode', () => {
      const result = formatCurrency(1_000_000, false)
      expect(result).not.toContain('M')
      expect(result).not.toContain('K')
    })
  })
})

// ── formatPct ─────────────────────────────────────────────────────────────────

describe('formatPct', () => {
  it('formats with 1 decimal by default', () => {
    expect(formatPct(91.4)).toBe('91.4%')
    expect(formatPct(100)).toBe('100.0%')
    expect(formatPct(0)).toBe('0.0%')
  })

  it('respects custom decimal places', () => {
    expect(formatPct(91.456, 2)).toBe('91.46%')
    expect(formatPct(91.456, 0)).toBe('91%')
  })

  it('handles negative values', () => {
    expect(formatPct(-2.4)).toBe('-2.4%')
  })
})

// ── formatNumber ──────────────────────────────────────────────────────────────

describe('formatNumber', () => {
  describe('compact mode', () => {
    it('formats millions', () => {
      expect(formatNumber(1_500_000, true)).toBe('1.5M')
    })

    it('formats thousands', () => {
      expect(formatNumber(25_000, true)).toBe('25.0K')
    })

    it('returns number as-is for values under 1000', () => {
      const result = formatNumber(500, true)
      expect(result).toContain('500')
    })
  })

  describe('full mode', () => {
    it('formats with locale separators', () => {
      const result = formatNumber(25000)
      expect(result).toContain('25')
      expect(result).toContain('000')
    })
  })
})

// ── deltaColor ────────────────────────────────────────────────────────────────

describe('deltaColor', () => {
  describe('goodIsPositive = true (default)', () => {
    it('returns positive color for positive value', () => {
      expect(deltaColor(1)).toBe('text-emerald-600')
    })

    it('returns negative color for negative value', () => {
      expect(deltaColor(-1)).toBe('text-red-500')
    })

    it('returns neutral color for zero', () => {
      expect(deltaColor(0)).toBe('text-slate-500')
    })
  })

  describe('goodIsPositive = false (lower is better, e.g. COGS)', () => {
    it('returns positive color for negative value (cost reduction is good)', () => {
      expect(deltaColor(-1, false)).toBe('text-emerald-600')
    })

    it('returns negative color for positive value (cost increase is bad)', () => {
      expect(deltaColor(1, false)).toBe('text-red-500')
    })

    it('returns neutral color for zero', () => {
      expect(deltaColor(0, false)).toBe('text-slate-500')
    })
  })
})

// ── deltaSign ─────────────────────────────────────────────────────────────────

describe('deltaSign', () => {
  it('returns + for positive values', () => {
    expect(deltaSign(1)).toBe('+')
    expect(deltaSign(100)).toBe('+')
  })

  it('returns empty string for negative values', () => {
    expect(deltaSign(-1)).toBe('')
  })

  it('returns empty string for zero', () => {
    expect(deltaSign(0)).toBe('')
  })
})
