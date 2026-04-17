# SmartSociety 360 - Master Execution Flow (Vertical Slices)

## Phase 1: The Core Engine (Tenancy & Spatial Mapping)
*Rule: Do not build UI until the Super Admin can create a society and a physical flat.*

* **Flow 1: Platform Foundation & Authentication**
    * **Backend:** Setup NestJS. Build PostgreSQL `tenants` and `users` tables. Create JWT Auth routes.
    * **Web App:** Build Super Admin Login. Build "Create New Society" form.
    * **Success Metric:** Super Admin logs in, creates "Alpha Society," and the database provisions a secure tenant context.
* **Flow 2: Spatial Architecture (The Blueprint)**
    * **Backend:** Build `zones`, `buildings`, `floors`, `flats` tables with `tenant_id` isolation.
    * **Web App:** Society Admin logs in. Build UI to add "Tower A" and auto-generate flats "101, 102, 103".
    * **Success Metric:** A visual tree of the physical society exists in the database.
* **Flow 3: Resident Onboarding**
    * **Backend:** Build `user_unit_mapping` table (linking a User to a Flat).
    * **Web App:** Society Admin UI to "Add Resident" to Flat 101.
    * **Mobile App:** Build phone number + OTP login screen for Resident App.
    * **Success Metric:** Resident logs into the mobile app and sees "Welcome, Resident of Flat 101".

## Phase 2: Gate Security & Hardware Integration (MVP)
*Rule: Build the software mock first, then attach the hardware.*

* **Flow 4: The Hardware Bridge (MQTT Setup)**
    * **Edge Pi:** Write Node.js script to publish mock RFID scans to MQTT.
    * **Backend:** Setup NestJS MQTT subscriber. Build `rfid_cards` table.
    * **Success Metric:** Backend terminal logs "Card 123X scanned at Gate 1" every 10 seconds.
* **Flow 5: Manual Visitor Check-In (The Core Loop)**
    * **Backend:** Build `visitor_logs` table and WebSocket real-time gateway.
    * **Tablet App:** Guard UI to enter visitor details and tap "Send".
    * **Mobile App:** Resident UI to receive push notification and tap "Approve" or "Deny".
    * **Success Metric:** End-to-end data flow from Guard Tablet -> Cloud -> Resident App -> Cloud -> Guard Tablet.
* **Flow 6: Pre-Approved QR & Automated Entry**
    * **Mobile App:** Resident UI to generate a time-limited OTP QR code.
    * **Backend:** Validation logic for QR code expiration.
    * **Edge Pi:** Logic to receive validation and trigger the physical relay to open the barrier.

## Phase 3: Core Operations & Helpdesk
*Rule: Ensure State Management is perfect (Pending -> In Progress -> Resolved).*

* **Flow 7: Ticket Lifecycle (Complaints)**
    * **Backend:** Build `complaints` table with SLA timers.
    * **Mobile App:** Resident UI to raise "Plumbing" ticket with camera photo upload.
    * **Web App:** Supervisor dashboard to view tickets and assign to "Raju (Plumber)".
    * **Staff App:** Simplified mobile UI for Raju to see the job, tap "Done," and upload a photo.
* **Flow 8: Amenity Booking & Quotas**
    * **Backend:** Build `amenities` and `bookings` tables. Logic to check weekly quotas.
    * **Web App:** UI to configure "Tennis Court" (max 2 hours/week per flat).
    * **Mobile App:** Calendar UI for resident to select a slot and book.
    * **Success Metric:** Database blocks the booking if the resident exceeds 2 hours.

## Phase 4: The Financial Engine
*Rule: Finance requires extreme precision. Use database transactions (ACID) for every step.*

* **Flow 9: Maintenance Fee Generation**
    * **Backend:** Build `fee_structures` and `invoices` tables. Write a CRON job that runs on the 1st of the month to generate bills based on flat size (sqft).
    * **Web App:** Treasurer UI to view all generated pending invoices.
    * **Mobile App:** Resident UI showing "Dues: ₹3,500".
* **Flow 10: Payment Gateway & Digital Receipts**
    * **Backend:** Integrate Razorpay API. Build secure webhook listener to confirm payment.
    * **Mobile App:** "Pay Now" button launching Razorpay checkout.
    * **Backend:** Logic to auto-generate a PDF receipt and mark the invoice as "Paid" upon webhook success.
* **Flow 11: Automated Fines & Defaulters**
    * **Backend:** CRON job that checks for unpaid invoices past the 15th and appends a 5% late fee.
    * **Web App:** Dashboard tab showing the "Defaulter List".

## Phase 5: Advanced IoT & Community (Scale)
*Rule: Do not touch these until Phases 1-4 are deployed and tested.*

* **Flow 12: Smart Parking Maps**
    * **Backend:** `parking_slots` table linked to MQTT ultrasonic sensors.
    * **Mobile App:** Visual grid mapping free vs. occupied slots in real-time.
* **Flow 13: Live Utility Metering**
    * **Edge Pi:** Ingest data from smart electricity/water meters.
    * **Mobile App:** Live dashboard showing kWh and Liter consumption for the resident's specific flat.
* **Flow 14: Digital AGM & Polling**
    * **Web App:** Secretary UI to create a secure poll (e.g., "Change painting vendor?").
    * **Mobile App:** Resident UI to cast a cryptographic vote (1 vote per flat enforced).