// Simulated fleet of autonomous on-demand buses ("autonoma anropsstyrda bussar"),
// running entirely in the browser. `fleet` is reactive Svelte state, so components
// that read it re-render automatically as the buses move.
//
// Demo time: one second in the simulation is one minute in the story the UI tells,
// so a 25-minute trip plays out in about 25 seconds.

import { places, distance } from './places.js';

/**
 * @typedef {import('./places.js').Place} Place
 * @typedef {{ x: number, y: number }} Point
 * @typedef {{ id: string, x: number, y: number, tripId: string | null }} Vehicle
 * @typedef {'scheduled' | 'to_pickup' | 'boarding' | 'riding' | 'completed' | 'cancelled'} TripStatus
 * @typedef {{
 *   id: string,
 *   status: TripStatus,
 *   from: Place,
 *   to: Place,
 *   departure: number,
 *   durationMin: number,
 *   code: string,
 *   vehicleId: string | null,
 *   boardingEndsAt: number,
 * }} Trip
 */

const SPEED = 5; // map units per (demo) minute
const BOARDING_MIN = 3; // how long the bus waits at the pickup stop
const STOP_MARGIN_MIN = 2; // added to estimates for stops and other passengers on the way
const DISPATCH_WINDOW_MIN = 15; // trips leaving sooner than this get a bus straight away
const TICK_MS = 250;
const OTHER_TRIP_CHANCE = 0.02; // per tick: chance that a simulated passenger books a bus

/** @type {{ vehicles: Vehicle[], trips: Trip[], myTripId: string | null, now: number }} */
export const fleet = $state({
  vehicles: [
    { id: 'AB-01', x: 30, y: 40, tripId: null },
    { id: 'AB-02', x: 74, y: 60, tripId: null },
    { id: 'AB-03', x: 50, y: 30, tripId: null },
  ],
  trips: [], // the user's trip plus simulated other passengers' trips
  myTripId: null,
  now: Date.now(), // updated every tick so countdowns re-render
});

/** @param {Trip} trip */
const isFinished = (trip) => trip.status === 'completed' || trip.status === 'cancelled';

/** @param {string} id */
function vehicleById(id) {
  const vehicle = fleet.vehicles.find((v) => v.id === id);
  if (!vehicle) throw new Error(`Okänd buss: ${id}`);
  return vehicle;
}

/** @param {Point} point */
function closestFreeVehicle(point) {
  return fleet.vehicles
    .filter((v) => v.tripId === null)
    .sort((a, b) => distance(a, point) - distance(b, point))[0];
}

/**
 * Moves the vehicle `step` map units toward target. Returns true when it has arrived.
 * @param {Point} vehicle @param {Point} target @param {number} step
 */
function moveToward(vehicle, target, step) {
  const d = distance(vehicle, target);
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
 * Adds a scheduled trip and returns the reactive copy stored in `fleet`.
 * @param {Place} from @param {Place} to @param {number} departure @param {number} durationMin
 */
function addTrip(from, to, departure, durationMin) {
  fleet.trips.push({
    id: crypto.randomUUID(),
    status: 'scheduled',
    from,
    to,
    departure,
    durationMin,
    code: String(Math.floor(1000 + Math.random() * 9000)),
    vehicleId: null,
    boardingEndsAt: 0,
  });
  return fleet.trips[fleet.trips.length - 1];
}

/** Sends the closest free bus to the trip's pickup stop. @param {Trip} trip */
function dispatch(trip) {
  const vehicle = closestFreeVehicle(trip.from);
  if (!vehicle) throw new Error('Alla bussar är upptagna just nu. Försök igen om en stund.');
  vehicle.tripId = trip.id;
  trip.vehicleId = vehicle.id;
  trip.status = 'to_pickup';
}

// Other passengers book buses now and then, but always leave one bus free for the user.
function maybeStartOtherTrip() {
  const freeCount = fleet.vehicles.filter((v) => v.tripId === null).length;
  if (freeCount < 2 || Math.random() > OTHER_TRIP_CHANCE) return;
  const from = places[Math.floor(Math.random() * places.length)];
  const others = places.filter((s) => s !== from);
  const to = others[Math.floor(Math.random() * others.length)];
  dispatch(addTrip(from, to, Date.now(), estimateMinutes(from, to)));
}

/**
 * Trip lifecycle: scheduled -> to_pickup -> boarding -> riding -> completed
 * (or cancelled before riding). `dt` is in seconds, i.e. demo minutes.
 * @param {number} dt
 */
function tick(dt) {
  const now = Date.now();
  for (const trip of fleet.trips) {
    if (trip.vehicleId === null) continue; // scheduled, no bus yet
    const vehicle = vehicleById(trip.vehicleId);
    if (trip.status === 'to_pickup') {
      if (moveToward(vehicle, trip.from, SPEED * dt)) {
        trip.status = 'boarding';
        trip.boardingEndsAt = now + BOARDING_MIN * 1000;
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
  // Forget other passengers' finished trips; keep the user's so its screen can show "Framme".
  if (fleet.trips.some((t) => isFinished(t) && t.id !== fleet.myTripId)) {
    fleet.trips = fleet.trips.filter((t) => !isFinished(t) || t.id === fleet.myTripId);
  }
  maybeStartOtherTrip();
  fleet.now = now;
}

setInterval(() => tick(TICK_MS / 1000), TICK_MS);

// ---- Estimates used by the travel planner ----------------------------------

/** Door-to-door minutes for an autonomous bus between two stops. @param {Place} from @param {Place} to */
export function estimateMinutes(from, to) {
  return Math.round(distance(from, to) / SPEED + STOP_MARGIN_MIN);
}

/** Minutes until the closest free bus could be at `from`. @param {Place} from */
export function pickupEtaMinutes(from) {
  const vehicle = closestFreeVehicle(from);
  return vehicle ? Math.max(2, Math.ceil(distance(vehicle, from) / SPEED)) : DISPATCH_WINDOW_MIN;
}

// ---- The user's own booking -----------------------------------------------

export function myTrip() {
  return fleet.trips.find((t) => t.id === fleet.myTripId) ?? null;
}

/** Booked and not yet completed or cancelled. @param {Trip | null} trip */
export function isOngoing(trip) {
  return trip !== null && !isFinished(trip);
}

/** A bus is on its way or the user is on board. @param {Trip | null} trip */
export function isLive(trip) {
  return trip !== null && ['to_pickup', 'boarding', 'riding'].includes(trip.status);
}

/** @param {{ from: Place, to: Place, departure: number, durationMin: number }} suggestion */
export function bookMyTrip({ from, to, departure, durationMin }) {
  if (isOngoing(myTrip())) throw new Error('Du har redan en bokad resa. Avboka den först.');
  const trip = addTrip(from, to, departure, durationMin);
  fleet.myTripId = trip.id;
  if (departure - Date.now() <= DISPATCH_WINDOW_MIN * 60_000) dispatch(trip);
}

/** Sends a bus right away for a trip booked further ahead (demo shortcut). */
export function dispatchMyTrip() {
  const trip = myTrip();
  if (trip?.status === 'scheduled') dispatch(trip);
}

export function cancelMyTrip() {
  const trip = myTrip();
  if (!trip || !['scheduled', 'to_pickup', 'boarding'].includes(trip.status)) return;
  trip.status = 'cancelled';
  if (trip.vehicleId) vehicleById(trip.vehicleId).tripId = null;
}

export function clearMyTrip() {
  fleet.trips = fleet.trips.filter((t) => t.id !== fleet.myTripId || isOngoing(t));
  fleet.myTripId = null;
}

/**
 * Live times in whole (demo) minutes, from the bus's current position.
 * @param {Trip} trip
 */
export function tripTimes(trip) {
  const times = { pickupMin: 0, arrivalMin: 0, boardingLeftMin: BOARDING_MIN };
  if (trip.vehicleId === null) return times;
  const vehicle = vehicleById(trip.vehicleId);
  const rideMin = distance(trip.from, trip.to) / SPEED;

  if (trip.status === 'to_pickup') {
    times.pickupMin = distance(vehicle, trip.from) / SPEED;
    times.arrivalMin = times.pickupMin + BOARDING_MIN + rideMin;
  } else if (trip.status === 'boarding') {
    times.boardingLeftMin = Math.max(0, (trip.boardingEndsAt - fleet.now) / 1000);
    times.arrivalMin = times.boardingLeftMin + rideMin;
  } else if (trip.status === 'riding') {
    times.arrivalMin = distance(vehicle, trip.to) / SPEED;
  }
  return {
    pickupMin: Math.ceil(times.pickupMin),
    arrivalMin: Math.ceil(times.arrivalMin),
    boardingLeftMin: Math.ceil(times.boardingLeftMin),
  };
}
