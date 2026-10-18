export interface MarketHierarchyItem {
  code: string;
  name: string;
  fullName: string;
  region: string;
  area: string;
}

export const INITIAL_MARKET_HIERARCHIES: MarketHierarchyItem[] = [
  {
    code: 'MEL035',
    name: 'Mirpur East',
    fullName: 'MEL035 - Mirpur East',
    region: 'Dhaka North',
    area: 'Mirpur',
  },
  {
    code: 'MW012',
    name: 'Mirpur West',
    fullName: 'MW012 - Mirpur West',
    region: 'Dhaka North',
    area: 'Mirpur',
  },
  {
    code: 'UTT001',
    name: 'Uttara Sector 1-7',
    fullName: 'UTT001 - Uttara Sector 1-7',
    region: 'Dhaka North',
    area: 'Uttara',
  },
  {
    code: 'UTT002',
    name: 'Uttara Sector 8-14',
    fullName: 'UTT002 - Uttara Sector 8-14',
    region: 'Dhaka North',
    area: 'Uttara',
  },
  {
    code: 'GUL010',
    name: 'Gulshan Banani',
    fullName: 'GUL010 - Gulshan Banani',
    region: 'Dhaka North',
    area: 'Gulshan',
  },
  {
    code: 'DHN004',
    name: 'Dhanmondi',
    fullName: 'DHN004 - Dhanmondi',
    region: 'Dhaka South',
    area: 'Dhanmondi',
  },
  {
    code: 'MOT008',
    name: 'Motijheel Commercial',
    fullName: 'MOT008 - Motijheel Commercial',
    region: 'Dhaka South',
    area: 'Motijheel',
  },
  {
    code: 'CTG001',
    name: 'Agrabad Commercial',
    fullName: 'CTG001 - Agrabad Commercial',
    region: 'Chittagong',
    area: 'Agrabad',
  },
  {
    code: 'KUS001',
    name: 'Kushtia Industrial Zone',
    fullName: 'KUS001 - Kushtia Industrial Zone',
    region: 'Khulna',
    area: 'Kushtia',
  },
  {
    code: 'BOG002',
    name: 'Bogra Central',
    fullName: 'BOG002 - Bogra Central',
    region: 'Rajshahi',
    area: 'Bogra',
  },
];

export const STANDARD_DEPARTMENTS: string[] = [
  'DEP-1 - MOUSUMI NETWORK LTD',
  'DEP-2 - RETAIL OPERATIONS',
  'DEP-3 - CORPORATE ACCOUNTS',
  'DEP-4 - FACTORY OPERATIONS & SCM',
  'DEP-5 - ACCOUNTS & FINANCE',
  'DEP-6 - QUALITY & WARRANTY SERVICES',
];
