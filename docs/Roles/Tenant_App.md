# Tenant (Sub-Resident) - Master Workflows & Responsibilities

## 1. The Boundary & End Goal
* **The Boundary:** Operates exclusively via the Mobile App. They have access to daily lifestyle features but are strictly blocked from the society’s financial ledgers, property tax records, and official committee voting (unless the owner delegates the vote).
* **The End Goal:** To enjoy a frictionless living experience, manage their own visitors, book amenities, and communicate with society staff without needing to contact the Owner for every small detail.

## 2. Onboarding & Lease Verification
* **Invitation-Based Login:** A Tenant cannot simply "join" a flat. They must be invited via the "Flat Owner" or "Secretary" using their mobile number.
* **Lease Document Upload:** During onboarding, the Tenant may be required to upload their Rental Agreement and Police Verification documents for Secretary approval.
* **Activation:** Once the Secretary clicks 'Approve', the Tenant’s app features are unlocked, and their RFID cards for gate access are activated.

## 3. Security & Visitor Management (Primary Use)
*The Tenant is the "Master of the Gate" for their stay duration.*
* **Visitor Approval:** Receives the real-time push notifications for guests, delivery boys, and cab drivers arriving for their flat.
* **Guest Pre-Approval:** Generates QR codes/OTPs for their own personal guests.
* **Daily Help Tracking:** Manages the "Maid/Cook" profile for the flat. They get the entry/exit alerts for the domestic help they have hired.

## 4. Amenity Booking & Quotas
* **Resource Usage:** Can book the Gym, Swimming Pool, or Clubhouse slots. 
* **Quota Sharing:** The system ensures the Tenant and Owner share the same "Unit Quota." (e.g., If a flat is allowed 4 gym sessions a week, and the Tenant uses all 4, the Owner cannot book more).
* **Paid Amenities:** If an amenity requires a fee, the Tenant pays it directly via the app, but the receipt is also visible to the Owner for transparency.

## 5. Helpdesk & Maintenance
* **Operational Tickets:** Can raise tickets for immediate repairs (e.g., "Leaking pipe," "Common area light fused"). 
* **Billing Dispute:** Can only raise disputes regarding *usage-based* bills (like water or electricity) but cannot dispute the core Property Maintenance Fee (which is the Owner's responsibility).
* **Staff Rating:** Provides feedback and ratings for the staff who attend to their flat's repairs.

## 6. Community & Communication
* **Notice Board:** Can read all general society notices and circulars.
* **Forum Access:** Can participate in the Community Forum and Marketplace (e.g., "Selling an old sofa," "Looking for a carpool").
* **Restricted Voting:** By default, the Tenant cannot vote in official Committee Elections or major financial decisions. They only see "Polls" related to lifestyle (e.g., "What should be the theme for the Holi party?").

## 7. Financial Responsibility (Limited)
* **Utility Payments:** If the society charges for Water, Electricity, or Gas via the app, the Tenant is the one who pays these bills.
* **Payment History:** Can see the history of the bills *they* have paid, but cannot see the historical maintenance debt of the Owner.

## 8. Offboarding & Move-Out
* **Move-Out Request:** When the lease ends, the Tenant initiates a "Move-Out Request" in the app.
* **NOC Workflow:** This triggers a notification to the Secretary to check for any damages or unpaid utility bills. 
* **Access Revocation:** On the Move-Out date, the system automatically wipes the Tenant’s data from the ANPR (Vehicle) whitelist and deactivates their RFID cards and App access for that society.


## 9. Delegated IoT & Smart Home Interactions (Inputs & Outputs)
*The Tenant experiences the society's hardware as a seamless layer of convenience for daily living. However, their access to the physical hardware is entirely dependent on the active status of their lease and can be instantly severed by the Owner or Secretary.*

### A. Hardware Inputs (Data Flowing from Edge Pi/Sensors -> Tenant App)
*This is the real-time telemetry the hardware pushes to the Tenant regarding their daily lifestyle and visitors.*
* **The "Digital Doorbell" (Gate Telemetry):** Real-time push notifications containing AI-captured snapshots from the gate hardware when a guest or delivery arrives specifically for their flat.
* **Delegated ANPR/RFID Movement Logs:** Notifications generated whenever a physical credential associated with the *Tenant's* profile is used (e.g., "Your bike [KA-01-XX-9876] exited the gate," or "Your hired maid scanned her RFID").
* **Prepaid/Usage Utility Dashboards:** Live data feeds from the physical smart meters installed for their flat. Since the Tenant pays for what they consume, the app translates raw IoT pulse data into live usage costs (e.g., "You have consumed ₹450 of Prepaid Electricity today").
* **Amenity Access Rejections:** If the Tenant attempts to scan their phone at the Gym but the Flat Owner hasn't paid the core maintenance bill, the Edge Pi rejects the Tenant and the app displays the hardware log (e.g., "Access Denied: Owner Dues Pending").

### B. Hardware Outputs (Commands Flowing from Tenant App -> Edge Pi/Hardware)
*These are the remote commands the Tenant is permitted to execute via their smartphone to control their immediate environment.*
* **Remote Gate Relay Trigger (The "Approve" Button):** Tapping "Approve" on their phone sends a cloud-to-edge command that physically triggers the boom barrier or pedestrian turnstile for their visitors.
* **BLE / NFC Mobile Access (Phone as a Key):** Using their smartphone's Bluetooth or NFC to communicate directly with the society's IoT wall readers to unlock the lobby doors, elevators, or clubhouse.
* **The SOS Siren Trigger (Panic Button):** Pressing the SOS button on the app fires a critical priority payload to the Edge Pi, triggering the physical alarm on the Guard's tablet and identifying the Tenant's exact flat number.
* **Pre-Approved QR Generation:** Generating time-bound QR codes on their phone. When the Tenant's guest scans this code at the physical boom barrier, the local hardware validates the token and opens the gate.
* **Zero-Touch Access Expiration (System Automated Output):** While not triggered manually by the Tenant, this is the most critical hardware rule. On the exact date of the Tenant's registered "Move-Out," their app loses the ability to send commands, and the cloud automatically instructs the Edge Pi to delete the Tenant's BLE keys, RFID tags, and ANPR whitelists from the local physical memory.