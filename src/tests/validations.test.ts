import { describe, it, expect } from 'vitest';
import { childSchema, sponsorSchema, testimonialSchema, photoSchema } from '../validations/schemas';

describe('Validation Schemas', () => {
  describe('Child Schema', () => {
    it('validates correct child data', () => {
      const validChild = {
        name: "Jean",
        gender: "M",
        birth_date: "2010-01-01",
        city: "Varadero",
        needs: [{
          category: "education",
          description: "Needs school supplies",
          is_urgent: false
        }]
      };
      
      const result = childSchema.safeParse(validChild);
      expect(result.success).toBe(true);
    });

    it('rejects invalid child data', () => {
      const invalidChild = {
        name: "",
        gender: "invalid",
        birth_date: "invalid-date",
        city: ""
      };
      
      const result = childSchema.safeParse(invalidChild);
      expect(result.success).toBe(false);
    });
  });

  describe('Sponsor Schema', () => {
    it('validates correct sponsor data', () => {
      const validSponsor = {
        name: "Marie",
        email: "marie@example.com",
        city: "Paris"
      };
      
      const result = sponsorSchema.safeParse(validSponsor);
      expect(result.success).toBe(true);
    });

    it('rejects invalid sponsor data', () => {
      const invalidSponsor = {
        name: "",
        email: "invalid-email"
      };
      
      const result = sponsorSchema.safeParse(invalidSponsor);
      expect(result.success).toBe(false);
    });
  });
});