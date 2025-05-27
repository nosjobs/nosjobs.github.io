import * as pool from '$lib/nostr/pool'
import { writable } from 'svelte/store'

export const nostrProfile = writable(null)

// Load pubkey from localStorage if available
if (typeof localStorage !== 'undefined') {
  const stored = localStorage.getItem('nostr_pubkey')
  if (stored) nostrProfile.set(JSON.parse(stored))
}

// Optional helper to login
export async function loginWithNostr() {
  if (!window.nostr || !window.nostr.getPublicKey) {
    alert('Nostr extension not available')
    return
  }

  try {
    const pubkey = await window.nostr?.getPublicKey()
    const filters = { 
      kinds: [0],
      authors: [pubkey],
    }
    let profile = await pool.get(filters)
    profile = { ...JSON.parse(profile.content), pubkey: profile.pubkey }

    localStorage.setItem('nostr_pubkey', JSON.stringify(profile))
    nostrProfile.set(profile)
  } catch (err) {
    console.error('Nostr login failed:', err)
  }
}

// Optional helper to logout
export function logoutNostr() {
  localStorage.removeItem('nostr_pubkey')
  nostrProfile.set(null)
  //window.location.reload()
}

