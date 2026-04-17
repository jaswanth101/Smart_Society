# SmartSociety 360 - Pages & Routing Architecture

## 1. Routing Strategy & Guardrails
To enforce the multi-tenant architecture and strict RBAC, the routing layer must implement three distinct types of route guards (Higher-Order Components or Middleware):
1.  **AuthGuard:** Verifies if the user is authenticated (valid JWT/Session). Unauthenticated users are redirected to `/login`.
2.  **TenantGuard:** Extracts the `tenant_id` from the URL or user context and verifies the user belongs to that society.
3.  **RoleGuard:** Checks the user's `role_id` against the permitted roles for the specific route. If unauthorized, redirects to a `/403-unauthorized` page or hides the navigation link entirely.

---

## 2. Web App Panel Routing (React JS + Vite)

*Base routing structure intended for React Router DOM (v6+).*

### 2.1 Public & Authentication Routes
Accessible without logging in.
* `/` -> Landing Page (Marketing / Startup Pitch)
* `/login` -> Unified Login Portal (Email/Phone + OTP/Password)
* `/forgot-password` -> Password Reset Flow
* `/reset-password` -> Set New Password

### 2.2 Super Admin Platform Routes (Platform Owner)
Protected by `AuthGuard` + `RoleGuard (SuperAdmin)`. No `tenant_id` prefix required as they view the entire platform.
* `/platform/dashboard` -> Multi-Society Live Analytics
* `/platform/societies` -> List of all onboarded societies
* `/platform/societies/new` -> Society Onboarding Form & Environment Provisioning
* `/platform/societies/:societyId` -> Individual Society Details & Module Toggle (Premium vs Standard)
* `/platform/billing` -> Platform revenue, SaaS subscriptions, payment gateway logs
* `/platform/hardware` -> Global hardware asset tracking & AMC renewals

### 2.3 Society Admin Routes (President, Secretary, Treasurer, Supervisor)
Protected by `AuthGuard`, `TenantGuard`, and granular `RoleGuards`.
*Base Route:* `/:tenantId/admin` (e.g., `/society_alpha/admin/...`)

**Common Dashboards:**
* `/dashboard` -> Live Committee Dashboard (Accessible by President, Secretary, Treasurer, Supervisor)

**Member & Property Management (President, Secretary):**
* `/members` -> Resident & Tenant Database (Add/Edit/Remove/Bulk Upload)
* `/members/approvals` -> Pending KYC or Tenant move-in requests
* `/property/units` -> Manage Zones, Wings, and Flat mapping
* `/property/parking` -> Assigned Slot Management & EV Bay config

**Financial Management (President, Treasurer):**
* `/finance/overview` -> Society Fund Balance & P&L
* `/finance/fees` -> Set Fee Structures per flat type
* `/finance/defaulters` -> Defaulter List Dashboard (Exportable)
* `/finance/expenses` -> Expense Tracking & Bill Uploads
* `/finance/reports` -> Custom Report Builder & Audit-Ready exports

**Hardware & Access Management (President, Secretary, Supervisor):**
* `/access/rfid` -> RFID Card Management (Issue, Revoke, Time Windows)
* `/access/amenities` -> Amenity Config (Time limits, Quotas, Maintenance blocks)
* `/access/gates` -> ANPR logs and gate hardware status (Edge Server ping)

**Staff & Vendor Management (President, Supervisor):**
* `/staff/directory` -> Staff Digital Profiles & ID Generation
* `/staff/roster` -> Duty Roster Planning & Attendance logs
* `/staff/tasks` -> Task Assignment Module & Photo Verifications
* `/vendors` -> Approved Vendor Directory & POs

**Communication & Helpdesk (President, Secretary):**
* `/communications/notices` -> Notice Board Manager & Scheduled Announcements
* `/communications/broadcast` -> Emergency Broadcast Console
* `/helpdesk/complaints` -> Master view of all resident tickets, SLAs, and escalations
* `/elections` -> Committee Election Module & Voting Setup

---

## 3. Mobile App Routing (React Native + Expo)

*Base routing structure intended for a file-based routing system like Expo Router.*

### 3.1 Public & Authentication Stack
* `/login` -> Phone Number + OTP input
* `/verify-otp` -> OTP verification and JWT storage
* `/tenant-select` -> (Edge case) If a user owns flats in multiple SmartSociety 360 properties, they select which one to enter.

### 3.2 Resident & Tenant App (Tab Navigation)
Protected by `RoleGuard (FlatOwner, Tenant)`. Tenants have restricted views inside these tabs.
* **Tab 1: Home (Dashboard)**
    * `/resident/home` -> Pending dues, active bookings, recent gate entries.
    * `/resident/finance` -> Pay Maintenance Fee, view past digital receipts. *(Hidden for Sub-Tenants)*
    * `/resident/utilities` -> Smart meter consumption (Electricity/Water).
* **Tab 2: Access & Visitors**
    * `/resident/visitors` -> Generate Pre-Approved QR pass, view visit history.
    * `/resident/family` -> My Family & RFID Cards (Report lost card).
    * `/resident/parking` -> Live Parking Map, Guest Parking Booking, Vacant Slot Leasing.
* **Tab 3: Community**
    * `/resident/notices` -> Notice Board & Society Documents.
    * `/resident/chat` -> In-App Chat (Committee & Supervisor).
    * `/resident/polls` -> Society Polls, Voting, & AGM RSVP.
    * `/resident/marketplace` -> Resident Marketplace & Skill Exchange.
* **Tab 4: Services (Helpdesk)**
    * `/resident/complaints` -> Raise new ticket, upload photos, track SLA status.
    * `/resident/amenities` -> Amenity Booking Calendar & Availability.
* **Floating Action/Header:**
    * `Emergency/SOS` -> Immediate trigger alerting guards/committee.
    * `Video Doorbell` -> Modal overlay when someone rings the flat.

### 3.3 Security Guard Tablet App (Stack Navigation)
Protected by `RoleGuard (SecurityGuard)`. Designed for a 10" Android Tablet in landscape mode.
* `/guard/dashboard` -> Split-screen: Live entry logs on left, Active alerts (Overstay/Unknown face) on right.
* `/guard/check-in` -> Manual visitor entry form (Photo, Phone, Purpose).
* `/guard/cctv` -> Live CCTV Feed grid.
* `/guard/incidents` -> Incident Report Log form.
* `/guard/patrol` -> Night Patrol Round scanner (QR/NFC checkpoints).
* `/guard/directory` -> Emergency Contact Directory.

### 3.4 Staff App (Electrician / Cleaner) (Tab Navigation)
Protected by `RoleGuard (Staff)`. Highly simplified UI.
* `/staff/tasks` -> List of assigned jobs.
* `/staff/tasks/:taskId` -> Job details + Camera view to upload "Proof of Completion" photo.
* `/staff/attendance` -> View own shift schedule and total overtime.
* `/staff/requests` -> Raise supply requests or leave applications.

---

## 4. Error & Edge Case Routing
* `/403-unauthorized` -> User attempted to access a route outside their Role/Tenant.
* `/404-not-found` -> Standard fallback.
* `/offline-mode` -> Mobile app fallback screen when the internet is disconnected, showing cached gate QR codes and emergency local numbers.