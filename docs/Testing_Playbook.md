# 🧪 SmartSociety 360 — Manual Testing Playbook

> **Purpose:** Step-by-step guide to manually test every feature, organized as a real society's daily life.

---

## 🚀 Step 0: Start Everything

Open **3 terminals** and run:

```bash
# Terminal 1 — Backend
cd D:\Smart_Society\backend-api
npx prisma db push          # Sync schema to DB
npx prisma db seed          # Create test data (all 9 roles)
npm run start:dev            # Starts on http://localhost:8000

# Terminal 2 — Frontend
cd D:\Smart_Society\web-app
npm run dev                  # Starts on http://localhost:5173

# Terminal 3 — Swagger (for API testing)
# Open browser: http://localhost:8000/api
```

---

## 🔑 Test Accounts

| Role | Email | Password | What They Can Do |
|:-----|:------|:---------|:-----------------|
| **SUPER_ADMIN** | `admin@alpha.test` | `Test@1234` | Everything — God mode |
| **PRESIDENT** | `president@alpha.test` | `Test@1234` | Approve expenses, waive fees, emergency broadcast |
| **SECRETARY** | `secretary@alpha.test` | `Test@1234` | Add members, post notices, manage property |
| **TREASURER** | `treasurer@alpha.test` | `Test@1234` | Generate invoices, record expenses, view reports |
| **SUPERVISOR** | `supervisor@alpha.test` | `Test@1234` | Assign tasks, manage staff, view escalated tickets |
| **FLAT_OWNER** | `owner@alpha.test` | `Test@1234` | Pay dues, raise complaints, pre-approve visitors |
| **TENANT** | `tenant@alpha.test` | `Test@1234` | Same as owner but with fewer governance rights |
| **SECURITY_GUARD** | `guard@alpha.test` | `Test@1234` | Check-in visitors, blacklist, view gate logs |
| **STAFF** | `staff@alpha.test` | `Test@1234` | View assigned tasks, mark attendance |

---

## 📋 Testing Scenarios (Do Them In Order)

### Act 1: Society Setup (Secretary)
*Login as:* `secretary@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 1 | View members | Sidebar → Users | See all 9 seeded users in table |
| 2 | View property | Sidebar → Property | See Tower A (10 floors), Tower B (8 floors), 4 units |
| 3 | Post a notice | Sidebar → Communications → Create Notice | Title: "Water tank cleaning tomorrow", Category: MAINTENANCE |
| 4 | View notices | Check the notice appears in the list with your name as author |

---

### Act 2: Finance (Treasurer)
*Login as:* `treasurer@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 5 | View fee rules | Sidebar → Finance → Rules | See BHK2=₹3,500 and BHK3=₹4,500 |
| 6 | Generate monthly invoices | Finance → "Generate Batch" button | Should create invoices for all 4 occupied units |
| 7 | View invoices | Finance → Invoices tab | 4 invoices: 2 × ₹4,500 (BHK3) + 2 × ₹3,500 (BHK2) |
| 8 | Record an expense | Finance → Expenses → Add: "Security camera repair ₹8,000" | Status should be PENDING (needs President approval!) |
| 9 | View financial report | **Swagger:** `GET /api/v1/finance/reports/summary` | Shows P&L, collection rate, expense breakdown |

---

### Act 3: Presidential Approvals (President)
*Login as:* `president@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 10 | Approve expense | **Swagger:** `PATCH /api/v1/finance/expenses/{id}/approve` | Status changes PENDING → APPROVED |
| 11 | Waive a fee | **Swagger:** `PATCH /api/v1/finance/invoices/{id}/waive` | Invoice status → WAIVED |
| 12 | View defaulters | **Swagger:** `GET /api/v1/finance/defaulters?days=0` | Returns invoices overdue > 0 days |

---

### Act 4: Resident Daily Experience (Flat Owner)
*Login as:* `owner@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 13 | Dashboard | Should auto-load | Shows pending dues, notices, visitor count |
| 14 | View payments | Sidebar → Payments | See current dues + payment history (after paying) |
| 15 | View notices | Sidebar → Notices | See secretary's notice + welcome notice |
| 16 | View amenities | Sidebar → Amenities | See Pool, Gym, Hall, Games with quotas |
| 17 | View parking | Sidebar → Parking | See assigned slot P-B01 with vehicle KA-05-EF-9012 |
| 18 | View RFID | Sidebar → Family & RFID | See RFID-A002 card marked ACTIVE |
| 19 | Raise a complaint | Sidebar → Helpdesk → New Ticket | Title: "Lift B stuck", Category: "Electrical", Priority: HIGH |
| 20 | Pre-approve visitor | Sidebar → Visitors → Generate Pass | Name: "Delivery Amazon", Purpose: "Parcel" |
| 21 | Community page | Sidebar → Community | Documents tab pulls live notices; Polls shows "coming soon" |

---

### Act 5: Guard Gate Operations (Security Guard)
*Login as:* `guard@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 22 | View visitor queue | Sidebar → Visitors | See the visitor pre-approved by the owner in Act 4 |
| 23 | Check-in visitor | Click "Check In" on the Amazon delivery | Status changes UPCOMING → CHECKED_IN with timestamp |
| 24 | Check-out visitor | Click "Check Out" | Status → COMPLETED with checkout time |
| 25 | Blacklist a visitor | **Swagger:** `PATCH /api/v1/visitors/{id}/reject` | Status → REJECTED |
| 26 | View blacklist | **Swagger:** `GET /api/v1/visitors/blacklist` | Shows rejected visitor in the list |

---

### Act 6: Emergency Scenarios
*Login as:* `owner@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 27 | **SOS Panic** | **Swagger:** `POST /api/v1/security/sos` with `{ "location": "Lift B" }` | Creates CRITICAL complaint + broadcast + gate log |

*Login as:* `president@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 28 | **Emergency Broadcast** | **Swagger:** `POST /api/v1/security/emergency-broadcast` with `{ "title": "Gas Leak", "message": "Evacuate Tower B" }` | Creates pinned EMERGENCY notice + broadcast record |

---

### Act 7: Staff & Helpdesk Operations (Supervisor)
*Login as:* `supervisor@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 29 | View all complaints | Sidebar → Helpdesk | See "Lift B stuck" from Act 4 + SOS ticket from Act 6 |
| 30 | Assign ticket to staff | Update ticket status → ASSIGNED with assignedToId | Staff member gets the ticket |
| 31 | View staff | Sidebar → Staff | See Babu Plumber, Suresh Electrician, Lakshmi Cleaner |
| 32 | Log attendance | **Swagger:** `POST /api/v1/staff/attendance` | Mark Babu as PRESENT today |

*Login as:* `owner@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 33 | Rate staff | **Swagger:** `POST /api/v1/complaints/{id}/rate` with `{ "rating": 4 }` | Staff rating updated |

---

### Act 8: Elections (President)
*Login as:* `president@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 34 | Create election | Sidebar → Elections → Start New | Title: "President Election 2026", add 2 candidates |
| 35 | Cast vote | Login as `owner@alpha.test` → Vote | Vote count increments, quorum % updates live |
| 36 | Seal election | Login as `president@alpha.test` → Resolve | Winner auto-becomes PRESIDENT, old president → FLAT_OWNER |

---

### Act 9: Member Lifecycle (Secretary)
*Login as:* `secretary@alpha.test`

| # | Test | What To Do | Expected Result |
|:--|:-----|:-----------|:----------------|
| 37 | Move out tenant | **Swagger:** `POST /api/v1/users/{tenant-id}/move-out` | Calculates dues, revokes RFID, generates NOC |
| 38 | Transfer flat | **Swagger:** `POST /api/v1/users/transfer` with `{ "ownerId": "...", "tenantUserId": "..." }` | Owner RFID blocked, tenant gets unit access |

---

## 🔍 Quick RBAC Verification Checklist

Try these "deny" cases to verify security:

| # | Test | Login As | Try To Do | Expected |
|:--|:-----|:---------|:----------|:---------|
| 39 | Guard can't approve expenses | `guard@alpha.test` | `PATCH /finance/expenses/:id/approve` | **403 Forbidden** |
| 40 | Resident can't see all invoices | `owner@alpha.test` | `GET /finance/invoices` (no unitId) | Only sees their own unit's invoices |
| 41 | Staff can't post notices | `staff@alpha.test` | `POST /communications/notices` | **403 Forbidden** |
| 42 | Treasurer can't waive fees | `treasurer@alpha.test` | `PATCH /finance/invoices/:id/waive` | **403 Forbidden** (President only) |

---

## 💡 Testing Tips

1. **Use Swagger for API-only endpoints** — Open `http://localhost:8000/api` → Click "Authorize" → Paste your JWT token
2. **Get your JWT token** — Login via `POST /api/v1/auth/login` with email + password → copy the `access_token`
3. **Use two browser windows** — One incognito for a different role
4. **Check the terminal** — CRON job logs appear in the backend console (late fees, SLA checks)
5. **Prisma Studio** — Run `npx prisma studio` to browse your database visually at `http://localhost:5555`
