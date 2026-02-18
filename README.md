# Task Workflow API

A RESTful API for task management with email notifications, report generation, and background job processing using BullMQ.

## Features

- User authentication (JWT)
- Task CRUD operations with status tracking
- Background job processing for emails and reports
- Redis caching for improved performance
- PostgreSQL database with Sequelize ORM
- Email notifications for task status changes
- Automated report generation
- Daily rotating log files

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Sequelize
- Redis + BullMQ
- Winston (Logging)
- Nodemailer (Email)
- Zod (Validation)

## Prerequisites

- Node.js (v20+)
- PostgreSQL (v14+)
- Redis (v6+)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone [<repository-url>](https://github.com/BirjuSavani/task-workflow.git)
cd task-workflow-api
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_workflow
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

LOG_LEVEL=info
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE task_workflow;
\q
```

## Database Migration Commands

### Run Migrations

```bash
npx sequelize-cli db:migrate
```

### Undo Last Migration

```bash
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations

```bash
npx sequelize-cli db:migrate:undo:all
```

## Seeder Commands

### Run All Seeders

```bash
npx sequelize-cli db:seed:all
```

This will create:
- 1 test user (john@example.com / password123)
- 200 sample tasks with random statuses and priorities

### Undo All Seeders

```bash
npx sequelize-cli db:seed:undo:all
```

### Alternative Seeder (TypeScript)

```bash
npm run seed:tasks
```

## Run Commands

### Start Server (Development)

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Start Server (Production)

```bash
npm start
```

### Start Worker (Background Jobs)

```bash
npm run worker
```

The worker processes:
- Email queue (task notifications)
- Report queue (task summaries)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks (with pagination & filters)
- `PUT /api/tasks/:taskId` - Update task
- `PATCH /api/tasks/:taskId/status` - Update task status

### Reports

- `GET /api/reports` - Get all reports
- `POST /api/reports/generate` - Generate new report

### Users

- `GET /api/users/profile` - Get user profile

## Postman Instructions

### 1. Import Collection

Create a new Postman collection with the following setup:

**Base URL:** `http://localhost:5000/api`

### 2. Authentication Flow

#### Register User
```
POST {{baseUrl}}/auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

Copy the `token` from response.

### 3. Set Authorization

For all protected endpoints, add header:
```
Authorization: Bearer <your_token>
```

### 4. Task Operations

#### Create Task
```
POST {{baseUrl}}/tasks
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "title": "Complete project",
  "description": "Finish the API development",
  "priority": "HIGH"
}
```

#### Get Tasks (with filters)
```
GET {{baseUrl}}/tasks?page=1&limit=10&status=PENDING
Headers: Authorization: Bearer <token>
```

#### Update Task
```
PUT {{baseUrl}}/tasks/:taskId
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "title": "Updated title",
  "priority": "MEDIUM"
}
```

#### Update Task Status
```
PATCH {{baseUrl}}/tasks/:taskId/status
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "status": "COMPLETED"
}
```

### 5. Report Operations

#### Generate Report
```
POST {{baseUrl}}/reports/generate
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "sendEmail": true
}
```

#### Get Reports
```
GET {{baseUrl}}/reports?page=1&limit=10
Headers: Authorization: Bearer <token>
```
## Logging

Logs are stored in the `logs/` directory:
- `app-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- Logs rotate daily and are kept for 14 days

## Testing

Use the seeded user credentials:
- Email: `john@example.com`
- Password: `password123`

## Notes

- Ensure PostgreSQL and Redis are running before starting the server
- Run the worker process separately to handle background jobs
- Email notifications require valid SMTP credentials
- Task status changes to COMPLETED or FAILED trigger report generation

## Docker Setup

### Build and Run with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, App, Worker)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Run Migrations in Docker

```bash
# Access the app container
docker exec -it task-workflow-app sh

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize-cli db:seed:all

# Exit container
exit
```

### Environment Variables for Docker

Update the environment variables in `docker-compose.yml` with your SMTP credentials before running.

## License

ISC
