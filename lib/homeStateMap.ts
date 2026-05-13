export type StateDebtRow = {
  debt: number;
  borrowers: number;
  avgDebt: number;
  defaultRate: number;
};

export const stateData: Record<string, StateDebtRow> = {
  AL: { debt: 22.1, borrowers: 594, avgDebt: 37200, defaultRate: 14.2 },
  AK: { debt: 3.1, borrowers: 77, avgDebt: 40200, defaultRate: 9.1 },
  AZ: { debt: 30.8, borrowers: 848, avgDebt: 36300, defaultRate: 13.8 },
  AR: { debt: 13.4, borrowers: 380, avgDebt: 35300, defaultRate: 15.1 },
  CA: { debt: 141.8, borrowers: 3820, avgDebt: 37100, defaultRate: 10.2 },
  CO: { debt: 27.4, borrowers: 718, avgDebt: 38200, defaultRate: 9.8 },
  CT: { debt: 19.8, borrowers: 480, avgDebt: 41200, defaultRate: 9.3 },
  DE: { debt: 5.8, borrowers: 148, avgDebt: 39100, defaultRate: 10.1 },
  FL: { debt: 100.2, borrowers: 2680, avgDebt: 37400, defaultRate: 14.1 },
  GA: { debt: 62.4, borrowers: 1620, avgDebt: 38500, defaultRate: 16.2 },
  HI: { debt: 5.9, borrowers: 148, avgDebt: 39800, defaultRate: 8.4 },
  ID: { debt: 7.8, borrowers: 213, avgDebt: 36700, defaultRate: 11.2 },
  IL: { debt: 66.4, borrowers: 1720, avgDebt: 38600, defaultRate: 12.4 },
  IN: { debt: 32.1, borrowers: 862, avgDebt: 37200, defaultRate: 13.1 },
  IA: { debt: 16.2, borrowers: 440, avgDebt: 36800, defaultRate: 10.8 },
  KS: { debt: 14.8, borrowers: 394, avgDebt: 37500, defaultRate: 11.4 },
  KY: { debt: 23.4, borrowers: 632, avgDebt: 37100, defaultRate: 14.8 },
  LA: { debt: 24.8, borrowers: 646, avgDebt: 38400, defaultRate: 16.8 },
  ME: { debt: 7.4, borrowers: 188, avgDebt: 39400, defaultRate: 10.2 },
  MD: { debt: 39.8, borrowers: 1020, avgDebt: 39000, defaultRate: 11.2 },
  MA: { debt: 42.8, borrowers: 1080, avgDebt: 39600, defaultRate: 8.8 },
  MI: { debt: 55.4, borrowers: 1460, avgDebt: 37900, defaultRate: 12.8 },
  MN: { debt: 30.2, borrowers: 788, avgDebt: 38300, defaultRate: 9.4 },
  MS: { debt: 16.8, borrowers: 448, avgDebt: 37500, defaultRate: 18.4 },
  MO: { debt: 33.8, borrowers: 888, avgDebt: 38100, defaultRate: 13.2 },
  MT: { debt: 5.2, borrowers: 136, avgDebt: 38200, defaultRate: 10.8 },
  NE: { debt: 10.8, borrowers: 286, avgDebt: 37800, defaultRate: 10.2 },
  NV: { debt: 18.4, borrowers: 492, avgDebt: 37400, defaultRate: 13.8 },
  NH: { debt: 8.8, borrowers: 218, avgDebt: 40300, defaultRate: 9.2 },
  NJ: { debt: 56.8, borrowers: 1440, avgDebt: 39400, defaultRate: 10.8 },
  NM: { debt: 9.8, borrowers: 268, avgDebt: 36500, defaultRate: 14.2 },
  NY: { debt: 112.4, borrowers: 2880, avgDebt: 39000, defaultRate: 11.4 },
  NC: { debt: 56.2, borrowers: 1480, avgDebt: 38000, defaultRate: 13.8 },
  ND: { debt: 3.8, borrowers: 98, avgDebt: 38700, defaultRate: 8.8 },
  OH: { debt: 65.8, borrowers: 1740, avgDebt: 37800, defaultRate: 13.2 },
  OK: { debt: 18.8, borrowers: 506, avgDebt: 37200, defaultRate: 14.8 },
  OR: { debt: 24.8, borrowers: 648, avgDebt: 38200, defaultRate: 11.2 },
  PA: { debt: 73.4, borrowers: 1880, avgDebt: 39000, defaultRate: 11.8 },
  RI: { debt: 7.2, borrowers: 182, avgDebt: 39600, defaultRate: 9.8 },
  SC: { debt: 28.8, borrowers: 762, avgDebt: 37800, defaultRate: 15.2 },
  SD: { debt: 4.8, borrowers: 126, avgDebt: 38100, defaultRate: 10.4 },
  TN: { debt: 34.2, borrowers: 908, avgDebt: 37700, defaultRate: 14.8 },
  TX: { debt: 127.8, borrowers: 3380, avgDebt: 37800, defaultRate: 14.2 },
  UT: { debt: 14.8, borrowers: 408, avgDebt: 36300, defaultRate: 9.8 },
  VT: { debt: 4.2, borrowers: 104, avgDebt: 40500, defaultRate: 9.4 },
  VA: { debt: 55.8, borrowers: 1440, avgDebt: 38800, defaultRate: 10.8 },
  WA: { debt: 37.8, borrowers: 980, avgDebt: 38600, defaultRate: 9.8 },
  WV: { debt: 11.8, borrowers: 316, avgDebt: 37400, defaultRate: 16.8 },
  WI: { debt: 31.4, borrowers: 828, avgDebt: 37900, defaultRate: 10.8 },
  WY: { debt: 2.8, borrowers: 74, avgDebt: 37800, defaultRate: 9.8 },
  DC: { debt: 8.2, borrowers: 186, avgDebt: 44100, defaultRate: 12.8 },
};

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

/** Rough US cartogram: 11 columns, null for empty cells. */
export const STATE_GRID: (string | null)[][] = [
  [null, null, null, null, null, null, null, null, null, "ME", null],
  ["WA", "ID", "MT", "ND", "MN", "WI", "MI", "VT", "NH", "MA", "RI"],
  ["OR", "WY", "SD", "IA", "IL", "IN", "OH", "CT", "NJ", "DE", "MD"],
  ["NV", "UT", "CO", "NE", "MO", "KY", "WV", "PA", "NY", "DC", "VA"],
  ["CA", "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "GA", "MS", "AL"],
  [null, null, null, "OK", "LA", "TX", "FL", null, null, null, null],
  ["HI", "AK", null, null, null, null, null, null, null, null, null],
];

export const NATIONAL_AVG_DEBT = 37787;

export function heatColorForDebt(debtBillions: number) {
  if (debtBillions < 15) {
    return "#FDF3D0";
  }
  if (debtBillions < 40) {
    return "#E4A400";
  }
  if (debtBillions < 80) {
    return "#E07B00";
  }
  return "#C0392B";
}
