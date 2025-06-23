"use client"
import React, { useState } from 'react';

export default function HostDashboard() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: 8 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Host Dashboard</h1>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Post a New Listing</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                    type="text"
                    name="title"
                    placeholder="Listing Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price per night"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min={0}
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: 10, borderRadius: 4, background: '#ff6600', color: '#fff', border: 'none', fontWeight: 'bold' }}>
                    Post Listing
                </button>
            </form>
            {submitted && (
                <div style={{ marginTop: 24, background: '#f6f6f6', padding: 16, borderRadius: 6 }}>
                    <h3>Listing Preview</h3>
                    <p><strong>Title:</strong> {form.title}</p>
                    <p><strong>Description:</strong> {form.description}</p>
                    <p><strong>Price:</strong> ${form.price} per night</p>
                    {form.imageUrl && <img src={form.imageUrl} alt="Listing" style={{ width: '100%', borderRadius: 4, marginTop: 8 }} />}
                </div>
            )}
        </div>
    );
}
