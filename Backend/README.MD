# TaskMesh Backend

This directory contains the backend API for **TaskMesh**, a collaborative taskboard application.

The backend provides authentication, taskboard management, real-time updates, and data persistence using MongoDB.

---

# Overview

The backend is built with **Node.js, Express, and TypeScript** and follows a modular architecture designed to keep business logic, persistence, and routing responsibilities clearly separated.

It exposes a REST API for standard operations and uses **Socket.IO** to provide real-time updates across connected clients.

---

# Tech Stack

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose
* Zod (environment validation)
* JWT Authentication
* Socket.IO
* Jest (testing)

---

# Project Structure

The backend follows a **modular architecture**, where each domain entity is implemented as a self-contained module.

Example module structure:

```text
comment/
│
├── comment.controller.ts
├── comment.policy.ts
├── comment.repository.ts
├── comment.routes.ts
├── comment.schema.ts
├── comment.serializer.ts
├── comment.service.ts
└── comment.types.ts
```

The same structure is used for the main entities:

* taskboards
* lists
* cards
* comments

### Responsibilities

**controller**

Handles HTTP requests and responses.

**routes**

Defines Express routes and attaches controllers.

**service**

Contains the business logic of the module.

**repository**

Handles database interaction with Mongoose.

**schema**

Defines validation schemas.

**serializer**

Formats responses sent to the client.

**policy**

Contains authorization logic.

**types**

TypeScript type definitions.

This structure keeps the codebase organized and makes each module easier to maintain and test.

---

# Core Domain Model

The main entities of the system are:

* Users
* Taskboards
* Lists
* Cards
* Comments

Relationship overview:

```text
User
  └── Taskboards
        └── Lists
              └── Cards
                    └── Comments
```

---

# Authentication

Authentication is implemented using **JWT tokens**.

The system uses:

* Access tokens
* Refresh tokens

Because this project is intended as a **technical demonstration**, the authentication system focuses on implementing JWT mechanics rather than protecting sensitive user data.

For this reason:

* Password resets are intentionally simplified
* Email verification is not required

---

# Real-Time Communication

TaskMesh uses **Socket.IO** to synchronize taskboard activity between multiple users in real time.

When a user performs an action (such as creating a card or moving a list), the backend emits events to all connected clients inside that taskboard so their UI updates immediately.

## Taskboard Rooms

When a user opens a taskboard, the client joins a **Socket.IO room** associated with that taskboard.

This allows the server to broadcast updates only to users currently viewing that board.

Typical flow:

1. Client connects to the socket server
2. Client emits `JOIN_TASKBOARD`
3. Server places the user in the taskboard room
4. Any changes inside the board trigger broadcast events

## Main Event Categories

### Taskboard Presence

These events manage users joining or leaving a board.

| Event               | Description                                        |
| ------------------- | -------------------------------------------------- |
| `JOIN_TASKBOARD`    | User joins a taskboard room                        |
| `LEAVE_TASKBOARD`   | User leaves a taskboard room                       |
| `JOINED_TASKBOARD`  | Confirmation event sent after joining              |
| `TASKBOARD_MEMBERS` | Broadcasts the current active members of the board |

---

### Card Events

These events synchronize card activity across users.

| Event          | Description                    |
| -------------- | ------------------------------ |
| `CARD_CREATED` | A new card was created         |
| `CARD_UPDATED` | A card's content was edited    |
| `CARD_DELETED` | A card was removed             |
| `CARD_MOVED`   | A card was moved between lists |

---

### List Events

These events update the structure of the taskboard.

| Event          | Description          |
| -------------- | -------------------- |
| `LIST_CREATED` | A new list was added |
| `LIST_UPDATED` | A list was edited    |
| `LIST_DELETED` | A list was removed   |
| `LIST_MOVED`   | A list was reordered |

---

### Comment Events

These events update discussions inside cards.

| Event             | Description                       |
| ----------------- | --------------------------------- |
| `COMMENT_CREATED` | A new comment was added to a card |
| `COMMENT_UPDATED` | A comment was edited              |
| `COMMENT_DELETED` | A comment was removed             |

---

### Taskboard Events

| Event               | Description                            |
| ------------------- | -------------------------------------- |
| `TASKBOARD_UPDATED` | Taskboard settings or metadata changed |
| `TASKBOARD_DELETED` | Taskboard was deleted                  |

---

These events allow the frontend to keep the UI synchronized across multiple users without requiring manual refreshes.

---

# Middleware

The backend includes custom middleware for:

### JWT Authentication

Verifies access tokens and attaches the authenticated user to the request.

### Error Handling

Centralized error handling middleware automatically converts thrown errors into structured API responses.

---

# Environment Configuration

Create a `.env` file in the backend root directory.

Example configuration:

```env
NODE_ENV=development
PORT=5000

JWT_SECRET=<key>
JWT_REFRESH=<key>

AUTH_TIME=5m
REFRESH_TIME=1d

SAME_SITE=lax
CORS_ALLOW_LIST=http://localhost:3000

MONGO_URI=mongodb://<user>:<password>-shard-00-00.hbjgqlc.mongodb.net:27017,ac-ol4nt6w-shard-00-01.hbjgqlc.mongodb.net:27017,ac-ol4nt6w-shard-00-02.hbjgqlc.mongodb.net:27017/<database>?ssl=true&replicaSet=atlas-dnhhxp-shard-0&authSource=admin&appName=<clusterName>
```

Alternatively, when using MongoDB Atlas SRV connection strings:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<clustername>.hbjgqlc.mongodb.net/<databasename>?appName=<clustername>
```

## Variable Overview

| Variable          | Purpose                            |
| ----------------- | ---------------------------------- |
| `NODE_ENV`        | Application environment            |
| `PORT`            | HTTP server port                   |
| `JWT_SECRET`      | Secret used to sign access tokens  |
| `JWT_REFRESH`     | Secret used to sign refresh tokens |
| `AUTH_TIME`       | Access token lifetime              |
| `REFRESH_TIME`    | Refresh token lifetime             |
| `SAME_SITE`       | Cookie SameSite policy             |
| `CORS_ALLOW_LIST` | Allowed origins for CORS           |
| `MONGO_URI`       | MongoDB connection string          |

---

# Data Persistence

The application uses **MongoDB with Mongoose**.

Data deletion is implemented as **hard deletion** rather than soft deletion.

This decision was made because the application is currently hosted on **free-tier infrastructure**, and maintaining soft-deletion flags and restoration features would introduce unnecessary complexity.

---

# Running the Backend Locally

## Install dependencies

```bash
npm install
```

---

## Run in development mode

```bash
npm run dev
```

This uses **tsx watch** to automatically restart the server when files change.

---

## Build the project

```bash
npm run build
```

This uses a dedicated TypeScript configuration:

```
tsconfig.build.json
```

---

## Run the compiled server

```bash
npm start
```

---

# Testing

The backend uses **Jest** for automated testing.

Tests run against a **local MongoDB instance**.

Run tests with:

```bash
npm test
```

---

# Debugging

The project includes VSCode debugging configurations.

### Debug the server

```
Debug TS (tsx watch)
```

### Debug individual tests

```
Debug Jest (current test)
```

Both configurations allow running the backend or tests directly using **F5** in VSCode.

---

# Deployment

The backend is currently deployed using **Render**.

---

# Known Limitations

Some aspects of the system could be improved in future iterations:

* concurrency scenarios have not been extensively stress-tested
* additional socket events could be added for new taskboard creation
* more advanced permission management could be implemented

---

# Future Improvements

Possible improvements include:

* enhanced concurrency testing
* expanded websocket event coverage
* improved access control policies
* stronger security flows for authentication
