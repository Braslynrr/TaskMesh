# TaskMesh Frontend

This directory contains the **frontend client** for TaskMesh.

The frontend is built using **Next.js and TypeScript** and provides the user interface for interacting with taskboards, lists, cards, and comments.

It communicates with the backend through a REST API and receives real-time updates through **Socket.IO**.

---

# Tech Stack

* Next.js
* React
* TypeScript
* Zustand (state management)
* Socket.IO Client
* dnd-kit (drag and drop)

---

# Application Structure

The application mirrors the backend domain model and focuses on the core entities:

* Taskboards
* Lists
* Cards
* Comments

Each component is designed to reflect these entities and update dynamically when changes occur.

---

# Routing Structure

Next.js routing is divided into two main sections:

## Auth Routes

Handles user authentication flows.

```
(auth)/
 ├─ login
 ├─ register
 └─ reset-password
```

These pages allow users to create accounts, sign in, and reset their password.

---

## Protected Routes

These routes require authentication and are guarded by middleware.

```
(protected)/
 ├─ taskboard
 │   ├─ page.tsx
 │   └─ [id]/page.tsx
```

### Taskboard Overview

```
/(protected)/taskboard
```

Displays all taskboards associated with the authenticated user.

---

### Taskboard Details

```
/(protected)/taskboard/[id]
```

Displays the full taskboard interface, including:

* lists
* cards
* comments
* drag-and-drop interactions

---

# State Management

The application uses **Zustand** for global state management.

Zustand was chosen as a lightweight alternative to Redux, allowing the application to manage shared state without introducing unnecessary complexity.

The main use cases include:

* managing the active taskboard state
* synchronizing socket updates
* highlighting recently updated elements
* coordinating UI updates after socket events

---

# Real-Time Updates

Real-time collaboration is implemented using **Socket.IO**.

The frontend listens for the same events emitted by the backend.

When changes occur, the UI updates automatically without requiring a refresh.

### Socket Usage

A custom hook is responsible for managing board-level socket subscriptions:

```
useBoardSocket
```

This hook is used inside the taskboard page to:

* join the taskboard room
* listen for updates
* update the state store
* trigger UI changes when events occur

---

# Drag and Drop

The taskboard interface uses **dnd-kit** to implement drag-and-drop interactions.

Supported actions include:

* reordering lists
* moving cards between lists
* updating card positions

These changes are immediately reflected in the UI and synchronized through the backend.

---

# API Communication

The frontend communicates with the backend through a custom **API client**.

The client handles:

* authenticated requests
* automatic token refresh
* error handling

If the access token expires, the client automatically requests a **refresh token** to maintain the user session.

---

# Socket Client

A dedicated socket client is used to establish connections with the backend.

The socket client uses credentials provided by the authentication system and joins taskboard rooms when necessary.

---

# Middleware

Next.js middleware is used to protect authenticated routes.

The middleware verifies that a valid authentication token exists before allowing access to protected pages.

If the token is invalid or missing, the user is redirected to the login page.

---

# Environment Variables

Create a `.env` file in the frontend root.

Example configuration:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# Running the Frontend Locally

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

The application will start on:

```
http://localhost:3000
```

---

# Testing

Testing coverage on the frontend is currently limited.

Basic tests exist for validation schemas, but broader UI testing has not yet been implemented.

Given the UI-heavy nature of the frontend, priority was given to:

* improving UX
* refining drag-and-drop interactions
* ensuring smooth real-time updates

Future improvements could include:

* component testing
* interaction testing
* integration tests

---

# Future Improvements

Potential areas for improvement include:

* expanding automated test coverage
* improving UI performance under heavy updates
* refining socket reconnection handling
* adding accessibility improvements