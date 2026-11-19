// The travel planner: turns a search (from, to, when) into trip suggestions that mix
// ordinary buses with bookable autonomous on-demand buses.

import { lines, distance } from './places.js';
import { estimateMinutes, pickupEtaMinutes } from './autobuss.svelte.js';
import { ceilToHalfHour } from './format.js';

/**
 * @typedef {import('./places.js').Place} Place
 * @typedef {{ from: Place, to: Place, when: number | null }} Query  `when` null = "Åka nu"
 * @typedef {{
 *   id: string,
 *   kind: 'bus' | 'autonomous',
 *   line: string | null,
 *   from: Place,
 *   to: Place,
 *   departure: number,
 *   arrival: number,
 *   durationMin: number,
 * }} Suggestion
 */

const MIN = 60_000;
const BUS_MIN_PER_UNIT = 0.3; // ordinary buses stop everywhere on the line, so they're slower
const BUS_EXTRA_MIN = 4;
const AUTONOMOUS_LATER_OPTIONS_MIN = [10, 40]; // when a time is chosen: offer these departures after it

/** @param {Query} query @returns {Suggestion[]} */
export function searchTrips({ from, to, when }) {
  const start = when ?? Date.now();
  /** @type {Suggestion[]} */
  const suggestions = [];

  // Ordinary bus: only if one line serves both stops. Departs every :00 and :30.
  const line = lines.find((l) => l.stops.includes(from.id) && l.stops.includes(to.id));
  if (line) {
    const durationMin = Math.round(distance(from, to) * BUS_MIN_PER_UNIT + BUS_EXTRA_MIN);
    const first = ceilToHalfHour(start);
    for (const departure of [first, first + 30 * MIN]) {
      suggestions.push(suggestion('bus', line.number, from, to, departure, durationMin));
    }
  }

  // Autonomous bus: bookable anywhere in the area. "Åka nu" uses the closest free bus.
  const durationMin = estimateMinutes(from, to);
  const departures =
    when === null
      ? [Date.now() + pickupEtaMinutes(from) * MIN, Date.now() + 30 * MIN]
      : AUTONOMOUS_LATER_OPTIONS_MIN.map((m) => when + m * MIN);
  for (const departure of departures) {
    suggestions.push(suggestion('autonomous', null, from, to, Math.ceil(departure / MIN) * MIN, durationMin));
  }

  return suggestions.sort((a, b) => a.departure - b.departure);
}

/**
 * @param {'bus' | 'autonomous'} kind @param {string | null} line @param {Place} from @param {Place} to
 * @param {number} departure @param {number} durationMin
 * @returns {Suggestion}
 */
function suggestion(kind, line, from, to, departure, durationMin) {
  return {
    id: `${kind}-${departure}`,
    kind,
    line,
    from,
    to,
    departure,
    arrival: departure + durationMin * MIN,
    durationMin,
  };
}
