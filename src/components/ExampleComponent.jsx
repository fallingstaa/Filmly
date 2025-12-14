// ExampleComponent.jsx
// Demonstrates usage of API functions: fetchFestivals and submitFilm
// Shows festivals on mount and a form to submit a film

import React, { useEffect, useState } from 'react';
import { fetchFestivals, submitFilm } from '../api/api';

const ExampleComponent = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', director: '', year: '' });
  const [submitResult, setSubmitResult] = useState(null);

  // Fetch festivals on mount
  useEffect(() => {
    setLoading(true);
    fetchFestivals().then(res => {
      if (res.error) setError(res.error.message);
      else setFestivals(res.data || []);
      setLoading(false);
    });
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  // ExampleComponent.jsx
  // Demonstrates usage of API functions: fetchFestivals and submitFilm
  // Shows festivals on mount and a form to submit a film

  // Import React and hooks
    setLoading(true);
  // Import API functions
    const res = await submitFilm(form);
    if (res.error) setSubmitResult('Error: ' + res.error.message);
    else setSubmitResult('Film submitted!');
    // State for festivals, loading, error, form, and submit result
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>Festivals</h2>
    // Fetch festivals on mount
    useEffect(() => {
      setLoading(true);
      fetchFestivals().then(res => {
        if (res.error) setError(res.error.message); // Handle error
        else setFestivals(res.data || []); // Set festivals data
        setLoading(false);
      });
    }, []);
      <form onSubmit={handleSubmit}>
    // Handle form input changes
    const handleChange = e => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
          onChange={handleChange}
    // Handle form submit
    const handleSubmit = async e => {
      e.preventDefault();
      setSubmitResult(null);
      setLoading(true);
      // Call submitFilm API
      const res = await submitFilm(form);
      if (res.error) setSubmitResult('Error: ' + res.error.message); // Show error
      else setSubmitResult('Film submitted!'); // Show success
      setLoading(false);
    };
        <br />
        <input
          name="year"
          placeholder="Year"
        {/* Show loading or error */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* List festivals */}
        <ul>
          {festivals.map(f => (
            <li key={f.id}>{f.name} ({f.year})</li>
          ))}
        </ul>
      {submitResult && <p>{submitResult}</p>}
    </div>
        {/* Film submission form */}
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="director"
            placeholder="Director"
            value={form.director}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" disabled={loading}>Submit</button>
        </form>
        {/* Show result of submission */}
        {submitResult && <p>{submitResult}</p>}
