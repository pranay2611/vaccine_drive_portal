import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Import the CSS file for styling

interface VaccinationDrive {
    id: number;
    vaccineName: string;
    driveDate: string;
    availableDoses: number;
    applicableClasses: string;
}

interface DashboardData {
    totalStudents: number;
    vaccinatedStudents: number;
    vaccinatedPercentage: number;
    upcomingDrives: VaccinationDrive[];
}

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch dashboard data from /api/dashboard/data
                const response = await fetch('http://localhost:8080/api/dashboard/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data: DashboardData = await response.json();

                // Set the dashboard data
                setDashboardData(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        const fetchUserRole = () => {
            // Fetch user role from local storage
            const storedRole = localStorage.getItem('userRole'); // Get the role from local storage
            if (storedRole) {
                setUserRole(storedRole.toLowerCase()); // Convert to lowercase for case-insensitive comparison
            }
        };

        fetchDashboardData();
        fetchUserRole();
    }, []);

    const handleBookDrive = (driveId: number) => {
        // Logic to handle booking a vaccination drive
        console.log(`Booking drive with ID: ${driveId}`);
        alert(`You have successfully booked the vaccination drive with ID: ${driveId}`);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard Overview</h1>
            {error && <p className="error-message">{error}</p>}
            {dashboardData ? (
                <>
                    <div className="metrics">
                        <div className="metric">
                            <h3>Total Students</h3>
                            <p>{dashboardData.totalStudents}</p>
                        </div>
                        <div className="metric">
                            <h3>Vaccinated Students</h3>
                            <p>{dashboardData.vaccinatedStudents}</p>
                        </div>
                        <div className="metric">
                            <h3>Vaccination Percentage</h3>
                            <p>{dashboardData.vaccinatedPercentage.toFixed(2)}%</p>
                        </div>
                    </div>
                    <div className="upcoming-drives">
                        <h3>Upcoming Vaccination Drives</h3>
                        {dashboardData.upcomingDrives.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Vaccine Name</th>
                                        <th>Drive Date</th>
                                        <th>Available Doses</th>
                                        <th>Applicable Classes</th>
                                        {userRole?.toLowerCase() === 'student' && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.upcomingDrives.map((drive) => (
                                        <tr key={drive.id}>
                                            <td>{drive.id}</td>
                                            <td>{drive.vaccineName}</td>
                                            <td>{drive.driveDate}</td>
                                            <td>{drive.availableDoses}</td>
                                            <td>{drive.applicableClasses}</td>
                                            {userRole?.toLowerCase() === 'student' && (
                                                <td>
                                                    <button className="book-btn" onClick={() => handleBookDrive(drive.id)}>Book</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="empty-state">No upcoming drives scheduled.</p>
                        )}
                    </div>
                    {userRole?.toLowerCase() !== 'student' && (
                        <div className="quick-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="/manage-students">Manage Students</a></li>
                                <li><a href="/vaccination-drives">Manage Vaccination Drives</a></li>
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p className="loading-message">Loading dashboard data...</p>
            )}
        </div>
    );
};

export default Dashboard;