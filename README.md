# Task Management System - Full Stack Application

## 📋 Project Overview
A secure and scalable Task Management System built with Spring Boot REST API and React.js frontend. This full-stack web application implements role-based access control, task management with comments, notifications, and follows RESTful principles with JWT authentication. This project is developed as part of the Woldia University Web Service Project 2025 E.C.

## 🎯 Project Objectives
- Design and implement RESTful services using Spring Boot
- Consume REST APIs from a React.js frontend
- Apply authentication and authorization using JWT
- Implement collaborative task management with comments and notifications
- Demonstrate proper API-Frontend integration
- Work collaboratively using GitHub version control

## 🏗️ System Architecture





## 🛠️ Technology Stack

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

## 📊 Database Schema

### Core Entities
- **User**: System users with authentication
- **Task**: Main task management entity
- **Comment**: Task discussions and feedback
- **Notification**: User alerts and notifications
- **Category**: Task classification

## 🔐 Security Implementation

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

## 📱 Core Features

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

### Backend Structure

src/main/java/com/taskmanagement/
#├── controller/             # REST controllers
#├── service/               # Business logic layer
#├── repository/            # Data access layer
#├── entities/                 # JPA entities
#├── dto/                   # Data Transfer Objects
#├── Auths/              # Security configuration
#├── exception/             # Exception handling

