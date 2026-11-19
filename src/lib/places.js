// Stops in the prototype's area (Barkarby) and the ordinary bus lines between them.

/**
 * @typedef {{ id: string, name: string, x: number, y: number }} Place
 * x/y are map units – BusMap draws the area as a 100 x 90 map.
 */

/** @type {Place[]} */
export const places = [
  { id: 'barkarby-station', name: 'Barkarby station', x: 16, y: 70 },
  { id: 'barkarby-gard', name: 'Barkarby gård', x: 22, y: 26 },
  { id: 'barkarbystaden-c', name: 'Barkarbystaden C', x: 40, y: 50 },
  { id: 'flygfaltsparken', name: 'Flygfältsparken', x: 56, y: 74 },
  { id: 'veddesta', name: 'Veddesta', x: 68, y: 26 },
  { id: 'handelsplatsen', name: 'Handelsplatsen', x: 82, y: 48 },
  { id: 'akallalanken', name: 'Akallalänken', x: 84, y: 76 },
];

/**
 * Ordinary (driver-operated) bus lines. A trip only gets an ordinary bus suggestion if one line
 * serves both stops – everywhere else the autonomous on-demand bus fills the gap.
 * @type {{ number: string, stops: string[] }[]}
 */
export const lines = [
  { number: '541', stops: ['barkarby-station', 'barkarbystaden-c', 'handelsplatsen', 'akallalanken'] },
  { number: '550', stops: ['barkarby-gard', 'barkarbystaden-c', 'flygfaltsparken'] },
  { number: '567', stops: ['veddesta', 'handelsplatsen'] },
];

/** @param {{ x: number, y: number }} a @param {{ x: number, y: number }} b */
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Finds a place by name, ignoring case and surrounding spaces. @param {string} name */
export const findPlace = (name) => places.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
