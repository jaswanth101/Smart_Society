# Jaswanth's To-Do List — SmartSociety 360

> **Last Updated:** 19 April 2026  
> **What's Done:** Tier 1 (Resident Portal) + Tier 2 (Business Logic) = 23 items ✅  
> **What's Left:** Tier 3 + 4 + 5 = 44 items listed below

---

## ✅ COMPLETED (For Reference)

### Tier 1 — Resident Portal (9/9 done)
All 9 resident-facing pages wired to live PostgreSQL APIs. No more mock data.

### Tier 2 — Business Logic (14/14 done)
Maker-Checker, Fee Waiver, Defaulter Block, Auto Late Fee CRON, Payment Reminders,
Finance Reports, SOS Panic, Emergency Broadcast, Visitor Blacklist, Election Handover,
SLA Auto-Escalation, Staff Ratings, Move-Out/NOC, Owner→Tenant Transfer.

---

## 🟡 TIER 3 — New Backend Modules & Features (19 items)

### 3.1 Parcels Module
- **What:** Guard logs incoming parcels at gate → resident gets OTP to collect → 24hr uncollected auto-reminder
- **Backend:** Full CRUD service in `src/modules/parcels/`
- **DB Table needed:** `Parcel` (id, recipientUnitId, senderName, trackingNo, status [RECEIVED/COLLECTED/RETURNED], otp, tenantId, timestamps)
- **Frontend:** Admin parcel log page + Resident "My Parcels" page
- **API:** `POST /parcels`, `GET /parcels`, `PATCH /parcels/:id/collect`

### 3.2 Vehicles Module
- **What:** Register resident vehicles, store license plates, manage ANPR whitelist
- **Backend:** Full CRUD service in `src/modules/vehicles/`
- **DB Table needed:** `Vehicle` (id, unitId, ownerName, licensePlate, type [CAR/BIKE/EV], rfidTag, isWhitelisted, tenantId)
- **Frontend:** Admin vehicle registry + Resident "My Vehicles" page
- **API:** `POST /vehicles`, `GET /vehicles`, `PATCH /vehicles/:id/whitelist`

### 3.3 Marketplace Module
- **What:** Residents post classified ads (sell furniture, offer tutoring, etc.)
- **Backend:** Full CRUD service in `src/modules/marketplace/`
- **DB Table needed:** `Listing` (id, title, description, price, sellerUnitId, category, status [ACTIVE/SOLD/EXPIRED], photos, tenantId)
- **Frontend:** Community marketplace tab (currently shows "coming soon")
- **API:** `POST /marketplace`, `GET /marketplace`, `PATCH /marketplace/:id/sold`

### 3.4 Polls & Surveys
- **What:** Quick community votes (separate from formal Elections). E.g., "Should we allow pets?" Yes/No/Maybe
- **Backend:** New service — `polls.service.ts`
- **DB Table needed:** `Poll` (id, question, options[], voteCounts[], deadline, tenantId) + `PollVote` (userId, pollId, optionIndex)
- **Frontend:** Community polls tab (currently shows "coming soon")
- **API:** `POST /polls`, `GET /polls`, `POST /polls/:id/vote`

### 3.5 Staff Leave Management
- **What:** Staff applies for leave digitally → Supervisor approves/rejects
- **Backend:** Add to `src/modules/staff/staff.service.ts`
- **DB Table needed:** `StaffLeave` (id, staffId, fromDate, toDate, reason, status [PENDING/APPROVED/REJECTED], tenantId)
- **API:** `POST /staff/leave`, `GET /staff/leave`, `PATCH /staff/leave/:id/approve`

### 3.6 Task Photo Proof
- **What:** When staff completes a task (e.g., plumbing repair), they upload before/after photos
- **Backend:** Add file upload to `src/modules/staff/` tasks
- **Implementation:** Add `beforePhotoUrl` and `afterPhotoUrl` fields to existing `Task` table
- **API:** `PATCH /tasks/:id/upload-proof` (multipart/form-data)

### 3.7 Frequent Visitor Auto-Approval
- **What:** Resident marks certain visitors (e.g., in-laws) as "always allowed" — guard auto-approves
- **Backend:** Add to visitors service
- **DB Table needed:** `FrequentVisitor` (id, name, phone, unitId, relationship, tenantId)
- **API:** `POST /visitors/frequent`, `GET /visitors/frequent`, `DELETE /visitors/frequent/:id`

### 3.8 Notice Read Receipts
- **What:** Track which residents opened a critical notice. Secretary sees "42/120 read"
- **Backend:** Add to communications service
- **DB Table needed:** `NoticeRead` (id, noticeId, userId, readAt)
- **API:** `POST /communications/notices/:id/read`, `GET /communications/notices/:id/receipts`

### 3.9 Bulk CSV Import/Export
- **What:** Secretary uploads a CSV file with member/unit data → system bulk-creates them
- **Backend:** CSV parsing endpoint in users or property controller
- **Implementation:** Use `csv-parse` npm package
- **API:** `POST /users/import-csv` (multipart/form-data), `GET /users/export-csv`

### 3.10 Night Patrol QR Checkpoints
- **What:** Physical QR codes posted at 10+ locations in society. Guard scans them during rounds → proves patrol was done
- **Backend:** New patrol service
- **DB Tables needed:** `PatrolCheckpoint` (id, label, qrCode, location, tenantId) + `PatrolScan` (id, checkpointId, guardId, scannedAt)
- **API:** `POST /patrol/scan`, `GET /patrol/history`, `GET /patrol/checkpoints`

### 3.11 Incident Reporting
- **What:** Guard spots a broken pipe, suspicious person, etc. Takes photo → auto-creates alert for Supervisor
- **Backend:** Add to security service
- **DB Table needed:** `Incident` (id, reportedBy, category, description, photoUrl, severity, status, tenantId)
- **API:** `POST /security/incidents`, `GET /security/incidents`, `PATCH /security/incidents/:id/resolve`

### 3.12 Asset & Inventory Registry
- **What:** Track society assets (lifts, pumps, gym equipment) with purchase date, AMC expiry, vendor
- **Backend:** New service or add to property module
- **DB Table needed:** `Asset` (id, name, category, purchaseDate, amcExpiry, vendor, location, status, tenantId)
- **API:** `POST /assets`, `GET /assets`, `PATCH /assets/:id`

### 3.13 Petty Cash Management
- **What:** Log small daily expenses (chai for workers, auto for emergency, etc.) without formal Maker-Checker
- **Backend:** Add to finance service
- **DB Table needed:** `PettyCash` (id, description, amount, spentBy, date, receiptUrl, tenantId)
- **API:** `POST /finance/petty-cash`, `GET /finance/petty-cash`

### 3.14 Targeted Messaging
- **What:** Send notices only to Tower A, or only to B-wing, instead of broadcasting to everyone
- **Backend:** Add `targetBuildings` filter to notice creation
- **Implementation:** Add `targetBuildingIds` field to `Notice` table (string array)
- **API:** Modify `POST /communications/notices` to accept `targetBuildingIds[]`

### 3.15 Scheduled Notices
- **What:** Secretary writes a notice now but publishes it at a future date/time
- **Backend:** Add `publishAt` field to Notice table + CRON to publish
- **Implementation:** `@Cron(EVERY_MINUTE)` checks for notices with `publishAt <= now` and sets `isPublished = true`
- **API:** Add `publishAt` field to `POST /communications/notices`

### 3.16 Pet Registry
- **What:** Track society pets — name, breed, owner flat, vaccination expiry, nuisance complaints
- **Backend:** New service
- **DB Table needed:** `Pet` (id, name, species, breed, ownerUnitId, vaccinationExpiry, photo, tenantId)
- **API:** `POST /pets`, `GET /pets`, `PATCH /pets/:id`

### 3.17 Lost & Found Module
- **What:** Someone finds keys/wallet in the park → logs it. Owner claims it from management office
- **Backend:** New service
- **DB Table needed:** `LostItem` (id, description, foundLocation, foundBy, photoUrl, status [UNCLAIMED/CLAIMED], claimedBy, tenantId)
- **API:** `POST /lost-found`, `GET /lost-found`, `PATCH /lost-found/:id/claim`

### 3.18 Guard Tablet Interface
- **What:** Dedicated frontend routes for security guards on tablets
- **Pages needed:**
  - `/guard/dashboard` — today's visitor queue, SOS alerts, gate status
  - `/guard/check-in` — scan QR / manual visitor check-in
  - `/guard/incidents` — report + view incidents
  - `/guard/patrol` — scan QR checkpoints during night rounds
- **Backend:** APIs already exist (visitors, security, patrol)

### 3.19 Staff Mobile Interface
- **What:** Dedicated frontend routes for maintenance staff on phones
- **Pages needed:**
  - `/staff/tasks` — view assigned tasks, upload photo proof
  - `/staff/attendance` — check-in/out for the day
  - `/staff/requests` — apply for leave
- **Backend:** APIs already exist (staff, tasks)

---

## 🔵 TIER 4 — Third-Party Integrations (5 items)

### 4.1 Razorpay Payment Gateway
- **What:** Residents pay maintenance fees online via the "Pay Now" button
- **You need:** Razorpay account → API Key ID + Key Secret
- **Implementation:**
  1. `npm install razorpay`
  2. Create `POST /finance/create-order` → returns Razorpay `order_id`
  3. Frontend opens Razorpay checkout popup
  4. `POST /finance/verify-payment` webhook → marks invoice as PAID
- **Wires to:** `ResidentFinancePage.tsx` "Pay Now" button

### 4.2 WhatsApp Business API
- **What:** Send visitor arrival alerts, payment reminders, SOS notifications via WhatsApp
- **You need:** WATI.io or Interakt account → API Key
- **Implementation:**
  1. Create `WhatsAppService` in notifications module
  2. Template messages: "Your visitor {name} has arrived", "Payment of ₹{amount} due in {days} days"
  3. Wire to: visitor check-in, payment reminder CRON, SOS trigger
- **Monthly cost:** ~₹2,000-5,000/month depending on message volume

### 4.3 SMS Gateway (OTP Login)
- **What:** Phone number OTP verification for login (instead of/alongside email-password)
- **You need:** MSG91 or Twilio account → Auth Key/SID
- **Implementation:**
  1. Create `SmsService` in notifications module
  2. `POST /auth/send-otp` → sends 6-digit code to phone
  3. `POST /auth/verify-otp` → validates and issues JWT
- **Monthly cost:** ~₹500-2,000/month for MSG91

### 4.4 Firebase Cloud Messaging (Push Notifications)
- **What:** Push notifications to Android/iOS mobile apps
- **You need:** Firebase project → download `google-services.json` + `GoogleService-Info.plist`
- **Implementation:**
  1. `npm install firebase-admin`
  2. Create `PushNotificationService` in notifications module
  3. Store device FCM tokens in a `DeviceToken` table
  4. Fire push on: visitor arrival, SOS, notice posted, payment due
- **Cost:** Free (Firebase FCM is free)

### 4.5 Email Service (SendGrid/SES)
- **What:** Welcome emails, monthly PDF receipts, AGM document distribution
- **You need:** SendGrid API Key OR AWS SES credentials
- **Current state:** Gmail SMTP is already working for welcome emails
- **Upgrade path:**
  1. Replace Gmail SMTP with SendGrid for better deliverability
  2. Add PDF receipt generation (`pdfkit` npm package)
  3. Attach PDFs to payment confirmation emails
- **Monthly cost:** Free tier (100 emails/day on SendGrid)

---

## ⚫ TIER 5 — Hardware & IoT Integration (20 items)

> ⚠️ **Cannot be built until physical hardware is purchased.** Listed for future reference.

### Edge Infrastructure
- **5.1** Raspberry Pi 4 Edge Server — Docker + Node.js on each gate
- **5.2** MQTT Broker (Mosquitto) — Real-time cloud ↔ edge communication
- **5.3** Offline Fallback — Local RFID whitelist cache when internet drops

### Gate & Access Control
- **5.4** RFID Reader (EM-18/RC522) — Physical card scan → relay trigger → boom barrier open
- **5.5** Boom Barrier Motor — 12V relay module controlled via Raspberry Pi GPIO
- **5.6** ANPR Camera — AI license plate recognition, auto-open for whitelisted vehicles
- **5.7** Pedestrian Turnstile — RFID-controlled lobby/lift entry

### Security & Surveillance
- **5.8** CCTV Integration — IP camera RTSP streams to guard tablet
- **5.9** Fire Alarm Sensor — IoT smoke/heat sensor → auto-trigger evacuation broadcast
- **5.10** Physical SOS Buttons — Wall-mounted panic buttons in elevators/corridors
- **5.11** PA System / Siren — IoT-connected speakers for emergency announcements

### Smart Utilities
- **5.12** Water Sub-Metering — IoT pulse meters on each flat's water line
- **5.13** Electricity Sub-Metering — Smart meter per flat integration
- **5.14** Tank Level Monitoring — Ultrasonic sensor on overhead tanks
- **5.15** EV Charging Billing — kWh metering per RFID tag at charging stations

### Advanced Features (Premium)
- **5.16** Smart Parking Map — Ultrasonic bay sensors for live occupancy display
- **5.17** Biometric Attendance — Fingerprint scanners for staff check-in
- **5.18** Smart Parcel Lockers — RFID-enabled locker hardware
- **5.19** Face Recognition Entry — AI camera + ML model at main gate
- **5.20** Guard NFC Patrol Tags — Physical NFC stickers at checkpoint locations

### Hardware Shopping List
| Item | Approx. Cost | Quantity | Use |
|:-----|:-------------|:---------|:----|
| Raspberry Pi 4 (4GB) | ₹4,500 | 2-3 per gate | Edge server |
| EM-18 RFID Reader | ₹350 | 1 per gate | Card scanning |
| RFID Cards (EM4100) | ₹15/card | 200+ | Resident/staff cards |
| 5V Relay Module | ₹150 | 1 per barrier | Motor control |
| Boom Barrier Motor | ₹15,000-30,000 | 1 per gate | Physical barrier |
| IP Camera (Hikvision) | ₹3,000-8,000 | 4-8 | Surveillance |
| NFC Tags (NTAG215) | ₹25/tag | 10-20 | Patrol checkpoints |
| Ultrasonic Sensor (HC-SR04) | ₹100 | 1 per tank | Water level |

---

## Quick Reference: API Endpoints Built So Far

```
# Auth
POST   /auth/register
POST   /auth/login

# Users (Secretary/President)
POST   /users
GET    /users
GET    /users/pending
PATCH  /users/:id/approve
PATCH  /users/:id/reject
POST   /users/:id/move-out          ← 2.13
POST   /users/transfer              ← 2.14

# Finance (Treasurer/President)
POST   /finance/rules
GET    /finance/rules
POST   /finance/invoices
GET    /finance/invoices
POST   /finance/invoices/generate-batch
POST   /finance/invoices/:id/pay
PATCH  /finance/invoices/:id/waive  ← 2.2
PATCH  /finance/expenses/:id/approve ← 2.1
PATCH  /finance/expenses/:id/reject  ← 2.1
GET    /finance/defaulters           ← 2.3
GET    /finance/reports/summary      ← 2.6

# Complaints (Any user)
POST   /complaints
GET    /complaints
PATCH  /complaints/:id/status
POST   /complaints/:id/rate         ← 2.12

# Visitors
POST   /visitors
GET    /visitors
PATCH  /visitors/:id/checkin
PATCH  /visitors/:id/checkout
PATCH  /visitors/:id/reject         ← 2.9
GET    /visitors/blacklist           ← 2.9

# Communications
POST   /communications/notices
GET    /communications/notices
POST   /communications/broadcasts
GET    /communications/broadcasts

# Security
POST   /security/sos                 ← 2.7
POST   /security/emergency-broadcast ← 2.8

# Elections
GET    /elections/active
POST   /elections
POST   /elections/:id/resolve        ← 2.10 (auto-handover)

# Staff & Vendors
POST   /staff
GET    /staff
POST   /staff/attendance
POST   /vendors
GET    /vendors

# Property
GET    /property/buildings
GET    /property/units
GET    /property/parking

# Amenities
GET    /amenities
POST   /amenities

# Access Control
GET    /access/rfid
GET    /access/gate-logs

# IoT
GET    /iot/edge-nodes
POST   /iot/heartbeat
```

---

*Pick any item and start building. The backend patterns are consistent — every module follows the same Service → Controller → DTO → Module structure.*
