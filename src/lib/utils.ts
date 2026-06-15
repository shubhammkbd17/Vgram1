import { clsx, type ClassValue } from 'clsx';
import { PureComponent } from 'react';

// Standard classnames merger helper
export function cn(...inputs: ClassValue[]) {
  // Simple fallback split/join as we don't have tailwind-merge installed, or we can just use clsx
  return inputs.filter(Boolean).join(' ');
}

/**
 * Calculates the distance between two coordinates in kilometers.
 * Uses the Haversine formula.
 */
export function haversineDistance(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined
): number | null {
  if (lat1 === null || lat1 === undefined ||
      lon1 === null || lon1 === undefined ||
      lat2 === null || lat2 === undefined ||
      lon2 === null || lon2 === undefined) {
    return null;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}
