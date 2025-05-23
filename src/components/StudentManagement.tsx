import React, { useState, useEffect } from 'react';
import '../styles/StudentManagement.css';

interface Student {
    id: number;
    name: string;
    age: number;
    standards: number;
    email: string;
    vaccinationRecord?: {
        vaccineName: string;
        dateAdministered: string;
        isFullyVaccinated: boolean;
    };
}

const StudentManagement: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string>('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', age: '', standards: '', email: '' });
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // State for selected student
    const [showModal, setShowModal] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [vaccineFilter, setVaccineFilter] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/students');
            if (!response.ok) {
                throw new Error('Failed to fetch students.');
            }
            const data: Student[] = await response.json();
            setStudents(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return;

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await fetch('http://localhost:8080/api/students/bulk-upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload CSV.');
            }

            fetchStudents();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newStudent.name,
                    age: parseInt(newStudent.age),
                    standards: parseInt(newStudent.standards),
                    email: newStudent.email,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add student.');
            }

            setShowAddForm(false);
            setNewStudent({ name: '', age: '', standards: '', email: '' });
            fetchStudents();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission from reloading the page
    
        if (!selectedStudent) return;
    
        try {
            const response = await fetch(`http://localhost:8080/api/students/${selectedStudent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: selectedStudent.name,
                    age: selectedStudent.age,
                    email: selectedStudent.email,
                    standards: selectedStudent.standards,
                    vaccinationRecord: selectedStudent.vaccinationRecord || null, // Include vaccination record if available
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update student.');
            }
    
            // Update the student list locally
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === selectedStudent.id ? selectedStudent : student
                )
            );
    
            // Close the modal
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesName = nameFilter
            ? student.name.toLowerCase().includes(nameFilter.toLowerCase())
            : true; // Include all students if nameFilter is empty
        const matchesVaccine = vaccineFilter
            ? student.vaccinationRecord?.vaccineName
                  ?.toLowerCase()
                  .includes(vaccineFilter.toLowerCase())
            : true; // Include all students if vaccineFilter is empty
        return matchesName && matchesVaccine;
    });

    const handleEditStudent = (student: Student) => {
        setSelectedStudent({
            ...student,
            vaccinationRecord: student.vaccinationRecord || {
                vaccineName: '',
                dateAdministered: '',
                isFullyVaccinated: false,
            },
        });
        setShowModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setSelectedStudent(null); // Clear the selected student
    };

    const handleDownloadReport = () => {
        if (filteredStudents.length === 0) {
            alert('No data available to download.');
            return;
        }
    
        // Generate CSV content
        const headers = ['ID', 'Name', 'Age', 'Standards', 'Vaccine Name', 'Date Administered'];
        const rows = filteredStudents.map((student) => [
            student.id,
            student.name,
            student.age,
            student.standards,
            student.vaccinationRecord?.vaccineName || '-',
            student.vaccinationRecord?.dateAdministered || '-',
        ]);
    
        const csvContent =
            [headers, ...rows]
                .map((row) => row.map((value) => `"${value}"`).join(',')) // Escape values with quotes
                .join('\n');
    
        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="student-management-container">
            <h1>Student Management</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="actions">
                <button onClick={() => setShowAddForm(true)}>Add Student</button>
            </div>

            {showAddForm && (
                <div className="add-student-form">
                    <h2>Add Student</h2>
                    <form onSubmit={handleAddStudent}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={newStudent.age}
                            onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Standards"
                            value={newStudent.standards}
                            onChange={(e) => setNewStudent({ ...newStudent, standards: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                            required
                        />
                        <div className="button-group">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="csv-upload-section">
                <h2>Add Students by Uploading CSV</h2>
                <div className="csv-upload">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <button onClick={handleCsvUpload}>Upload CSV</button>
                </div>
            </div>

            <div className="student-list">
                <div className="student-list-header">
                    <h2>Students</h2>
                    <button className="download-report-btn" onClick={handleDownloadReport}>
                        Download Report
                    </button>
                </div>
                {/* Filter Section */}
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Filter by Name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Vaccine Name"
                        value={vaccineFilter}
                        onChange={(e) => setVaccineFilter(e.target.value)}
                    />
                </div>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Standards</th>
                            <th>Vaccine Name</th>
                            <th>Date Administered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.standards}</td>
                                <td>
                                    {student.vaccinationRecord?.vaccineName || '-'}
                                </td>
                                <td>
                                    {student.vaccinationRecord?.dateAdministered || '-'}
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditStudent(student)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Inline Edit Form */}
            {selectedStudent && (
                <div className="edit-form">
                    <h3>Edit Student</h3>
                    <form onSubmit={handleUpdateStudent} className="edit-student-form">
                        <div className="form-row">
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={selectedStudent.name}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Age:
                                <input
                                    type="number"
                                    value={selectedStudent.age}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            age: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Standards:
                                <input
                                    type="number"
                                    value={selectedStudent.standards}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            standards: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    value={selectedStudent.email}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                Vaccine Name:
                                <input
                                    type="text"
                                    value={selectedStudent.vaccinationRecord?.vaccineName || ''}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            vaccinationRecord: {
                                                ...selectedStudent.vaccinationRecord,
                                                vaccineName: e.target.value,
                                                dateAdministered: selectedStudent.vaccinationRecord?.dateAdministered || '',
                                                isFullyVaccinated: selectedStudent.vaccinationRecord?.isFullyVaccinated || false,
                                            },
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Date Administered:
                                <input
                                    type="date"
                                    value={
                                        selectedStudent.vaccinationRecord?.dateAdministered ||
                                        new Date().toISOString().split('T')[0]
                                    }
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            vaccinationRecord: {
                                                ...selectedStudent.vaccinationRecord,
                                                dateAdministered: e.target.value,
                                                vaccineName: selectedStudent.vaccinationRecord?.vaccineName || '',
                                                isFullyVaccinated: selectedStudent.vaccinationRecord?.isFullyVaccinated || false,
                                            },
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Fully Vaccinated:
                                <input
                                    type="checkbox"
                                    checked={!!selectedStudent.vaccinationRecord?.isFullyVaccinated}
                                    onChange={(e) =>
                                        setSelectedStudent({
                                            ...selectedStudent,
                                            vaccinationRecord: {
                                                ...selectedStudent.vaccinationRecord,
                                                isFullyVaccinated: e.target.checked,
                                                vaccineName: selectedStudent.vaccinationRecord?.vaccineName || '',
                                                dateAdministered: selectedStudent.vaccinationRecord?.dateAdministered || '',
                                            },
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className="button-group">
                            <button type="button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;