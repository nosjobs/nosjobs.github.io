import { SimplePool } from 'nostr-tools'

const pool = new SimplePool()

let relays = []

if (import.meta.env.MODE === 'development') {
  relays = ['ws://localhost:4869']
} else {
  relays = [
    'wss://relay.damus.io',
    'wss://nostr.mom/',
    'wss://relay.nostr.band',
    'wss://relay.8333.space',
    'wss://nostr-pub.wellorder.net',
    'wss://nostr.oxtr.dev',
    'wss://nos.lol'
  ]
}

// Export a function to get the pool and relays
//export function getPool() {
//  return { pool, relays }
//}

/**
 * Subscribe using default relays and new-style options
 * @param {object[]} filters - Nostr filters
 * @param {object} opts - { onevent, oneose, ... } handlers
 * @returns {Subscription}
 */
export function subscribe(filters, opts = {}) {
  return pool.subscribe(relays, filters, opts)
}

export function querySync(filters) {
  return pool.querySync(relays, filters)
}

export function get(filters) {
  return pool.get(relays, filters)
}

// Publish with default relays
export function publish(event) {
  return pool.publish(relays, event)
}
