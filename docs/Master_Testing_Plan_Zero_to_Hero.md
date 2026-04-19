# 🧪 Master Testing Plan: Zero to Hero (No Seed Data)

> **Purpose:** Test the absolute entirety of the SmartSociety 360 platform from a blank database. You will create everything manually exactly as a real SaaS startup would onboard their first client.

---

## 🛠️ Step 0: The Hard Reset (Wipe Everything)
We have prepared a special script that deletes **everything** in your database and creates exactly **one** God-Mode Super Admin account using your email.

Open a terminal in the backend:
```bash
cd backend-api
npx ts-node prisma/bootstrap-admin.ts
```
*Your login is now:*
- **Email:** `jaswanthvanapalli12@gmail.com`
- **Password:** `1234567890`

Start the backend and frontend:
```bash
npm run start:dev  # In backend
npm run dev        # In web-app
```
**Tip:** Keep **Swagger UI** (http://localhost:8000/api) open to test backend endpoints directly while you build out the frontend. To use Swagger, click "Authorize" at the top right and paste the JWT token you receive when you login.

---

## 🏙️ Phase 1: SaaS Platform Onboarding
*We act as the SaaS Platform Owner.*

### Test 1: Platform Login
- **Swagger endpoint:** `POST /api/v1/auth/login`
- **Body:** `{ "email": "jaswanthvanapalli12@gmail.com", "password": "1234567890" }`
- **Expected:** Login succeeds, returns a JWT `access_token` and `user.role` = `SUPER_ADMIN`.
- *Action:* Copy this Bearer token into Swagger's Authorize button.

### Test 2: Create the First Client Society
- **Swagger endpoint:** `POST /api/v1/tenants`
- **Body:**
```json
{
  "name": "Galaxy Heights",
  "slug": "galaxy-heights",
  "address": "100 Outer Ring Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "totalUnits": 500,
  "subscriptionTier": "ENTERPRISE",
  "adminName": "Jaswanth President",
  "adminEmail": "president@galaxy.com",
  "adminPhone": "9999999991"
}
```
- **Expected:** The system creates the society `Galaxy Heights`, creates a Tower A by default, and provisions a new `PRESIDENT` user account for `president@galaxy.com`. An email is theoretically sent via SMTP with their generated password. The API response will show the generated password in the `generatedPassword` field. **NOTE THIS GENERATED PASSWORD DOWN.**

### Test 3: Platform Analytics
- **Swagger endpoint:** `GET /api/v1/tenants/analytics`
- **Expected:** Shows 1 active society, MRR equal to subscription price, total residents = 1 (the president).

---

## 🔑 Phase 2: President Setup
*We now act as the `PRESIDENT` of Galaxy Heights.*

### Test 4: President Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Body:** `{ "email": "president@galaxy.com", "password": "<password_from_test_2>" }`
- *Action:* Update your Swagger Bearer Token with the President's JWT token. This ensures all your next requests are bound to Galaxy Heights.

### Test 5: Add a new Building / Tower
- **Endpoint:** `POST /api/v1/property/buildings`
- **Body:** `{ "name": "Tower B", "floors": 15 }`
- **Expected:** Returns new building ID.

### Test 6: Add Flats (Units)
- **Endpoint:** `POST /api/v1/property/units`
- **Body:**
```json
{
  "flatNumber": "B-101",
  "floor": 1,
  "type": "BHK2",
  "sqft": 1000,
  "occupancy": "VACANT",
  "buildingId": "<id_from_test_5>"
}
```
- *Action:* Create another unit (BHK3) as well. Call it `A-101` and assign it to Tower A.

### Test 7: Add Parking Slots
- **Endpoint:** `POST /api/v1/property/parking`
- **Body:**
```json
{
  "slotNumber": "P-01",
  "zone": "Basement 1",
  "vehicleType": "CAR",
  "status": "AVAILABLE"
}
```

---

## 👪 Phase 3: Bringing in the People
*As the President, onboard your committee and residents.*

### Test 8: Hire a Secretary
- **Endpoint:** `POST /api/v1/users`
- **Body:**
```json
{
  "name": "Sita Secretary",
  "email": "secretary@galaxy.com",
  "phone": "9999999992",
  "role": "SECRETARY",
  "password": "Password@123"
}
```

### Test 9: Add a Flat Owner
- **Endpoint:** `POST /api/v1/users`
- **Body:**
```json
{
  "name": "Ravi Owner",
  "email": "owner@galaxy.com",
  "phone": "9999999993",
  "role": "FLAT_OWNER",
  "password": "Password@123",
  "unitId": "<id_of_unit_B-101>"
}
```

### Test 10: The Owner rents it out (Owner -> Tenant Transfer)
- Let's say Ravi rents his flat to John. First, create John.
- **Endpoint:** `POST /api/v1/users`
- **Body:**
```json
{
  "name": "John Tenant",
  "email": "tenant@galaxy.com",
  "phone": "9999999994",
  "role": "TENANT",
  "password": "Password@123"
}
```
- **Endpoint:** `POST /api/v1/users/transfer`
- **Body:**
```json
{
  "ownerId": "<id_of_Ravi>",
  "tenantUserId": "<id_of_John>"
}
```
- **Expected:** Ravi loses access to the flat (RFID blocked), John is assigned B-101, and flat status changes to RENTED.

---

## 🔧 Phase 4: Amenities and Staff (Secretary Flow)
*Login as: `secretary@galaxy.com` (Password: Password@123)*

### Test 11: Add a Pool and a Gym
- **Endpoint:** `POST /api/v1/amenities`
- **Body (Pool):**
```json
{
  "name": "Infinity Pool",
  "maxCapacity": 20,
  "quotaPerWeek": 4,
  "timings": "6 AM - 8 PM",
  "rfidRequired": true
}
```
- *Action*: Do the same for a Gym.

### Test 12: Hire a Plumber
- **Endpoint:** `POST /api/v1/staff`
- **Body:**
```json
{
  "name": "Raju Plumber",
  "phone": "1231231234",
  "role": "Plumber",
  "department": "Maintenance",
  "shift": "DAY"
}
```

### Test 13: Hire a Security Guard
- **Endpoint:** `POST /api/v1/users` (Guards need login access to the software, unlike regular ground staff)
- **Body:**
```json
{
  "name": "Govind Guard",
  "email": "guard@galaxy.com",
  "phone": "8888888888",
  "role": "SECURITY_GUARD",
  "password": "Password@123"
}
```

---

## 💰 Phase 5: Finance & Dues (Treasurer/President Flow)
*Login back as `president@galaxy.com`*

### Test 14: Setup Fee Rules
- **Endpoint:** `POST /api/v1/finance/rules`
- **Body:** `{ "unitType": "BHK2", "baseAmount": 4000, "lateFeePercent": 5, "dueDay": 5 }`
- *Action:* Setup a rule for BHK3 as well.

### Test 15: Run the Batch Invoice Generator
- **Endpoint:** `POST /api/v1/finance/invoices/generate-batch`
- **Body:** `{}`
- **Expected:** An invoice of ₹4000 is generated for John the Tenant (since he lives in B-101, a BHK2).

### Test 16: Resident Pays the Due
- *Login as `tenant@galaxy.com`*
- **Endpoint:** `POST /api/v1/finance/invoices/<invoice_id>/pay`
- **Body:** `{ "method": "UPI", "transactionId": "TRX987654321" }`
- **Expected:** Invoice status becomes PAID.

### Test 17: Maker-Checker Expense (The Big Purchase)
- *Login as `secretary@galaxy.com`*
- **Endpoint:** `POST /api/v1/finance/expenses`
- **Body:** `{ "title": "Buy new lift motor", "amount": 45000, "category": "REPAIR" }`
- **Expected:** Expense goes into `PENDING` state.
- *Login as `president@galaxy.com`*
- **Endpoint:** `PATCH /api/v1/finance/expenses/<expense_id>/approve`
- **Expected:** Status changes to `APPROVED`.

---

## 🛡️ Phase 6: External Visitors and Security Gate
*Login as `tenant@galaxy.com` (Resident)*

### Test 18: Pre-Approve Swiggy Delivery
- **Endpoint:** `POST /api/v1/visitors`
- **Body:**
```json
{
  "name": "Swiggy Guy",
  "phone": "1112223334",
  "purpose": "Food Delivery",
  "visitorType": "DELIVERY",
  "expectedDate": "2026-04-19T20:00:00Z"
}
```

*Login as `guard@galaxy.com` (Guard)*

### Test 19: Check-in Swiggy
- **Endpoint:** `PATCH /api/v1/visitors/<visitor_id>/checkin`
- **Expected:** Status changes to `CHECKED_IN`.

### Test 20: Blacklist an Unwanted Visitor
- **Endpoint:** `PATCH /api/v1/visitors/<visitor_id>/reject`
- **Expected:** Visitor marked as `REJECTED`.
- Check blacklist: `GET /api/v1/visitors/blacklist`

---

## 🆘 Phase 7: Emergencies & Escapes

### Test 21: Resident triggers SOS
*Login as `tenant@galaxy.com`*
- **Endpoint:** `POST /api/v1/security/sos`
- **Body:** `{ "location": "Basement Parking" }`
- **Expected:** A `CRITICAL` ticket is added to helpdesk, a `GateLog` entry goes off, and a system broadcast is recorded.

### Test 22: President Evacuation Alert
*Login as `president@galaxy.com`*
- **Endpoint:** `POST /api/v1/security/emergency-broadcast`
- **Body:** `{ "title": "FIRE IN TOWER A", "message": "Evacuate immediately via stairs, do not use lifts." }`
- **Expected:** Creates a globally pinned high-priority notice.

---

## 🎫 Phase 8: Helpdesk & Maintenance (The Plumber)
*Login as `tenant@galaxy.com`*

### Test 23: Raise a Ticket
- **Endpoint:** `POST /api/v1/complaints`
- **Body:** `{ "title": "Sink is leaking", "category": "PLUMBING", "priority": "MEDIUM", "description": "Kitchen pipe burst" }`

*Login as `president@galaxy.com`*

### Test 24: Assign flat's ticket to Plumber
- **Endpoint:** `PATCH /api/v1/complaints/<complaint_id>/status`
- **Body:** `{ "status": "ASSIGNED", "assignedToId": "<id_of_raju_plumber_from_test_12>" }`

### Test 25: Resident Rates the Plumber
*Login as `tenant@galaxy.com`*
- First, mark the ticket as `RESOLVED`.
- **Endpoint:** `POST /api/v1/complaints/<complaint_id>/rate`
- **Body:** `{ "rating": 5 }`
- **Expected:** Plumber's average rating increases.

---

## 🗳️ Phase 9: Democracy (Elections)
*Login as `president@galaxy.com`*

### Test 26: Create Election
- **Endpoint:** `POST /api/v1/elections`
- **Body:**
```json
{
  "title": "Secretary Election 2026",
  "endDate": "2026-05-01T00:00:00Z",
  "candidates": [
    { "name": "Sita Secretary", "biography": "Incumbent" },
    { "name": "John Tenant", "biography": "Challenger" }
  ]
}
```

### Test 27: Cast a Vote
*Login as `tenant@galaxy.com`*
- **Endpoint:** `POST /api/v1/elections/<election_id>/vote`
- **Body:** `{ "candidateId": "<id_of_john>" }`

### Test 28: Close the Election
*Login as `president@galaxy.com`*
- **Endpoint:** `POST /api/v1/elections/<election_id>/resolve`
- **Expected:** Because "John Tenant" won, John is automatically promoted to `PRESIDENT` role and the old president is demoted to `FLAT_OWNER`.

---

## 👋 Phase 10: Offboarding and Destruction
*Login as `secretary@galaxy.com`*

### Test 29: Tenant John asks for NOC and Moves Out
- **Endpoint:** `POST /api/v1/users/<id_of_john>/move-out`
- **Expected:** Calculates if John has any unpaid invoices. Revokes all his RFID cards. Kicks him out of unit B-101. Sets unit B-101 back to `VACANT`. Generates an NOC (No Objection Certificate) JSON receipt.

---

### 🎉 Test Complete
If you make it through Test 29:
1. You have fully tested SaaS onboarding (Zero to One).
2. You have tested Multi-Tenancy (your requests isolated to Galaxy Heights).
3. You have tested completely manual setups for property, finance, staff, and access control.
4. You have tested Tiers 1 and 2 end-to-end exactly as a real user would.

You are now a true **SmartSociety 360 Subject Matter Expert.**
