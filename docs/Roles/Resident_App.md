# Flat Owner (Resident) - Master Workflows & Responsibilities

## 1. The Boundary & End Goal
* **The Boundary:** Operates exclusively via the Mobile App (iOS/Android). They have full access to their own flat's data, billing, and visitors, but zero access to other residents' private info or society-wide financial ledgers.
* **The End Goal:** To manage their household's security, finances, and community interactions entirely from their smartphone—ensuring their family is safe and their dues are paid without physical paperwork.

## 2. Onboarding & Household Setup
* **Secure Login:** Authenticates via Mobile Number + OTP. 
* **Unit Verification:** Upon first login, they see their assigned Unit (e.g., "Tower C - 504"). They must verify their residency (often via a one-time code provided by the Secretary).
* **Family & Tenant Management:** * Add Family Members: Grants app access to spouse/children.
    * Manage Tenants: If the owner rents out the flat, they use this module to "Invite Tenant," which transfers daily operational rights (amenities/visitors) to the tenant while the owner keeps the financial oversight.
* **Vehicle Registration:** Uploads vehicle details and license plates for ANPR-automated gate entry.

## 3. Security & Visitor Control (The "Digital Doorbell")
*This is the most used feature in the app.*
* **Real-Time Approval:** Receives a push notification with a photo when a visitor/delivery person arrives at the gate. Buttons: [Approve] or [Deny].
* **Pre-Approval (Expected Guests):** Creates a "Guest Invite." The app generates a QR code or an OTP that the resident sends to the guest via WhatsApp. 
* **Daily Help Management:** Receives a notification the moment their Maid, Cook, or Driver scans their RFID card at the gate ("Ramu (Driver) has entered the society").
* **Kid Exit Alerts:** Sets a rule that their child cannot leave the gate unless the resident taps a "Digital Exit Pass" on the app.

## 4. Financial Management (The Digital Wallet)
* **Maintenance Payments:** Views current and past invoices.
* **Instant Pay:** Integrated Checkout (Razorpay) to pay dues via UPI, Card, or NetBanking.
* **Payment History:** Downloads PDF receipts for every payment made since onboarding.
* **Utility Tracking:** Views live dashboards of water and electricity consumption (if smart meters are installed).

## 5. Helpdesk & Maintenance Requests
* **Ticket Creation:** Raises a complaint (e.g., "AC not working," "Water seepage"). Can record a video or take a photo of the issue.
* **Live Tracking:** Sees the status of the ticket: [Pending] -> [Assigned to Electrician] -> [In Progress] -> [Resolved].
* **Staff Rating:** Once the job is done, the resident provides a 1–5 star rating and feedback, which directly impacts the staff's performance record.

## 6. Community & Lifestyle
* **Amenity Booking:** Checks availability for the Clubhouse, Tennis Court, or Community Hall on a calendar and books a slot instantly.
* **Digital Notice Board:** Receives official circulars and notices from the Secretary.
* **Community Forum & Polls:** Participates in society discussions and casts a digital vote on society decisions (e.g., "Should we renovate the park?"). 1 vote per flat is strictly enforced.
* **Classifieds/Marketplace:** Posts items for sale or looks for services within the society (e.g., "Looking for a Yoga teacher").

## 7. Emergency & Safety
* **SOS / Panic Button:** A prominent button on the home screen. When pressed, it triggers a loud alarm on the Guard's tablet and the Supervisor's phone, sharing the resident's exact flat location.
* **Emergency Broadcasts:** Receives high-priority alerts from the President (e.g., "Fire Drill at 4:00 PM").

## 8. Delivery & Services
* **Parcel Management:** Receives a notification when a parcel is left at the gate. The app provides a "Collection OTP" to show the guard when picking it up.
* **Service Discovery:** Views a directory of society-verified vendors (Plumbers, Carpenters, Grocery Stores) with their contact details.


## 9. IoT & Smart Home Interactions (Inputs & Outputs)
*The Resident experiences the society's hardware as a seamless layer of convenience and security. The hardware recognizes them automatically, and their mobile app acts as a remote control for physical barriers and a dashboard for their home's physical metrics.*

### A. Hardware Inputs (Data Flowing from Edge Pi/Sensors -> Resident App)
*This is the personalized, highly specific telemetry the hardware pushes to the resident about their own family, assets, and flat.*
* **The "Digital Doorbell" (Gate Telemetry):** Real-time push notifications containing AI-captured snapshots from the gate hardware. (e.g., "Swiggy Delivery is at Gate 1" with a photo of the rider, triggered by the Guard's tablet or an automated intercom terminal).
* **Automated ANPR/RFID Movement Logs:** Silent notifications or log entries generated whenever a physical credential associated with their flat is used. (e.g., "Your Honda City [AP-31-XX-1234] entered the main gate," or "Raju (Driver) scanned his RFID card").
* **Smart Utility Consumption Dashboards:** Live data feeds from the physical smart meters installed in their specific shaft. Translating raw IoT pulse data into readable graphs (e.g., "You have consumed 450 Liters of water today" or "Live Electricity Load: 2.4 kW").
* **Smart Parking Sensor Status:** If ultrasonic sensors are installed over parking bays, the app shows a live visual indicator of their specific deeded parking slot (e.g., alerting them if their designated slot is currently marked as 'Occupied' when their own car is not there).
* **Amenity Access Denial Alerts:** If the resident taps their phone or card at the Gym and the door does not open, the app instantly receives the exact hardware rejection reason (e.g., "Access Denied: Weekly Quota Exceeded" or "Access Denied: Maintenance Fees Overdue").

### B. Hardware Outputs (Commands Flowing from Resident App -> Edge Pi/Hardware)
*These are the remote commands the Resident executes via their smartphone to manipulate the physical environment of the society.*
* **Remote Gate Relay Trigger (The "Approve" Button):** When a guest is waiting at the gate, the resident tapping "Approve" on their phone sends a cloud-to-edge command that physically triggers the boom barrier or pedestrian turnstile to open, bypassing the Guard entirely.
* **BLE / NFC Mobile Access (Phone as a Key):** Instead of carrying a physical plastic RFID card, the resident can use their smartphone's Bluetooth Low Energy (BLE) or NFC to communicate directly with the society's IoT wall readers to unlock the lobby doors, elevators, or clubhouse.
* **The SOS Siren Trigger (Panic Button):** Pressing the SOS button on the app's home screen fires a critical priority payload to the Edge Pi. This instantly triggers the physical alarm buzzer on the Guard's tablet, and if configured, can sound a localized physical siren in the resident's specific floor corridor.
* **Pre-Approved QR Generation:** The app generates a cryptographically secure, time-bound QR code. While the generation happens in the app, the "Output" is realized when the guest holds the phone up to the physical QR scanner at the boom barrier, forcing the local hardware to validate the token and open the gate.
* **Smart EV Charger Activation:** If the resident is using a society-owned electric vehicle charging station, they scan the station's QR code with their app to digitally authorize the session, which commands the local hardware to energize the physical charging plug.