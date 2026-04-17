# SmartSociety 360 - Architecture Repository

This repository contains the full monorepo architecture for the **SmartSociety 360** Residential Platform, encompassing:

1. **`backend-api/`** - NestJS + PostgreSQL + Redis (Modular Monolith, Schema-per-Tenant)
2. **`web-admin/`** - React + Vite + Tailwind v4 (Super Admin & Society Admin Portals)
3. **`mobile-app/`** - React Native / Expo (Resident, Guard, and Staff Apps)
4. **`docs/`** - Centralized knowledge base containing all Architecture, DB Schemas, and Role guidelines.

### Development Stack

- **Backend:** Node.js 20, NestJS 10, TypeORM, BullMQ, Mongoose, PostgreSQL 15, Mosquitto 2.0
- **Web Frontend:** React 18, Vite, React Router v6, Tailwind CSS v4, Zustand
- **Mobile App:** Expo SDK, React Native, React Navigation

### Setup Environments

You can spin up the supporting infrastructure (PostgreSQL, Redis, RabbitMQ/MQTT) via Docker Compose:

```bash
docker-compose up -d
```

Consult the documentation located in `docs/` for specific architectural boundaries and setup guides.
