import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Import the CSS file for styling

interface DashboardData {
    totalStudents: number;
    vaccinatedStudents: number;
    vaccinatedPercentage: number;
    upcomingDriveDates: string[];
}

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/dashboard/data');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data: DashboardData = await response.json();
                setDashboardData(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchDashboardData();
    }, []);

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
                        {dashboardData.upcomingDriveDates.length > 0 ? (
                            <ul>
                                {dashboardData.upcomingDriveDates.map((date, index) => (
                                    <li key={index}>{date}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">No upcoming drives scheduled.</p>
                        )}
                    </div>
                    <div className="quick-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/manage-students">Manage Students</a></li>
                            <li><a href="/vaccination-drives">Manage Vaccination Drives</a></li>
                            <li><a href="/reports">View Reports</a></li>
                        </ul>
                    </div>
                </>
            ) : (
                <p className="loading-message">Loading dashboard data...</p>
            )}
        </div>
    );
};

export default Dashboard;