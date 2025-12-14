// api.js
// Provides API functions for fetching festivals, submitting films, and handling payments.
// Uses Supabase and ABA PayWay. Handles errors and uses environment variables.

import supabase from './supabaseClient';

// Fetch all festivals from Supabase
export async function fetchFestivals() {
  try {
    const { data, error } = await supabase
      .from('festivals')
      .select('*');
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

// Submit a film to Supabase
export async function submitFilm(filmData) {
  try {
    const { data, error } = await supabase
      .from('films')
      .insert([filmData])
      .select();
    if (error) throw error;
    return { data };
  } catch (error) {
    return { error };
  }
}

// Call backend endpoint to handle ABA PayWay payment
export async function payWithABA(paymentPayload) {
  try {
    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Payment failed');
    return { data: result };
  } catch (error) {
    return { error };
  }
}
const BASE_URL = "http://localhost:3001"; // backend URL

export const fetchFestivals = async () => {
  const response = await fetch(`${BASE_URL}/festivals`);
  return response.json();
};

export const submitFilm = async (filmData) => {
  const response = await fetch(`${BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filmData),
  });
  return response.json();
};
