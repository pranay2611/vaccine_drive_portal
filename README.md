# Vaccine Drive Portal

This project is a React application designed to facilitate a vaccine drive portal. It includes user authentication features such as login and signup pages, a dashboard for an overview, and management modules for students and vaccination drives.

## Project Structure

```
vaccine-drive-portal
├── public
│   ├── index.html        # Main HTML file for the application
│   └── favicon.ico       # Favicon for the application
├── src
│   ├── components
│   │   ├── Auth.tsx                         # Component for managing login/signup tabs
│   │   ├── Dashboard.tsx                    # Component for the dashboard overview
│   │   ├── Login.tsx                        # Component for the login form
│   │   ├── Signup.tsx                       # Component for the signup form
│   │   ├── StudentManagement.tsx            # Component for managing students
│   │   └── VaccinationDriveManagement.tsx   # Component for managing vaccination drives
│   ├── pages
│   │   ├── LoginPage.tsx                    # Page component for login
│   │   └── SignupPage.tsx                   # Page component for signup
│   ├── styles
│   │   ├── Dashboard.css                    # Styles for the dashboard component
│   │   ├── Login.css                        # Styles for the login component
│   │   ├── Signup.css                       # Styles for the signup component
│   │   ├── StudentManagement.css            # Styles for the student management component
│   │   └── VaccinationDriveManagement.css   # Styles for the vaccination drive management component
│   ├── App.tsx                              # Main application component with routing
│   ├── index.tsx                            # Entry point of the application
├── package.json                             # npm configuration file
├── tsconfig.json                            # TypeScript configuration file
└── README.md                                # Project documentation
```

## Features

- **User Authentication**: Login and signup forms with validation.
- **Dashboard Overview**: Displays key metrics and upcoming vaccination drives.
- **Student Management**: Add, edit, and filter student records. Supports CSV upload and report download.
- **Vaccination Drive Management**: Schedule, edit, and manage vaccination drives.
- **Responsive Design**: Optimized for various screen sizes.
- **Role-Based Actions**: Different actions available for students and administrators.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```sh
   cd vaccine-drive-portal
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   npm start
   ```

## API Endpoints

The application interacts with the following API endpoints:

- **Authentication**:
  - `POST /api/auth/signup`: Register a new user.
  - `POST /api/auth/login`: Authenticate a user and retrieve a token.

- **Dashboard**:
  - `GET /api/dashboard/data`: Fetch dashboard metrics and upcoming drives.

- **Student Management**:
  - `GET /api/students`: Retrieve all students.
  - `POST /api/students`: Add a new student.
  - `PUT /api/students/:id`: Update a student's details.
  - `POST /api/students/bulk-upload`: Upload students via CSV.

- **Vaccination Drive Management**:
  - `GET /api/vaccination-drives`: Retrieve all vaccination drives.
  - `POST /api/vaccination-drives`: Add a new vaccination drive.
  - `PUT /api/vaccination-drives/:id`: Update a vaccination drive.
