# TaskMesh

[![Frontend CI](https://github.com/Braslynrr/TaskMesh/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Braslynrr/TaskMesh/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/Braslynrr/TaskMesh/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Braslynrr/TaskMesh/actions/workflows/backend-ci.yml)

TaskMesh is a collaborative taskboard application inspired by tools like Trello.
It allows multiple users to organize work into boards, lists, cards, and comments while seeing updates in real time.

The main goal of this project is to demonstrate the design and implementation of a **full-stack collaborative system**, including authentication, real-time updates, and a clean UI for managing tasks.

---

## Live Demo

You can try the application here:

**Live application:**
https://task-mesh-frontend.vercel.app

### Demo Tips

* You can create your own account or use demo users.
* Open the application in **two browser windows** and interact with the same board to see **real-time updates**.
* Try creating cards, moving them between lists, or leaving comments.

---

## Project Goals

TaskMesh focuses on demonstrating several important concepts in modern web development:

* Full-stack architecture
* JWT-based authentication
* Real-time collaboration using WebSockets
* RESTful API design
* Clean component-based frontend architecture
* Monorepo project organization

This project is intended as a **technical demonstration**, not a production-ready product.

---

## Key Features

* User authentication using JWT
* Create and manage taskboards
* Create lists within boards
* Create cards within lists
* Comment on cards
* Drag-and-drop card organization
* Real-time updates across connected users

---

## Project Architecture

This repository is organized as a **monorepo** containing two independent applications.

```
TaskMesh
│
├── Backend
│   └── Node.js API (Express + Socket.io + MongoDB)
│
└── Frontend
    └── React application (Next.js)
```

Each application:

* Manages its own dependencies
* Has its own CI workflow
* Can be run independently

More detailed setup instructions are available in the application-specific READMEs.

* [Backend setup](Backend/README.MD)

* [Frontend setup](Frontend/README.MD)

---

## Tech Stack

### Backend

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose
* Zod (validation)
* JWT authentication
* Socket.IO (real-time communication)

### Frontend

* React
* Next.js
* TypeScript
* Tailwind CSS
* Zod (validation)
* Socket.IO client

---

## Security Model

TaskMesh implements **basic authentication using JWT**.

Because this project is designed as a **technical demonstration**, certain features are intentionally simplified:

* Passwords can be reset easily.
* Email verification is not required.
* Demo accounts may be shared.

The goal is to demonstrate **authentication mechanics**, not to manage sensitive user data.

---

## Data Persistence

The project currently runs on **free-tier infrastructure**, which imposes some constraints.

For this reason:

* When resources are deleted (boards, lists, cards, comments), they are **permanently removed** from the database.
* Soft deletion and recovery features are not implemented.

This keeps the system simple while respecting the limitations of the hosting environment.

---

## Testing

Testing coverage differs between the backend and frontend.

### Backend

The backend has the most comprehensive testing coverage, focusing on:

* API endpoints
* validation logic
* business rules

### Frontend

Frontend testing is more limited due to the complexity of UI interaction testing in a project of this scope.

---

## Continuous Integration

Each application includes an independent **GitHub Actions workflow**.

CI pipelines run automatically when files in their respective directories change.

This allows the backend and frontend to evolve independently within the same repository.

---

## Running the Project Locally

If you want to run the project locally, follow the instructions in the specific READMEs:

* `Backend/README.md`
* `Frontend/README.md`

Each application contains detailed setup instructions.

---

## Project Status

This project is considered **feature-complete as a demonstration system**.

Future improvements could include:

* more advanced permission management
* improved UI testing
* additional collaboration features
* production-grade security flows

---

## License

This project is provided for educational and demonstration purposes.
