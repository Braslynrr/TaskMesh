# TaskMesh

TaskMesh is a collaborative taskboard system inspired by Trello.

## Architecture

This repository is a monorepo containing two independent applications:

- [`Backend/`](Backend/README.MD): Node.js + Express + MongoDB API
- [`FrontEnd/`](Frontend/README.MD): React (Next.js) client application


Each application has:
- Its own dependencies
- Its own Docker image
- Its own CI pipeline

## Tech Stack

- Backend: Node.js, TypeScript, Express, Mongoose, Zod, JWT
- Frontend: React, Next.js, TypeScript, TanStack Query
- Realtime: WebSockets (planned)

## CI/CD

Each application has an independent GitHub Actions workflow triggered by path changes.
