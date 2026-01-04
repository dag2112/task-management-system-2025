Task Management System - Full Stack Application
📋 Project Overview
A secure and scalable Task Management System built with Spring Boot REST API and React.js frontend. This full-stack web application implements role-based access control, task management with comments, notifications, and follows RESTful principles with JWT authentication. This project is developed as part of the Woldia University Web Service Project 2025 E.C.

🎯 Project Objectives
Design and implement RESTful services using Spring Boot

Consume REST APIs from a React.js frontend

Apply authentication and authorization using JWT

Implement collaborative task management with comments and notifications

Demonstrate proper API-Frontend integration

Work collaboratively using GitHub version control

🏗️ System Architecture
text
┌─────────────────┐     JSON + JWT     ┌─────────────────┐
│   React.js      │ ◄────────────────► │  Spring Boot    │
│     Frontend    │      REST API      │    Backend      │
└─────────────────┘                    └─────────────────┘
         │                                      │
         │                                      │
         ▼                                      ▼
  ┌──────────────┐                     ┌─────────────────┐
  │   Browser    │                     │   PostgreSQL    │
  │  LocalStorage│                     │   Database      │
  │   (JWT)      │                     └─────────────────┘
  └──────────────┘
🛠️ Technology Stack
Backend (Spring Boot)
Framework: Spring Boot 3.x

Language: Java 17

Security: Spring Security with JWT

ORM: Spring Data JPA (Hibernate)

Database: PostgreSQL

API Documentation: Swagger/OpenAPI 3.0

Build Tool: Maven

Validation: Bean Validation API

Frontend (React.js)
Framework: React 18

Routing: React Router DOM

HTTP Client: Axios

Styling: Tailwind CSS / Bootstrap

State Management: React Context API

Form Handling: React Hook Form

📊 Database Schema
Core Entities
User - System users with authentication

Task - Main task management entity

Comment - Task discussions and feedback

Notification - User alerts and notifications

Category - Task classification

🔐 Security Implementation
JWT Authentication Flow
User submits credentials via login endpoint

Backend validates credentials and generates JWT token

Token returned to frontend and stored

Token attached to Authorization header for subsequent requests

Spring Security validates token on protected endpoints

Protected Routes
Public Routes: Login, Register

User Routes: Dashboard, My Tasks, Profile

Admin Routes: All Users, All Tasks, System Settings

📱 Core Features
✅ User Management
User registration with validation

Password reset functionality

Profile management

Account activation/deactivation

Role management (Admin/User)

✅ Task Management
Create, Read, Update, Delete tasks

Task assignment to users

Priority levels (High, Medium, Low)

Status tracking (Pending, In Progress, Completed)

Due date management

Search and filter tasks

✅ Comments System
Task-specific comment threads

User mentions with notifications

Edit/delete comments (with permissions)

✅ Notifications
Real-time notifications

Notification center

Mark as read/unread

Task assignment alerts

✅ Advanced Features
Pagination: Efficient data loading

Search: Full-text search across tasks

Sorting: Sort by date, priority, status

Filtering: Filter by category, assignee, status

Responsive Design: Mobile-friendly interface

🗂️ Project Structure
Backend Structure
text
src/main/java/com/taskmanagement/
├── controller/             # REST controllers
├── service/               # Business logic layer
├── repository/            # Data access layer
├── model/                 # JPA entities
├── dto/                   # Data Transfer Objects
├── security/              # Security configuration
├── exception/             # Exception handling
└── util/                  # Utility classes
Frontend Structure (React)
text
src/
├── components/           # Reusable components
├── pages/               # Page components
├── services/            # API services
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── styles/              # CSS/Styles
├── App.js               # Main App component
└── index.js             # Entry point
🚀 Getting Started
Prerequisites
Java JDK 17 or higher

Node.js 18+ and npm

PostgreSQL

Git

Installation Steps
1. Clone the Repository
bash
git clone <repository-url>
cd task-management-system
2. Backend Setup
bash
cd backend

# Configure database connection in application.properties
# Update database URL, username, and password

# Build and run
mvn clean install
mvn spring-boot:run

# The backend will start on default port
3. Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# The frontend will start on default port
📡 API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

POST /api/auth/logout - User logout

POST /api/auth/refresh - Refresh token

Users
GET /api/users - Get all users (Admin only)

GET /api/users/{id} - Get user by ID

PUT /api/users/{id} - Update user

DELETE /api/users/{id} - Delete user

PUT /api/users/{id}/role - Update user role

Tasks
GET /api/tasks - Get tasks with pagination

POST /api/tasks - Create task

GET /api/tasks/{id} - Get task by ID

PUT /api/tasks/{id} - Update task

DELETE /api/tasks/{id} - Delete task

GET /api/tasks/search - Search tasks

Comments
GET /api/tasks/{taskId}/comments - Get task comments

POST /api/tasks/{taskId}/comments - Add comment

PUT /api/comments/{id} - Update comment

DELETE /api/comments/{id} - Delete comment

Notifications
GET /api/notifications - Get user notifications

PUT /api/notifications/{id}/read - Mark as read

DELETE /api/notifications/{id} - Delete notification

🎨 Frontend Pages
1. Authentication Pages
Login Page: User authentication

Register Page: New user registration

Forgot Password: Password recovery

2. Dashboard
Admin Dashboard: System overview, statistics

User Dashboard: Personal tasks, quick actions

3. Task Management
Task List: All tasks with filtering

Task Details: View/Edit single task

Create Task: New task form

4. User Management (Admin Only)
Users List: All system users

User Details: View/Edit user

Role Management: Assign/revoke roles

5. Profile
My Profile: Personal information

Settings: User preferences

6. Notifications
Notification Center: All notifications

🤝 GitHub Collaboration
Repository Structure
text
task-management-system/
├── backend/          # Spring Boot application
├── frontend/         # React.js application
└── README.md        # Project documentation
Branch Strategy
main - Production-ready code

develop - Development branch

feature/* - New features

bugfix/* - Bug fixes

Commit Convention
feat: New feature

fix: Bug fix

docs: Documentation

style: Code formatting

refactor: Code refactoring

test: Adding tests

🧪 Testing
Backend Tests
bash
# Run all tests
mvn test
Frontend Tests
bash
# Run tests
npm test
🚀 Deployment
Backend Deployment
bash
# Build JAR file
mvn clean package

# Run JAR
java -jar target/task-management.jar
Frontend Deployment
bash
# Build for production
npm run build

# Serve build
serve -s build
📄 API Documentation
Swagger UI
Access API documentation at default Swagger endpoint

🏆 Evaluation Criteria
Group Project (10 Points)
Complete Spring Boot REST API

Functional React.js UI

API-Frontend integration

JWT Security implementation

Code quality and documentation

System demonstration

Individual Participation (10 Points)
GitHub commit history

Code contribution quality

Issue resolution

Documentation updates

Team collaboration

📅 Project Timeline
Week	Tasks
1	Requirements, Design, Setup
2	Backend: User Management
3	Backend: Task Management
4	Backend: Security & Validation
5	Frontend: Auth & Layout
6	Frontend: Task Management
7	Integration & Testing
8	Deployment & Documentation
🆘 Troubleshooting
Common Issues
Database Connection Failed

Check PostgreSQL service status

Verify credentials in application.properties

CORS Errors

Configure CORS properly in Spring Security

Check frontend API URL configuration

JWT Token Issues

Verify token storage in frontend

Check token expiration

Build Failures

Clean and rebuild project

Check dependency versions

👥 Team Members & Roles
Name	Role	Responsibilities
[Student 1]	Backend Lead	API Development, Security
[Student 2]	Frontend Lead	UI Development
[Student 3]	Database Admin	Database Design
[Student 4]	Full Stack	Integration, Testing
[Student 5]	DevOps	Deployment
📚 References
Documentation Links
Spring Boot Official Documentation

React Documentation

Spring Security Documentation

PostgreSQL Documentation

📞 Support
For technical issues:

Check the troubleshooting section

Review GitHub Issues

Contact team members

Refer to official documentation

Project Status: Active Development
Last Updated: December 2025
Version: 1.0.0

*Developed as part of Woldia University Institute of Technology - Software Engineering 5th Year Web Service Project 2025 E.C*

