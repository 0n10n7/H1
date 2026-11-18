// Simulated fleet of autonomous on-demand buses ("autonoma anropsstyrda bussar"),
// running entirely in the browser. `fleet` is reactive Svelte state, so components
// that read it re-render automatically as the buses move.
// Coordinates are in map units (BusMap draws them in a 100 x 90 SVG).

/**
 * @typedef {{ x: number, y: number }} Point
 * @typedef {{ id: string, name: string, x: number, y: number }} Stop
 * @typedef {{ id: string, capacity: number, x: number, y: number, tripId: string | null }} Vehicle
 * @typedef {'to_pickup' | 'boarding' | 'riding' | 'completed' | 'cancelled'} TripStatus
 * @typedef {{
 *   id: string,
 *   status: TripStatus,
 *   from: Stop,
 *   to: Stop,
 *   passengers: number,
 *   code: string,
 *   vehicleId: string,
 *   boardingEndsAt: number,
 * }} Trip
 */

const SPEED = 5; // map units per second – much faster than real life so the demo is quick
const METERS_PER_UNIT = 25; // 100 units ≈ 2.5 km
const BOARDING_SECONDS = 8; // how long a bus waits at the pickup stop
const TICK_MS = 250;
const OTHER_TRIP_CHANCE = 0.03; // per tick: chance that a simulated passenger orders a bus

export const MAX_PASSENGERS = 4;

/** @type {Stop[]} */
export const stops = [
  { id: 'barkarby-station', name: 'Barkarby station', x: 16, y: 70 },
  { id: 'barkarby-gard', name: 'Barkarby gård', x: 22, y: 26 },
  { id: 'barkarbystaden-c', name: 'Barkarbystaden C', x: 40, y: 50 },
  { id: 'flygfaltsparken', name: 'Flygfältsparken', x: 56, y: 74 },
  { id: 'veddesta', name: 'Veddesta', x: 68, y: 26 },
  { id: 'handelsplatsen', name: 'Handelsplatsen', x: 82, y: 48 },
  { id: 'akallalanken', name: 'Akallalänken', x: 84, y: 76 },
];

/** @type {{ vehicles: Vehicle[], trips: Trip[], myTripId: string | null, now: number }} */
export const fleet = $state({
  vehicles: [
    { id: 'AB-01', capacity: 8, x: 30, y: 40, tripId: null },
    { id: 'AB-02', capacity: 8, x: 74, y: 60, tripId: null },
    { id: 'AB-03', capacity: 8, x: 50, y: 30, tripId: null },
  ],
  trips: [], // ongoing trips: the user's own plus simulated other passengers'
  myTripId: null,
  now: Date.now(), // updated every tick so countdowns re-render
});

/** @param {Point} a @param {Point} b */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** @param {Trip} trip */
const isFinished = (trip) => trip.status === 'completed' || trip.status === 'cancelled';

/** @param {string} id */
function vehicleById(id) {
  const vehicle = fleet.vehicles.find((v) => v.id === id);
  if (!vehicle) throw new Error(`Okänd buss: ${id}`);
  return vehicle;
}

/**
 * Moves the vehicle `step` units toward target. Returns true when it has arrived.
 * @param {Point} vehicle @param {Point} target @param {number} step
 */
function moveToward(vehicle, target, step) {
  const d = dist(vehicle, target);
  if (d <= step) {
    vehicle.x = target.x;
    vehicle.y = target.y;
    return true;
  }
  vehicle.x += ((target.x - vehicle.x) / d) * step;
  vehicle.y += ((target.y - vehicle.y) / d) * step;
  return false;
}

/**
 * Sends the closest free bus with enough seats. Returns null if none is free.
 * @param {Stop} from @param {Stop} to @param {number} passengers
 */
function startTrip(from, to, passengers) {
  const vehicle = fleet.vehicles
    .filter((v) => v.tripId === null && v.capacity >= passengers)
    .sort((a, b) => dist(a, from) - dist(b, from))[0];
  if (!vehicle) return null;

  /** @type {Trip} */
  const trip = {
    id: crypto.randomUUID(),
    status: 'to_pickup',
    from,
    to,
    passengers,
    code: String(Math.floor(1000 + Math.random() * 9000)),
    vehicleId: vehicle.id,
    boardingEndsAt: 0,
  };
  vehicle.tripId = trip.id;
  fleet.trips.push(trip);
  return trip;
}

// Other passengers order buses now and then, but always leave one bus free for the user.
function maybeStartOtherTrip() {
  const freeCount = fleet.vehicles.filter((v) => v.tripId === null).length;
  if (freeCount < 2 || Math.random() > OTHER_TRIP_CHANCE) return;
  const from = stops[Math.floor(Math.random() * stops.length)];
  const others = stops.filter((s) => s !== from);
  startTrip(from, others[Math.floor(Math.random() * others.length)], 1);
}

/**
 * Trip lifecycle: to_pickup -> boarding -> riding -> completed (or cancelled before riding)
 * @param {number} dt seconds since the last tick
 */
function tick(dt) {
  const now = Date.now();
  for (const trip of fleet.trips) {
    const vehicle = vehicleById(trip.vehicleId);
    if (trip.status === 'to_pickup') {
      if (moveToward(vehicle, trip.from, SPEED * dt)) {
        trip.status = 'boarding';
        trip.boardingEndsAt = now + BOARDING_SECONDS * 1000;
      }
    } else if (trip.status === 'boarding') {
      if (now >= trip.boardingEndsAt) trip.status = 'riding';
    } else if (trip.status === 'riding') {
      if (moveToward(vehicle, trip.to, SPEED * dt)) {
        trip.status = 'completed';
        vehicle.tripId = null;
      }
    }
  }
  // Forget other passengers' finished trips; keep the user's so its card can show "Framme".
  if (fleet.trips.some((t) => isFinished(t) && t.id !== fleet.myTripId)) {
    fleet.trips = fleet.trips.filter((t) => !isFinished(t) || t.id === fleet.myTripId);
  }
  maybeStartOtherTrip();
  fleet.now = now;
}

setInterval(() => tick(TICK_MS / 1000), TICK_MS);

// ---- Used by the UI -------------------------------------------------------

export function myTrip() {
  return fleet.trips.find((t) => t.id === fleet.myTripId) ?? null;
}

/** @param {Trip | null} trip */
export function isOngoing(trip) {
  return trip !== null && !isFinished(trip);
}

/** @param {string} fromId @param {string} toId @param {number} passengers */
export function bookTrip(fromId, toId, passengers) {
  const from = stops.find((s) => s.id === fromId);
  const to = stops.find((s) => s.id === toId);
  if (!from || !to) throw new Error('Okänd hållplats.');
  if (from === to) throw new Error('Välj två olika hållplatser.');
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > MAX_PASSENGERS) {
    throw new Error(`Antal resenärer måste vara 1–${MAX_PASSENGERS}.`);
  }
  const trip = startTrip(from, to, passengers);
  if (!trip) throw new Error('Alla bussar är upptagna just nu. Försök igen om en stund.');
  fleet.myTripId = trip.id;
}

export function cancelMyTrip() {
  const trip = myTrip();
  if (!trip || (trip.status !== 'to_pickup' && trip.status !== 'boarding')) return;
  trip.status = 'cancelled';
  vehicleById(trip.vehicleId).tripId = null;
}

export function clearMyTrip() {
  fleet.trips = fleet.trips.filter((t) => t.id !== fleet.myTripId || isOngoing(t));
  fleet.myTripId = null;
}

/**
 * Times in whole seconds, computed from the bus's current position.
 * @param {Trip} trip
 */
export function tripTimes(trip) {
  const vehicle = vehicleById(trip.vehicleId);
  const rideSec = dist(trip.from, trip.to) / SPEED;
  const boardingLeftSec =
    trip.status === 'boarding' ? Math.max(0, (trip.boardingEndsAt - fleet.now) / 1000) : BOARDING_SECONDS;

  let pickupSec = 0;
  let dropoffSec = 0;
  if (trip.status === 'to_pickup') {
    pickupSec = dist(vehicle, trip.from) / SPEED;
    dropoffSec = pickupSec + BOARDING_SECONDS + rideSec;
  } else if (trip.status === 'boarding') {
    dropoffSec = boardingLeftSec + rideSec;
  } else if (trip.status === 'riding') {
    dropoffSec = dist(vehicle, trip.to) / SPEED;
  }

  return {
    pickupSec: Math.ceil(pickupSec),
    dropoffSec: Math.ceil(dropoffSec),
    boardingLeftSec: Math.ceil(boardingLeftSec),
  };
}

/** @param {Trip} trip */
export function tripDistanceMeters(trip) {
  return Math.round(dist(trip.from, trip.to) * METERS_PER_UNIT);
}
