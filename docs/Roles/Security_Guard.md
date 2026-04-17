# Security Guard (Gate Operations) - Master Workflows & Responsibilities

## 1. The Boundary & End Goal
* **The Boundary:** The Guard operates strictly through the Tablet/Mobile interface. They have zero access to financial ledgers, member contact directories (unless searching for a specific check-in), or society-wide settings.
* **The End Goal:** To ensure 100% verified entry for every person and vehicle, maintain a "Zero-Unauthorized-Entry" record, and act as the first responder to physical emergencies within the society.

## 2. Authentication & Station Setup
* **Device Login:** Authenticates via a dedicated Guard Tablet at the security cabin. Usually uses a simplified PIN or Biometric login for quick shift handovers.
* **Station Assignment:** Upon login, the Guard selects their current post (e.g., "Main Gate Entry," "Tower B Lobby," or "Service Gate"). This ensures that logs are tied to a specific physical location.

## 3. Visitor Management (The High-Traffic Loop)
*This is the Guard's primary activity. Speed and accuracy are critical here.*
* **Unannounced Visitor Entry:**
    1. Capture: Scans the visitor’s ID or enters their phone number.
    2. Photo: Captures a real-time photo of the visitor and their vehicle plate.
    3. Purpose: Selects the purpose (Delivery, Guest, Service).
    4. Verification: Triggers a "Digital Doorbell" (Push Notification) to the Resident.
    5. Action: Only taps "Entry Allowed" once the Resident approves via the app or the Guard receives a manual intercom confirmation.
* **Pre-Approved Guest Entry:**
    1. QR Scan: Scans the QR code shown by the visitor on their phone.
    2. Validation: The system instantly checks the code against the Cloud Backend.
    3. Auto-Pass: If valid, the Guard simply waves them through; the system auto-logs the entry.
* **Frequent Entry (Daily Help/Maids):**
    1. Scans the maid/cook’s RFID card.
    2. The system displays the staff member’s photo and their "Allowed Time Window."
    3. The Guard verifies the face matches the photo and allows entry.

## 4. Vehicle & Parking Control
* **ANPR Monitoring:** Watches the live feed from the AI cameras.
* **Blacklist Alerts:** Receives an instant vibration/sound alert if a blacklisted vehicle (e.g., a banned ex-tenant or a marked "troublemaker") is detected at the gate.
* **Overflow Management:** If a visitor's vehicle enters, the Guard assigns a specific "Visitor Parking Slot" from the available inventory shown on their tablet.

## 5. Delivery & Parcel Management
* **Parcel Logging:** If a resident is not home, the Guard scans the courier's barcode and logs the parcel into the "Digital Lege." 
* **Secure Handover:** When the resident comes to collect the parcel, the Guard verifies the "Collection OTP" provided by the resident before marking the parcel as "Delivered."

## 6. Security Patrols & Verification
* **Night Patrol (Digital Guard Tour):** During their shift, the Guard must physically walk to various "Checkpoints" (hidden QR codes or NFC tags) around the society and scan them.
* **Incident Reporting:** If the Guard finds a broken pipe, a faulty light, or a suspicious bag, they take a photo and raise an "Incident Report" which instantly alerts the Supervisor.

## 7. Emergency & SOS Response
* **Panic Alert Receiver:** The Guard Tablet acts as the primary "Siren." If a resident presses the SOS button in their app, the Guard's tablet screams and shows the exact flat number and GPS location of the resident.
* **Gate Override:** In case of fire (confirmed by the Supervisor/President), the Guard uses the "Panic Open" button to keep all boom barriers in the 'UP' position for fire engines.
* **Manual Trigger:** If the IoT system fails, the Guard has a "Manual Open" button on the tablet that bypasses the cloud and talks directly to the Edge Pi via the local network to open the gate.

## 8. Material In/Out Management
* **Gate Pass Verification:** For commercial entries (e.g., a resident moving out with furniture), the Guard checks the "Digital Gate Pass" issued by the Secretary. 
* **Inventory Check:** Matches the physical items in the truck against the digital list in the Gate Pass before allowing the vehicle to exit the society.



## 9. IoT & Physical Gate Controls (Inputs & Outputs)
*The Security Guard interacts with the hardware in real-time, high-traffic scenarios. The hardware tells the Guard what is happening at the gate, and the Guard uses their tablet to physically command the barriers.*

### A. Hardware Inputs (Data Flowing from Edge Pi/Sensors -> Guard Tablet)
*This is the real-time physical telemetry the Guard relies on to make split-second entry decisions.*
* **Live ANPR (AI Camera) Feeds:** The tablet constantly receives matched data from the gate cameras. When a car pulls up, the hardware instantly pushes the license plate number to the tablet screen, color-coded as Green (Resident/Auto-Open), Yellow (Pre-Approved Visitor), or Red (Blacklisted).
* **RFID / Biometric Scan Results:** When a staff member, maid, or resident taps their physical card at the pedestrian turnstile, the Edge Pi pushes the card's data to the tablet. The Guard instantly sees the person's photo, name, and access status (Allowed/Denied) to physically verify they match the card.
* **SOS & Panic Siren Receiver:** If a resident triggers an SOS from their app, or presses a physical panic button in the elevator, the Guard Tablet becomes the primary alarm. It locks the screen, flashes red, sounds a loud siren, and displays the exact physical location of the emergency.
* **Vehicle Loop Detector Presence:** Signals from the magnetic loop sensors buried in the road. When a vehicle pulls up to the gate, the sensor wakes up the Guard Tablet interface, prompting the Guard to begin the check-in process even before the driver speaks.
* **Intercom / Call Requests:** Incoming VoIP or SIP calls from the physical Intercom panels located at the building lobbies, directly routing to the Guard's tablet.

### B. Hardware Outputs (Commands Flowing from Guard Tablet -> Edge Pi)
*These are the exact physical commands the Guard executes via their tablet interface to control the gates and cameras.*
* **Manual Relay Trigger (The "Open Gate" Button):** The most frequently used command. When the Guard verifies a visitor or delivery person, tapping "Approve" on the tablet sends an instant MQTT payload to the Edge Pi, which triggers the physical electrical relay to raise the boom barrier or unlock the pedestrian turnstile.
* **Camera Snapshot Force-Capture:** If the automated camera fails to get a clear shot of a visitor's face or ID card due to glare or positioning, the Guard taps a button on the tablet to force the physical gate camera to take a manual, high-resolution snapshot.
* **Emergency Vehicle Override (The Ambulance Button):** A specialized physical override command. If an ambulance or fire truck arrives, the Guard uses this to command the Edge Pi to lock the boom barrier in the 'UP' position indefinitely until the Guard manually releases it, bypassing all standard vehicle timeouts.
* **Two-Way Audio Broadcast:** Using the tablet's microphone to push live audio out through the physical PA speakers or intercom pedestals located at the boom barriers (e.g., "Please move your vehicle forward").