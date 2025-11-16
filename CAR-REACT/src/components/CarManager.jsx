import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config.js';
import './style.css'; 

const CarManager = () => {
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState({
    id: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    status: 'Available'
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedCar, setFetchedCar] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/carapi`;

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setMessage('Failed to fetch cars.');
    }
  };

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!car.brand || !car.model || !car.year || !car.price) {
      setMessage("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const addCar = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, car);
      setMessage('Car added successfully.');
      fetchCars();
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage('Error adding car.');
    }
  };

  const updateCar = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, car);
      setMessage('Car updated successfully.');
      fetchCars();
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage('Error updating car.');
    }
  };

  const deleteCar = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchCars();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting car.');
    }
  };

  const getCarById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedCar(res.data);
      setMessage('');
    } catch {
      setFetchedCar(null);
      setMessage('Car not found.');
    }
  };

  const handleEdit = (c) => {
    setCar(c);
    setEditMode(true);
    setMessage(`Editing car with ID ${c.id}`);
  };

  const resetForm = () => {
    setCar({
      id: '',
      brand: '',
      model: '',
      year: '',
      price: '',
      status: 'Available'
    });
    setEditMode(false);
  };

  return (
    <>
      <nav className="top-nav">
        <h1>Car Management Dashboard</h1>
      </nav>
      <div className="car-container">
        {message && (
          <div className={`message ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <h2>Car Management</h2>

        {/* Add / Update Form */}
        <div>
          <h3>{editMode ? 'Edit Car' : 'Add Car'}</h3>
          <div className="form-grid">
            {editMode && (
              <input
                type="text"
                name="id"
                placeholder="ID (Read-Only)"
                value={car.id}
                readOnly
              />
            )}
            <input type="text" name="brand" placeholder="Brand" value={car.brand} onChange={handleChange} />
            <input type="text" name="model" placeholder="Model" value={car.model} onChange={handleChange} />
            <input type="number" name="year" placeholder="Year" value={car.year} onChange={handleChange} />
            <input type="number" step="0.01" name="price" placeholder="Price" value={car.price} onChange={handleChange} />
            <select name="status" value={car.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="btn-group">
            {!editMode ? (
              <button className="btn-blue" onClick={addCar}>Add Car</button>
            ) : (
              <>
                <button className="btn-green" onClick={updateCar}>Update Car</button>
                <button className="btn-gray" onClick={resetForm}>Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* Fetch by ID */}
        <div>
          <h3>Get Car By ID</h3>
          <input type="number" placeholder="Enter ID" value={idToFetch} onChange={(e) => setIdToFetch(e.target.value)} />
          <button className="btn-blue" onClick={getCarById}>Fetch</button>
          {fetchedCar && (
            <div>
              <h4>Car Found:</h4>
              <pre>{JSON.stringify(fetchedCar, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* All Cars */}
        <div>
          <h3>All Cars</h3>
          {cars.length === 0 ? (
            <p>No cars found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.brand}</td>
                    <td>{c.model}</td>
                    <td>{c.year}</td>
                    <td>{c.price}</td>
                    <td>{c.status}</td>
                    <td>
                      <button className="btn-green" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="btn-red" onClick={() => deleteCar(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default CarManager;
