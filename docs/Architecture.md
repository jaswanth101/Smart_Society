# SmartSociety 360 - System Architecture Definition

## 1. System Overview
SmartSociety 360 is an enterprise-grade, multi-tenant residential management platform. It operates on a hybrid cloud-to-edge architecture, bridging real-time physical IoT hardware (RFID, ANPR, Sensors) with a highly scalable digital cloud platform. 

The core architectural directive is **absolute data isolation** via a multi-tenant PostgreSQL structure and **hardware resilience** via edge computing.

---

## 2. Technology Stack

### Frontend Layer
* **Web Dashboard (Admin/Committee):** React JS (Vite), TypeScript, Tailwind CSS. Headless UI primitives (shadcn/ui or Radix) for high-fidelity, precise micro-alignments.
* **Mobile Application (Residents/Staff):** React Native + Expo. Single codebase compiled to iOS and Android, ensuring native hardware access (NFC, Push Notifications).

### Backend & API Layer
* **Core API:** Node.js + NestJS. Chosen for its enterprise scalability, strong TypeScript support, and modular architecture.
* **Real-Time Communication:** WebSockets (via NestJS Gateways) for live dashboard updates and live chat.

### Database & Caching Layer
* **Primary Relational Database:** PostgreSQL (Managed on DigitalOcean/AWS RDS).
* **IoT Event Store:** MongoDB Atlas (Optimized for high-velocity, unstructured IoT log ingestion).
* **Caching & Queues:** Redis (For session management, background jobs, and rate-limiting).

### Hardware & Protocol Layer
* **IoT Messaging Protocol:** MQTT via Mosquitto Broker. Lightweight, pub/sub model ideal for high-latency or low-bandwidth environments.
* **Edge Computing Server:** Raspberry Pi 4 (Located on-premise at each society to process local MQTT payloads and provide offline fallback).
* **Physical Hardware:** UHF RFID Readers, ANPR IP Cameras, Vehicle Barrier Controllers.

---

## 3. Multi-Tenant Data Architecture (Schema-per-Tenant)

To guarantee zero cross-tenant data leakage and satisfy enterprise security requirements, the PostgreSQL database utilizes a **Schema-per-Tenant** isolation model.

### 3.1 The Public Schema (Control Layer)
Owned exclusively by the Super Admin. It routes authentication requests to the correct isolated schema.
* `tenants`: Stores society master records (`id`, `name`, `schema_name`, `subscription_tier`).
* `platform_users`: Super Admin credentials.
* `tenant_users_mapping`: Lookup table mapping user contact info to their respective `tenant_id`.

### 3.2 The Tenant Schemas (e.g., `society_alpha`, `society_beta`)
Isolated environments mirroring the exact physical layout of the society.
* **Spatial Hierarchy:**
    * `zones_phases` -> `buildings_wings` -> `floors` -> `units_flats`
* **Entities:**
    * `users`: Flat Owners, Tenants, Family Members, Staff.
    * `user_unit_mapping`: Links users to specific flats with relation tags.
    * `rfid_cards`: Maps physical UID hashes to `user_id`.
    * `vehicles`: Maps license plates to `unit_id`.
* **Operational Tables (MVP):**
    * `visitor_logs`, `complaints`, `amenity_bookings`, `maintenance_fees`.

---

## 4. Hardware-to-Cloud Bridge (Edge Architecture)

Physical security hardware cannot rely entirely on cloud availability. The architecture implements an Edge-to-Cloud sync.

1.  **The Physical Layer:** Standard UHF RFID Readers and Motorized Barriers output Wiegand/RS-485 serial data.
2.  **The Translation Layer:** Microcontrollers (ESP32 or access control panels) ingest serial data and translate it into JSON MQTT payloads.
3.  **The Edge Server (Local Mosquitto Broker):** A Raspberry Pi 4 on-site receives the MQTT payload. 
4.  **Offline Authorization Fallback:** The Edge Server runs a localized, synced database instance (e.g., SQLite) containing an active whitelist of resident RFID UIDs. If the internet fails, the Pi processes the authorization locally and triggers the gate relay.
5.  **The Cloud Sync:** When online, the local Mosquitto broker bridges to the AWS IoT Core / Cloud Backend to update the central database and trigger mobile app notifications.

---

## 5. Role-Based Access Control (RBAC) Matrix

The system enforces strict permission boundaries across 9 distinct roles:
1.  **Super Admin:** Platform-wide controls, tenant provisioning, billing.
2.  **President:** Society-wide override, emergency broadcasts, budget approvals.
3.  **Secretary:** Member database management, RFID configuration, circulars.
4.  **Treasurer:** Financial module access (fees, expenses, P&L).
5.  **Supervisor:** Staff rosters, leave approvals, task assignment.
6.  **Security Guard (Mobile):** Visitor check-in, CCTV viewing, incident reporting.
7.  **Staff/Cleaner (Mobile):** Task execution, proof-of-work uploads.
8.  **Flat Owner (Mobile):** Full unit management, payments, visitor pre-approval.
9.  **Tenant (Mobile):** Restricted unit access (no property/financial admin rights).

---

## 6. External Integrations

* **Payment Gateway:** Razorpay (UPI, Net Banking, Cards).
* **Notifications:** * Firebase Cloud Messaging (FCM) for iOS/Android Push.
    * WATI/Interakt API for WhatsApp Business messaging.
    * MSG91/Twilio for SMS fallback.
* **AI & Computer Vision:** OpenAI API (GPT-4 for Helpdesk Chatbot), OpenALPR (Vehicle Plates).

---

## 7. Infrastructure & CI/CD Pipeline

* **Hosting Environment:** Docker containerized applications deployed on DigitalOcean (Web/API) and AWS (IoT Core/Rekognition).
* **Version Control & CI/CD:** GitHub Actions for automated testing, linting, and zero-downtime deployments.
* **Observability:** Sentry (Error tracking), Grafana (Performance dashboards), PagerDuty (On-call alerts).