import React, { useState, useCallback } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

const NavSearch = () => {
    // State for search term, error, and loading
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initialize useNavigate
    const navigate = useNavigate();

    // Function to handle search
    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch user data based on the search term
            const response = await fetch(`http://localhost:5001/photo-sharing-app-354f6/us-central1/getUsers?search=${searchTerm}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // If a user is found, navigate to the artist's profile page
            if (data.length > 0) {
                navigate(`/artistprofile/${data[0].uid}`);
            } else {
                setError('No user found with this email.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, navigate]);

    // Debounce the search function
    const debouncedSearch = debounce(handleSearch, 300);

    return (
        <div>
            {/* Search form */}
            <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); debouncedSearch(); }}>
                <Form.Control
                    type="search"
                    placeholder="Search by email"
                    className="me-2"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-success" type="submit" disabled={loading}>Search</Button>
            </Form>
            {/* Loading indicator */}
            {loading && <p>Loading...</p>}
            {/* Display error if there's an issue */}
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
    );
};

export default NavSearch;




