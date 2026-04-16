import { getAllowedCapacities, filterAndSortByCapacity } from '@/lib/capacityFilter';

describe('Capacity Filter Utility', () => {
  describe('getAllowedCapacities', () => {
    it('returns the exact match and nearby capacities for a mapped value', () => {
      // mapped value for 3 people: [3, 4, 2, 5]
      const capacities = getAllowedCapacities(3);
      expect(capacities).toEqual([3, 4, 2, 5]);
    });

    it('returns [people, people + 1] if the value is not in mapping array', () => {
      // 20 is not in the capacityMapping (max is 16)
      const capacities = getAllowedCapacities(20);
      expect(capacities).toEqual([20, 21]);
    });
  });

  describe('filterAndSortByCapacity', () => {
    type MockVilla = { id: number; guests: number; name: string };
    
    const mockVillas: MockVilla[] = [
      { id: 1, guests: 2, name: 'Villa A (2p)' },
      { id: 2, guests: 3, name: 'Villa B (3p)' },
      { id: 3, guests: 4, name: 'Villa C (4p)' },
      { id: 4, guests: 5, name: 'Villa D (5p)' },
      { id: 5, guests: 6, name: 'Villa E (6p)' },
    ];

    const getGuests = (v: MockVilla) => v.guests;

    it('should return all villas un-filtered if people is 0 or less', () => {
      const result = filterAndSortByCapacity(mockVillas, 0, getGuests);
      expect(result).toHaveLength(mockVillas.length);
      expect(result).toEqual(mockVillas);
    });

    it('should filter and sort villas correctly strictly checking priority mapping', () => {
      // for 3 people: priority [3, 4, 2, 5]
      const result = filterAndSortByCapacity(mockVillas, 3, getGuests);
      
      // We expect id 2, 3, 1, 4 in that exact order
      expect(result).toHaveLength(4);
      expect(result[0].id).toBe(2); // 3 guests
      expect(result[1].id).toBe(3); // 4 guests
      expect(result[2].id).toBe(1); // 2 guests
      expect(result[3].id).toBe(4); // 5 guests
      
      // Double check their names
      const resultNames = result.map(r => r.name);
      expect(resultNames).toEqual([
        'Villa B (3p)',
        'Villa C (4p)',
        'Villa A (2p)',
        'Villa D (5p)'
      ]);
    });

    it('excludes villas that do not fit into the allowed capacity threshold', () => {
      // mapped value for 2 people: [2, 3, 4] -> Should not see Villa D (5p) or E (6p)
      const result = filterAndSortByCapacity(mockVillas, 2, getGuests);
      expect(result).toHaveLength(3);
      
      const ids = result.map(v => v.id);
      expect(ids).not.toContain(4);
      expect(ids).not.toContain(5);
    });
  });
});
