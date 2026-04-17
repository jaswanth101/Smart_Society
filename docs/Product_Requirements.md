# Product Requirements Document (PRD)
**Product Name:** SmartSociety 360
**Document Purpose:** Define all functional and non-functional requirements for AI-native development.
**Target Deployment:** Multi-tenant SaaS platform for residential communities (20-flat standalone to 2,000-flat townships).

## 1. Executive Summary
SmartSociety 360 is an end-to-end intelligent apartment society management platform. It combines IoT hardware (RFID, ANPR, smart sensors), mobile applications (iOS/Android), a web-based administrative portal, and AI-powered automation to track entries, manage finances, control amenities, and handle community communications.

## 2. Target Audience & User Personas (RBAC)
The system must support the following 9 distinct roles with strict permission boundaries:

1.  **Super Admin (Platform Owner):** Can onboard/offboard entire societies, toggle premium modules, and view platform-wide billing/analytics.
2.  **President:** Full access to their society's panel. Can approve major expenditures, override rules, and send emergency broadcasts.
3.  **Secretary:** Manages member database, circulars, AGM documents, and RFID access rules.
4.  **Treasurer:** Restricted to the financial module (fee structures, expenses, P&L, reserve funds).
5.  **Supervisor:** Manages staff duty rosters, task assignments, leave approvals, and access logs.
6.  **Security Guard:** Uses Guard Tablet for visitor check-in, CCTV viewing, incident reporting, and SOS alerts. (No financial/amenity admin access).
7.  **Electrician / Cleaner (Staff):** Uses mobile app to view assigned tasks, clock-in/out via RFID, and upload proof of work.
8.  **Flat Owner / Resident:** Uses Resident App to pay dues, book amenities, pre-approve visitors, raise complaints, and vote in polls.
9.  **Tenant (Sub-Resident):** Restricted Resident App access. Can book amenities and log visitors, but cannot access property/financial management features.

---

## 3. Phased Roadmap (Development Milestones)
To prevent feature bloat, development is strictly phased. 

* **Phase 1 (MVP):** RFID access, Fee payment, Complaints/Helpdesk, Amenity booking, Visitor management.
* **Phase 2 (Growth):** WhatsApp integration, ANPR Parking AI, Staff Rosters.
* **Phase 3 (Scale):** Multi-society super admin dashboard, Hardware kit integration, Smart Utilities.
* **Phase 4 (Enterprise):** White-labeling, Premium AI Features (Face Recognition).

---

## 4. Functional Requirements (By Module)

### Module 1: Resident & Entry/Exit Tracking
* **RFID Gate Entry/Exit:** Auto-scan entering/exiting residents via UHF RFID. Record timestamp and instantly notify linked family members.
* **ANPR Vehicle Entry:** Camera reads number plates. Auto-open barrier for registered plates; flag unregistered.
* **Family Tracking:** Each family member has a unique RFID card linked to the flat.
* **Pedestrian Sub-Gate:** Separate RFID foot traffic log.
* **Domestic Worker Tracking:** Timed RFID tags for maids/cooks (active only during approved hours).
* **Late Night Alert:** Push notification triggered for entries after a configurable curfew time.
* **Fraud Detection:** AI flags if the same RFID UID is scanned at two locations in an impossible timeframe.
* *(Premium)* **Face Recognition Entry:** AI camera identifies registered residents without RFID tap.

### Module 2: Vehicle & Smart Parking Management
* **Assigned Slot DB:** Record of permanent assigned slots per flat. Admin can swap/revoke.
* **Live Parking Map:** App displays interactive map indicating free (green) or occupied (red) slots using IoT ultrasonic sensors.
* **Guest Booking & Overstay:** Residents can pre-book guest parking. System triggers an alert to the guard if the visitor overstays the booked time.
* **Vacant Slot Leasing:** Marketplace to lease owned slots to other residents for rental income.
* **EV Charging:** App-bookable EV slots. Metered usage (kWh) auto-added to the monthly bill.

### Module 3: Visitor & Delivery Management
* **Pre-Approved Pass:** Resident generates a time-limited OTP QR pass. Guard scans for instant entry.
* **Ad-Hoc Check-In:** Guard enters visitor name, photo, phone, and purpose via tablet. Sends push notification with photo to resident for 1-tap Approve/Deny.
* **Frequent Visitors:** Auto-approval configuration for regular guests (e.g., in-laws).
* **Delivery Fast-Track:** Agent logs parcel; resident gets "parcel arrived" notification. E-commerce companies (Amazon/Delhivery) get society delivery codes.
* **Blacklist:** Security can permanently blacklist a specific face/vehicle.

### Module 4: Amenity Booking & RFID Access
* **Time/Quota Enforcement:** System automatically denies RFID access if a resident exceeds usage limits (e.g., max 3 pool sessions/week).
* **Slot Booking:** App-based calendar booking for limited-capacity amenities (Movie Hall, Games Room). Door unlocks ONLY for booked residents' cards.
* **Committee Approval:** Large events (Community Hall) require digital committee approval and security deposit capture.
* **Parent Monitoring:** RFID logs when a child enters the Play Area and notifies the parent.
* **Maintenance Block:** Admin can block an amenity, auto-canceling bookings and notifying users.

### Module 5: Fee & Finance Management
* **Online Payments:** Razorpay integration (UPI, Card, Net Banking) with instant digital PDF receipt generation.
* **Auto-Reminders & Late Fees:** Automated alerts (7, 3, 1 days before due). System automatically applies configured late fee % post-due date.
* **Differential Pricing:** Ability to set different maintenance fees based on unit type (1BHK, 2BHK, Shop).
* **Expense Tracking:** Treasurer uploads bills categorized by utilities, salaries, etc.
* **Reports:** Auto-generated Defaulter Lists, P&L reports, and Budget vs. Actual spend dashboards.

### Module 6: Resident App Core Functions (Community)
* **Live Dashboard:** Unified view of pending dues, active bookings, unread notices.
* **In-App Chat & Forums:** Direct messaging to committee, and moderated community forum for discussions.
* **Notice Board & Documents:** Searchable archive for circulars, bye-laws, and AGM minutes.
* **Polls & Voting:** Digital voting for AGM resolutions and rule changes.
* **Skill Exchange & Marketplace:** Classifieds for unused items and local skill sharing (e.g., Yoga, Plumbing).

### Module 7: Staff & Vendor Management
* **RFID Clock-In/Out:** Timestamped attendance. Auto-alert to supervisor if staff is 15 mins late. (Optional biometric fallback).
* **Task Module:** Supervisor assigns tasks (e.g., Cleaning Zone A). Staff marks "Done" and uploads a photo proof.
* **Leave & Payroll:** Digital leave application. Attendance data feeds directly into monthly salary slip auto-calculation.
* **Resident Ratings:** Residents rate staff after interactions; aggregated in the admin panel.

### Module 8: Complaint & Helpdesk System
* **Categorized Tickets:** Resident raises a ticket (Plumbing, Electrical) with photos. System auto-generates Ticket ID.
* **SLA Timers & Escalation:** Pre-set timers (e.g., Electrical: 4 hrs). Auto-escalates to Supervisor/Committee if breached.
* **Resolution Proof:** Staff must upload before/after photos to close the ticket.
* **AI Helpdesk:** Chatbot answering FAQs (e.g., "What is my due date?").

### Module 9: Communications & Notifications
* **Omnichannel Alerts:** WhatsApp (Primary), Push (App), SMS (Fallback), Email (Reports).
* **Targeted Broadcasts:** Ability to message all residents, or isolate by Wing/Building.
* **Scheduled Notices:** Ability to queue a notice for a future time.
* **Read Receipts:** Admin dashboard showing which residents have read critical notices.

### Module 10: Security & Surveillance
* **Live CCTV & Motion:** Guard tablet streams live feeds. Motion detection in restricted areas triggers snapshot alerts.
* **SOS/Panic Button:** Digital app button and physical guard button alerting the entire committee.
* **Emergency Overrides:** Fire alarm integration auto-unlocks all RFID emergency doors.
* **Night Patrol:** Guards scan QR checkpoints on their route to log patrol completion.
* **Video Doorbell:** In-app video feed of flat door with one-tap electronic unlock.

### Module 11: Smart Utilities & IoT
* **Sub-Metering:** IoT meters for individual flat electricity and water. Data feeds directly into monthly billing.
* **Tank Level Monitoring:** Ultrasonic sensor on overhead tanks. Auto-starts pump on low level.
* **Predictive Maintenance:** AI analyzes pump/lift/generator data to predict failures.
* **Energy Leaderboard:** Gamified ranking of lowest-consumption flats to encourage savings.

### Module 12: Smart Parcel Lockers
* **RFID/Code Access:** Delivery agent uses a code to place parcel in an entrance locker. Resident uses RFID card to retrieve it.
* **Auto-Reminders:** System alerts resident if a parcel is uncollected for 24 hours. Moves to security after 72 hours.

---

## 5. Multi-Tenant Platform Administration
* **Bulk Onboarding:** Super Admin/Secretary can upload a CSV to auto-create user accounts and send WhatsApp welcome messages.
* **Tenant Sandboxing:** Society data must be completely isolated using Row-Level Security (RLS) or schema separation.
* **Audit Logging:** Every administrative action (fee changes, user deletion, rule overrides) is logged with a timestamp and user ID.

---

## 6. Non-Functional Requirements (NFRs)
1.  **Offline Resilience:** The Edge Server (Raspberry Pi) MUST maintain a local cache of authorized RFID UIDs to open gates if cloud connectivity drops.
2.  **Scalability:** The database must be designed to support hundreds of societies simultaneously without cross-tenant table locks.
3.  **Security:** All PII (Personally Identifiable Information) and financial transactions must be encrypted at rest and in transit.
4.  **Hardware Agnosticism:** The MQTT translation layer must be adaptable to standard Wiegand and RS-485 serial outputs from various hardware vendors.