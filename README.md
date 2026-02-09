ToDo Application

Full-stack ToDo application with a Spring Boot backend and a Next.js frontend.
The project focuses on clean REST API design, proper backend layering, and practical frontend–backend integration.

Overview

This application allows users to register, log in, and manage their personal tasks.
Each task belongs to a specific user and can be created, updated, deleted, and filtered by status and priority.

The backend exposes a REST API built with Spring Boot and PostgreSQL, while the frontend is implemented using Next.js (App Router) and TypeScript.

Features
Users

User registration with unique email and username

Login with encrypted password (BCrypt)

User deletion with password verification

Tasks

Create, update, and delete tasks

Task priorities: HIGH, MEDIUM, LOW

Task statuses: TODO, IN_PROGRESS, COMPLETED

Filter tasks by status

Tasks are always linked to a specific user

Backend

The backend follows a classic layered architecture:

Controller → Service → Repository → Database

Tech stack

Java

Spring Boot

Spring Data JPA (Hibernate)

PostgreSQL

BCrypt password hashing

REST API

Jakarta Bean Validation

Key backend concepts

DTOs for request validation

Entity relationships (@OneToMany, @ManyToOne)

Enum-based domain modeling

Basic authentication logic

CORS configuration for frontend access

Frontend

The frontend is built as a separate client application consuming the REST API.

Tech stack

Next.js (App Router)

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide icons

Frontend responsibilities

User authentication

Task CRUD operations

Filtering and UI state handling

Form validation and confirmation dialogs

Database Model
User

id

username

email

password

Task

id

title

description

priority

status

user

Relationship:

One user can have many tasks

Each task belongs to exactly one user

Configuration
Backend

application.properties

spring.datasource.url=jdbc:postgresql://localhost:5433/todo
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


Backend runs on:

http://localhost:8080

Frontend
npm install
npm run dev


Frontend runs on:

http://localhost:3000

Notes

Passwords are never stored in plain text

User access to tasks is validated on the backend

Project is designed as a simple client–server application without Spring Security (intentionally)

Purpose

This project was created as a learning and portfolio project to demonstrate:

Backend development with Spring Boot

REST API design

Database integration with JPA

Full-stack interaction with a modern frontend

Author

Artem Bredak
Java Backend / Full-Stack Developer

<img width="974" height="680" alt="Screenshot 2026-02-09 at 19 26 33" src="https://github.com/user-attachments/assets/10ded2bc-233a-4037-937e-e798bde99f2e" />

<img width="1046" height="667" alt="Screenshot 2026-02-09 at 19 26 01" src="https://github.com/user-attachments/assets/2450bf47-5187-44c8-9619-28b58ea3e549" />

<img width="742" height="687" alt="Screenshot 2026-02-09 at 19 27 51" src="https://github.com/user-attachments/assets/9c66d508-7917-4775-8743-01444eb1bd0c" />

<img width="916" height="585" alt="Screenshot 2026-02-09 at 17 08 20" src="https://github.com/user-attachments/assets/efb8ce1e-97b0-4d95-96e1-f2bb1cb309fe" />

