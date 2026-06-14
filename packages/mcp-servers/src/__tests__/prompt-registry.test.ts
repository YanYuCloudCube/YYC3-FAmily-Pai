import { describe, expect, it } from 'vitest'
import {
  getAllSkills,
  getCategoryCount,
  getSkillByName,
  getSkillCategories,
  getSkillsByCategory,
  getSkillsCount,
  searchSkills,
} from '../registry/prompt-registry'

describe('prompt-registry', () => {
  describe('getAllSkills', () => {
    it('returns all skills', () => {
      const skills = getAllSkills()
      expect(skills.length).toBe(134)
    })

    it('each skill has name, description, category', () => {
      const skills = getAllSkills()
      for (const s of skills) {
        expect(s.name).toBeTruthy()
        expect(s.description).toBeTruthy()
        expect(s.category).toBeTruthy()
      }
    })

    it('returns a copy (immutable)', () => {
      const a = getAllSkills()
      const b = getAllSkills()
      expect(a).not.toBe(b)
      expect(a).toEqual(b)
    })
  })

  describe('getSkillsByCategory', () => {
    it('returns frontend skills', () => {
      const skills = getSkillsByCategory('frontend')
      expect(skills.length).toBeGreaterThanOrEqual(5)
      expect(skills.every(s => s.category === 'frontend')).toBe(true)
    })

    it('returns empty for unknown category', () => {
      const skills = getSkillsByCategory('nonexistent' as any)
      expect(skills).toEqual([])
    })

    it('all categories have skills', () => {
      const cats = getSkillCategories()
      for (const cat of cats) {
        expect(getSkillsByCategory(cat).length).toBeGreaterThan(0)
      }
    })
  })

  describe('getSkillByName', () => {
    it('finds pdf skill', () => {
      const skill = getSkillByName('pdf')
      expect(skill).toBeDefined()
      expect(skill!.name).toBe('pdf')
      expect(skill!.category).toBe('productivity')
    })

    it('finds nextjs skill', () => {
      const skill = getSkillByName('nextjs-app-router-patterns')
      expect(skill).toBeDefined()
      expect(skill!.category).toBe('frontend')
    })

    it('returns undefined for unknown', () => {
      expect(getSkillByName('nonexistent')).toBeUndefined()
    })
  })

  describe('getSkillCategories', () => {
    it('returns 8 categories', () => {
      const cats = getSkillCategories()
      expect(cats.length).toBeGreaterThanOrEqual(8)
    })
  })

  describe('searchSkills', () => {
    it('searches by name', () => {
      const results = searchSkills('react')
      expect(results.length).toBeGreaterThanOrEqual(2)
      expect(results.some(s => s.name === 'react-modernization')).toBe(true)
    })

    it('searches by description', () => {
      const results = searchSkills('database')
      expect(results.length).toBeGreaterThanOrEqual(1)
    })

    it('is case insensitive', () => {
      const upper = searchSkills('PDF')
      const lower = searchSkills('pdf')
      expect(upper).toEqual(lower)
    })

    it('returns empty for no match', () => {
      expect(searchSkills('zzzzzzzzz')).toEqual([])
    })
  })

  describe('getSkillsCount', () => {
    it('returns total count', () => {
      expect(getSkillsCount()).toBe(134)
    })
  })

  describe('getCategoryCount', () => {
    it('returns counts per category', () => {
      const counts = getCategoryCount()
      const total = Object.values(counts).reduce((a, b) => a + b, 0)
      expect(total).toBe(134)
      expect(counts.frontend).toBeGreaterThan(0)
      expect(counts.ai).toBeGreaterThan(0)
    })
  })
})
