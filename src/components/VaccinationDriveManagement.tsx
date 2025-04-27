import React, { useState, useEffect } from 'react';
import '../styles/VaccinationDriveManagement.css';

const VaccinationDriveManagement: React.FC = () => {
    const [drives, setDrives] = useState([]);
    const [newDrive, setNewDrive] = useState({
        id: null, // Add an ID field for editing
        vaccineName: '',
        driveDate: '',
        availableDoses: '',
        applicableClasses: '',
        active: false,
    });
    const [error, setError] = useState<string>('');
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/vaccination-drives');
            if (!response.ok) {
                throw new Error('Failed to fetch vaccination drives.');
            }
            const data = await response.json();
    
            // Map the API response to include isActive
            const mappedDrives = data.map((drive: any) => ({
                ...drive,
                isActive: drive.active, // Map active to isActive
            }));
    
            setDrives(mappedDrives);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddOrUpdateDrive = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = newDrive.id ? 'PUT' : 'POST'; // Use PUT for updates, POST for new drives
            const url = newDrive.id
                ? `http://localhost:8080/api/vaccination-drives/${newDrive.id}`
                : 'http://localhost:8080/api/vaccination-drives';

            console.log('Payload:', newDrive);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDrive),
            });

            if (!response.ok) {
                // Handle 400 response code
                if (response.status === 400) {
                    const errorData = await response.json(); // Parse the error response
                    throw new Error(errorData.message || 'Invalid input. Please check the form.');
                }
                throw new Error('Failed to save vaccination drive.');
            }

            // Clear the error message on success
            setError('');

            // Reset the form fields
            setNewDrive({
                id: null,
                vaccineName: '',
                driveDate: '',
                availableDoses: '',
                applicableClasses: '',
                active: false,
            });

            setShowForm(false); // Close the form after submission
            fetchDrives(); // Refresh the list of drives
        } catch (err: any) {
            setError(err.message); // Display the error message
        }
    };

    const handleEditDrive = (drive: any) => {
        setNewDrive({
            id: drive.id,
            vaccineName: drive.vaccineName,
            driveDate: drive.driveDate,
            availableDoses: drive.availableDoses,
            applicableClasses: drive.applicableClasses,
            active: drive.active, // Map the active property to isActive
        });
        setShowForm(true); // Show the form for editing
    };

    return (
        <div className="vaccination-drive-management-container">
            <h1>Vaccination Drive Management</h1>
            {error && <p className="error-message">{error}</p>}

            {/* Add Vaccination Drive Button */}
            <button
                className="add-drive-btn"
                onClick={() => {
                    setNewDrive({
                        id: null,
                        vaccineName: '',
                        driveDate: '',
                        availableDoses: '',
                        applicableClasses: '',
                        active: false,
                    });
                    setShowForm(!showForm); // Toggle form visibility
                }}
            >
                {showForm ? 'Close Form' : 'Add Vaccination Drive'}
            </button>

            {/* Vaccination Drive Form */}
            {showForm && (
                <form onSubmit={handleAddOrUpdateDrive}>
                    <input
                        type="text"
                        placeholder="Vaccine Name"
                        value={newDrive.vaccineName}
                        onChange={(e) => setNewDrive({ ...newDrive, vaccineName: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Drive Date"
                        value={newDrive.driveDate}
                        onChange={(e) => setNewDrive({ ...newDrive, driveDate: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Available Doses"
                        value={newDrive.availableDoses}
                        onChange={(e) =>
                            setNewDrive({ ...newDrive, availableDoses: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Applicable Classes (e.g., 5-7)"
                        value={newDrive.applicableClasses}
                        onChange={(e) =>
                            setNewDrive({ ...newDrive, applicableClasses: e.target.value })
                        }
                        required
                    />
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={newDrive.active}
                            onChange={(e) => setNewDrive({ ...newDrive, active: e.target.checked })}
                        />
                        Active
                    </label>
                    <button type="submit">{newDrive.id ? 'Update Drive' : 'Add Drive'}</button>
                </form>
            )}

            <h2>Scheduled Drives</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vaccine Name</th>
                        <th>Drive Date</th>
                        <th>Available Doses</th>
                        <th>Applicable Classes</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drives.map((drive: any) => (
                        <tr key={drive.id}>
                            <td>{drive.id}</td>
                            <td>{drive.vaccineName}</td>
                            <td>{drive.driveDate}</td>
                            <td>{drive.availableDoses}</td>
                            <td>{drive.applicableClasses}</td>
                            <td>{drive.isActive ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleEditDrive(drive)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VaccinationDriveManagement;