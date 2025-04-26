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
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string>('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', age: '', standards: '', email: '' });
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // State for selected student
    const [showModal, setShowModal] = useState(false);

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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

    const handleMarkVaccinated = async (studentId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/students/${studentId}/update_vaccination`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vaccineName: 'COVID-19',
                    dateAdministered: new Date().toISOString().split('T')[0],
                    isFullyVaccinated: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update vaccination record.');
            }

            // Update the student's vaccination status locally
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === studentId
                        ? {
                              ...student,
                              vaccinationRecord: {
                                  vaccineName: 'COVID-19',
                                  dateAdministered: new Date().toISOString().split('T')[0],
                                  isFullyVaccinated: true,
                              },
                          }
                        : student
                )
            );
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredStudents = students
    .filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id); // Sort by ID in ascending order

    const handleEditStudent = (student: Student) => {
        console.log('Opening modal for student:', student);
        setSelectedStudent(student); // Set the selected student
        setShowModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setSelectedStudent(null); // Clear the selected student
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

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, class, ID, or vaccination status"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="csv-upload">
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                />
                <button onClick={handleCsvUpload}>Upload CSV</button>
            </div>

            <div className="student-list">
                <h2>Students</h2>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Standards</th>
                            <th>Vaccinated</th>
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
                                    {student.vaccinationRecord ? (
                                        <span className="vaccinated-status">Yes</span>
                                    ) : (
                                        <button
                                            className="mark-vaccinated-btn"
                                            onClick={() => handleMarkVaccinated(student.id)}
                                        >
                                            Mark Vaccinated
                                        </button>
                                    )}
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
                    <form onSubmit={handleUpdateStudent}>
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
                        <label>
                            Vaccinated:
                            <input
                                type="checkbox"
                                checked={!!selectedStudent.vaccinationRecord?.isFullyVaccinated}
                                onChange={(e) =>
                                    setSelectedStudent({
                                        ...selectedStudent,
                                        vaccinationRecord: {
                                            vaccineName: selectedStudent.vaccinationRecord?.vaccineName || 'COVID-19', // Default vaccine name
                                            dateAdministered:
                                                selectedStudent.vaccinationRecord?.dateAdministered ||
                                                new Date().toISOString().split('T')[0], // Default to today's date
                                            isFullyVaccinated: e.target.checked,
                                        },
                                    })
                                }
                            />
                        </label>
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