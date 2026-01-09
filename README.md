# Task Management System - Full Stack Application

##  Project Overview
A secure and scalable Task Management System built with Spring Boot REST API and React.js frontend. This full-stack web application implements role-based access control, task management with comments, notifications, and follows RESTful principles with JWT authentication. This project is developed as part of the Woldia University Web Service Project 2025 E.C.

##  Project Objectives
- Design and implement RESTful services using Spring Boot
- Consume REST APIs from a React.js frontend
- Apply authentication and authorization using JWT
- Implement collaborative task management with comments and notifications 
- Demonstrate proper API-Frontend integration
- Work collaboratively using GitHub version control

##  Technology Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot 
- **Language**: Java 
- **Security**: Spring Security with JWT
- **ORM**: Spring Data JPA (Hibernate)
- **Database**: PostgreSQL
- **API Documentation**: Swagger/OpenAPI 
- **Build Tool**: Maven
- **Validation**: Bean Validation API

### Frontend (React.js)
- **Framework**: React 
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS / Bootstrap
- **State Management**: React Context API
- **Form Handling**: React Hook Form

##  Database Schema

### Core Entities
- **User**: System users with authentication
- **Task**: Main task management entity
- **Comment**: Task discussions and feedback
- **Notification**: User alerts and notifications
- **Category**: Task classification

##  Security Implementation

### JWT Authentication Flow
1. User submits credentials via login endpoint
2. Backend validates credentials and generates JWT token
3. Token returned to frontend and stored
4. Token attached to Authorization header for subsequent requests
5. Spring Security validates token on protected endpoints

### Protected Routes
- **Public Routes**: Login, Register
- **User Routes**: Dashboard, My Tasks, Profile
- **Admin Routes**: All Users, All Tasks, System Settings

##  Core Features

### User Management
- User registration with validation
- Password reset functionality
- Profile management
- Account activation/deactivation
- Role management (Admin/User)

### Task Management
- Create, Read, Update, Delete tasks
- Task assignment to users
- Priority levels (High, Medium, Low)
- Status tracking (Pending, In Progress, Completed) 
- Due date management
- Search and filter tasks

### Comments System
- Task-specific comment threads
- User mentions with notifications
- Edit/delete comments (with permissions)

### Notifications
- Notification center
- Mark as read/unread
- Task assignment alerts

### Advanced Features
- Pagination: Efficient data loading
- Search: Full-text search across tasks
- Sorting: Sort by date, priority, status
- Filtering: Filter by category, assignee, status
- Responsive Design: Mobile-friendly interface

## 🗂️ Project Structure
## Backend 
## 📂 Directory Structure Explanation

### **📁 controller/**
Contains REST controllers that handle HTTP requests and responses. Each controller delegates business logic to services and returns appropriate HTTP responses.

### **📁 service/**
Contains business logic implementation. Services handle transaction management, business rules, and coordinate between controllers and repositories.

### **📁 repository/**
Contains Spring Data JPA repositories that handle database operations. Each repository extends `JpaRepository` for CRUD operations.

### **📁 model/**
Contains JPA entity classes that map to database tables. Entities define the data model and relationships.

### **📁 dto/**
Contains Data Transfer Objects for request/response handling. Separates API layer from database entities.
- **📁 request/**: DTOs for incoming API requests
- **📁 response/**: DTOs for API responses

### **📁 security/**
Contains security-related classes, including JWT authentication, authorization configuration, and user details service.

### **📁 exception/**
Contains custom exceptions and a global exception handler for consistent error responses across the application.

## Frontend

## 📁 React Application Structure

### 📂 Directory Structure Explanation

### **📁 assets/**
Contains static resources:
- Images, icons, and media files
- Style-related assets
- Font files and other static content

### **📁 components/**
Contains reusable UI components:
- Building blocks for the user interface
- Navbar component
- Other reusable component files

### **📁 pages/**
Contains page components:
- Route-based page components
- Full page layouts and views
- Page-specific functionality

### **App.jsx**
The main application component:
- Application root component
- Routing configuration
- Global providers and wrappers

### **index.css**
Global CSS stylesheet:
- Global styles and resets
- CSS variables and custom properties
- Common utility classes

### **main.jsx**
The application entry point:
- React application initialization
- DOM mounting point
- Application bootstrap

  ##  Getting Started

### Prerequisites
- Java JDK 17 or higher
- Node.js 18+ and npm
- PostgreSQL
- Git

### Installation Steps
1. **Clone the Repository**

### Backend Setup
cd backend
## Configure database connection in application.properties
## Update database URL, username, and password

### Build and run
mvn clean install
mvn spring-boot:run

### The backend will start on default port 

### Frontend Setup
cd frontend
### Install dependencies
npm install

### Start development server
npm run dev

## The frontend will start on default port 

## API Endpoints

## User Management

### User Registration
- **POST** `/api/user/register`  
  Registers a new user.

### Get All Users
- **GET** `/api/user/getAllUsers`  
  Retrieves a list of all users (Admin only).

### Update User
- **PUT** `/api/user/update/{id}`  
  Updates a specific user by ID (Admin only).

### Delete User
- **DELETE** `/api/user/delete/{id}`  
  Deletes a specific user by ID (Admin only).

### Assign Role
- **PUT** `/api/user/assign-role`  
  Assigns a role to a user (Admin only).

### Revoke Role
- **PUT** `/api/user/revoke-role`  
  Revokes a role from a user (Admin only).

### Reset Password
- **PUT** `/api/user/reset-password/{id}`  
  Resets the password for a specific user by ID (Admin only).

### Activate User
- **PUT** `/api/user/activate/{id}`  
  Activates a specific user account (Admin only).

### Deactivate User
- **PUT** `/api/user/deactivate/{id}`  
  Deactivates a specific user account (Admin only).

### Toggle User Activation
- **PUT** `/api/user/toggle-activation/{id}`  
  Toggles activation status for a specific user (Admin only).

---

## Category Management

### Create Category
- **POST** `/api/categories/create-categories`  
  Creates a new category (Admin only).

### Get All Categories
- **GET** `/api/categories/list-categories`  
  Retrieves a list of all categories.

---

## Comment Management

### Add Comment
- **POST** `/api/comments/{taskId}`  
  Adds a comment to a specific task (User/Admin).

### Get Comments
- **GET** `/api/comments/{taskId}`  
  Retrieves comments for a specific task (User/Admin).

---

## Notification Management

### Get My Notifications
- **GET** `/api/notifications/my`  
  Retrieves notifications for the authenticated user.

---

## Task Management

### Create Task
- **POST** `/api/tasks/create`  
  Creates a new task (Admin only).

### Assign Task
- **PUT** `/api/tasks/assign`  
  Assigns a task to a user (Admin only).

### Get All Tasks
- **GET** `/api/tasks/get-all`  
  Retrieves a list of all tasks (Admin only).

### Get Unassigned Tasks
- **GET** `/api/tasks/unassigned`  
  Retrieves a list of unassigned tasks (Admin only).

### Get My Tasks
- **GET** `/api/tasks/my-tasks`  
  Retrieves tasks assigned to the authenticated user.

### Get Tasks by Category
- **GET** `/api/tasks/category/{categoryId}`  
  Retrieves tasks belonging to a specific category.

### Update Task Status
- **PUT** `/api/tasks/status/{taskId}`  
  Updates the status of a specific task.

### Update Task
- **PUT** `/api/tasks/update/{taskId}`  
  Updates a specific task by ID (Admin only).

### Delete Task
- **DELETE** `/api/tasks/delete/{taskId}`  
  Deletes a specific task by ID (Admin only).
  
  # Entities and Relationships

## User
- **Attributes**: 
  - `id`
  - `username`
  - `password`
  - `email`
  - `role`
  - `isActive`
  
- **Relationships**:
  - Has many **Tasks**
  - Has many **Comments**
  - Has many **Notifications**

---

## Task
- **Attributes**: 
  - `id`
  - `title`
  - `description`
  - `status`
  - `createdDate`
  - `dueDate`
  - `assignedTo` (FK to **User**)
  - `categoryId` (FK to **Category**)
  
- **Relationships**:
  - Belongs to one **User** (assigned to)
  - Has many **Comments**
  - Belongs to one **Category**

---

## Comment
- **Attributes**: 
  - `id`
  - `content`
  - `createdDate`
  - `taskId` (FK to **Task**)
  - `userId` (FK to **User**)
  
- **Relationships**:
  - Belongs to one **Task**
  - Belongs to one **User**

---

## Category
- **Attributes**: 
  - `id`
  - `name`
  
- **Relationships**:
  - Has many **Tasks**

---

## Notification
- **Attributes**: 
  - `id`
  - `content`
  - `createdDate`
  - `userId` (FK to **User**)
  
- **Relationships**:
  - Belongs to one **User**

---
##  Diagram Outline
- **User** (1) ↔ (N) **Task**
- **User** (1) ↔ (N) **Comment**
- **Task** (1) ↔ (N) **Comment**
- **Task** (N) ↔ (1) **Category**
- **User** (1) ↔ (N) **Notification**
## Key Points to Consider
- Each entity corresponds to a table in your database.
- Relationships dictate how tables are linked together.
- Determine whether relationships are one-to-one, one-to-many, or many-to-many.
- 
# Visual Representation
## API Flow Diagram
<img width="1082" height="383" alt="image" src="https://github.com/user-attachments/assets/e5ece03a-612d-4b39-8529-35ae7986e0e2" />

## Database Entity Relationships
<img width="628" height="664" alt="image" src="https://github.com/user-attachments/assets/ed3ade55-9d5f-4102-a292-55ceb2f8d533" />

## User Activation Toggle Flow
<img width="894" height="583" alt="image" src="https://github.com/user-attachments/assets/602c23e5-11cf-40e7-a8b4-d9cb92e1dd2e" />


  ##  API Documentation

### Swagger UI
Access API documentation at the default Swagger endpoint.

---

##  Evaluation Criteria

### Group Project (10 Points)
- Complete Spring Boot REST API
- Functional React.js UI
- API-Frontend integration
- JWT Security implementation
- Code quality and documentation
- System demonstration

### Individual Participation (10 Points)
- GitHub commit history
- Code contribution quality
- Issue resolution
- Documentation updates
- Team collaboration

---

## 📅 Project Timeline

| Day  | Tasks                              |
|------|------------------------------------|
| 1    | Requirements, Design, Setup        |
| 2    | Backend: User Management           |
| 3    | Backend: Task Management           |
| 4    | Backend: Security & Validation     |
| 5    | Frontend: Auth & Layout           |
| 6    | Frontend: Task Management          |
| 7    | Integration & Testing              |
| 8    | Deployment & Documentation         |

---

##  Troubleshooting

### Common Issues
- **Database Connection Failed**
  - Check PostgreSQL service status
  - Verify credentials in `application.properties`

- **CORS Errors**
  - Configure CORS properly in Spring Security
  - Check frontend API URL configuration

- **JWT Token Issues**
  - Verify token storage in frontend
  - Check token expiration

- **Build Failures**
  - Clean and rebuild project
  - Check dependency versions

---

## 👥 Team Members & Roles

| Name         | Role            | Responsibilities                    |
|--------------|-----------------|------------------------------------|
| [Kaleb Teshome] | Backend Lead | API Development, Security          |
| [Kaleab Bayeh] | Frontend Lead | UI Development                     |
| [Kaleb Melaku] | Database Admin| Database Design                    |
| [Dagm Woldekidan] | Full Stack | Integration, Testing               |
| [Geleta Bekele] | DevOps       | Deployment                         |

---

##  References
- [Spring Boot Official Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

##  Support
For technical issues:
- Check the troubleshooting section
- Review GitHub Issues
- Contact team members
- Refer to official documentation

**Project Status**: Active Development  
**Last Updated**: December 2025  
**Version**: 1.0.0  

*Developed as part of Woldia University Institute of Technology - Software Engineering 5th Year Web Service Project 2025 E.C*
