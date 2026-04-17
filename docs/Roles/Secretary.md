# Secretary (Society Admin) - Master Workflows & Responsibilities

## 1. The Boundary & End Goal
* **The Boundary:** The Secretary operates strictly within their isolated PostgreSQL tenant schema (e.g., `schema_society_alpha`). They control data entry, communications, and hardware access logic, but cannot authorize major financial payouts or delete the society environment.
* **The End Goal:** To maintain a 100% accurate, real-time database of every human, vehicle, and pet on the premises. Their ultimate objective is to ensure seamless community communication, enforce society bye-laws via digital access control, and maintain perfect legal documentation for Annual General Meetings (AGMs).

## 2. Authentication & Access
* **Web Login:** Authenticates via the society's secure web portal (`/society_alpha/admin/login`).
* **Role Guard:** Granted the `role_id` of `SECRETARY`. This role has full write-access to the `users`, `vehicles`, `rfid_cards`, and `notices` tables within the tenant schema.
* **Mobile App:** Logs into the mobile app to moderate community forums, reply to resident chats, and view live access logs on the go.

## 3. Master Member Database Management (The Core Duty)
*The Secretary is the ultimate administrator of the people.*
* **Resident KYC & Onboarding:** Reviews and approves Move-In requests. Verifies uploaded documents (Aadhaar, Lease Agreements) before changing a user's status to `ACTIVE`.
* **Owner vs. Tenant Mapping:** Manages the `user_unit_mapping` table. Ensures that when a Tenant moves in, the Owner's rights to book amenities are suspended and transferred to the Tenant, while the Owner retains financial dashboard access.
* **Move-Out/Offboarding:** Processes Move-Out requests. Triggers the workflow that automatically calculates final pending dues (via the Treasurer) and revokes the departing resident's app and gate access.
* **Bulk Import/Export:** Can upload CSVs to bulk-update resident phone numbers or export the entire member directory for legal compliance.

## 4. Hardware Access & Credential Control (The Gatekeeper)
*The Secretary controls who gets through the physical barriers by managing the IoT database.*
* **RFID Card Issuance:** Maps physical UHF RFID card UIDs to specific `user_id`s in the database. 
* **Card Revocation & Replacement:** If a resident loses a card, the Secretary instantly marks the UID as `REVOKED` in the database, which immediately pushes an MQTT payload to the Edge Pi server to block that card at all gates. Issues replacement cards.
* **Amenity Quota Management:** Configures the access rules for the hardware. (e.g., Setting the rule in the admin panel: "Pool RFID reader will reject scans from 1BHK flats if they exceed 3 scans per week").
* **Domestic Help/Staff Time-Windows:** Sets the permitted entry hours for maids/cooks. If a maid's RFID card is scanned outside of the 08:00 AM - 06:00 PM window, the system denies entry and flags the Secretary.

## 5. Vehicle & Asset Registry
* **ANPR Database:** Approves and maps resident vehicle license plates to their respective `unit_id`. This directly feeds the whitelist for the AI camera at the boom barrier.
* **Parking Slot Reassignment:** Updates the database if a resident swaps an assigned parking slot with a neighbor, ensuring the Smart Parking UI reflects the correct ownership.
* **Pet Registry:** Maintains the database of society pets, tracking vaccination expiry dates, and logging noise/nuisance complaints associated with specific pets.

## 6. Communications & Notice Board (The Broadcaster)
*The Secretary is the official voice of the society.*
* **Digital Circulars:** Drafts and publishes official notices to the mobile app Notice Board. Can attach PDF bye-laws or guidelines.
* **Omnichannel Blasts:** Selects the delivery method for communications: Push Notification, Email, or WhatsApp Business API.
* **Targeted Messaging:** Can isolate communications to specific physical zones (e.g., sending a WhatsApp message *only* to residents of "Tower B" about a scheduled power cut).
* **Read-Receipt Tracking:** Views analytics on critical notices to see exactly which flats have not yet opened or read the circular.

## 7. Community Moderation & Compliance
* **Forum Moderation:** Has admin rights over the in-app community forum and Marketplace. Can delete abusive posts, remove restricted classified ads, and temporarily ban users from the forum.
* **Helpdesk Triage:** While the Supervisor handles physical tasks, the Secretary handles administrative tickets (e.g., "My name is spelled wrong in the app", "I need a duplicate parking sticker").
* **Lost & Found:** Acts as the digital custodian for the Lost & Found module, logging items handed to security and marking them as 'Claimed' when returned.

## 8. AGM & Democratic Operations (The Transition)
* **Document Archiving:** Uploads and securely stores past AGM minutes, audit reports, and builder handover documents.
* **Poll & Survey Creation:** Designs and launches digital polls for the community (e.g., "Should we upgrade the gym equipment?").
* **AGM Preparation:** Prepares the digital attendance sheet (Quorum) for the Annual General Meeting and configures the secure voting module for the upcoming committee elections.


## 9. IoT Access Control & Credential Management (Inputs & Outputs)
*The Secretary is the master of the society's physical access matrix. They do not fix broken readers, but they dictate exactly which digital identities are pushed to those readers to grant or deny physical access.*

### A. Hardware Inputs (Data Flowing from Edge Pi -> Secretary Dashboard)
*This is the access telemetry the Secretary uses to monitor compliance and resolve resident disputes.*
* **Access Violation Alerts:** The hardware instantly flags the Secretary if a severe rule is broken. Examples include: a "Revoked" RFID card is scanned, a staff member tries to enter at 2:00 AM (outside their time window), or a tailgating event is detected by the boom barrier sensors.
* **Amenity Occupancy Logs:** Turnstiles or RFID readers at the Gym/Pool send live headcount data. The Secretary uses this to see if an amenity is over capacity or to enforce weekly usage quotas.
* **ANPR Mismatch Audits:** If a resident registers a new car but the ANPR camera repeatedly fails to read the plate (or reads it incorrectly), the Edge Pi sends these "Failed Match" image snippets to the Secretary's dashboard to manually verify and correct the database.
* **Staff/Maid Entry Logs:** Historical data from the biometric or RFID scanners detailing exactly when a specific domestic worker entered and exited the premises, used to resolve disputes between residents and their hired help.

### B. Hardware Outputs (Commands Flowing from Secretary -> Edge Pi)
*These are the access credentials and logic rules the Secretary pushes down to the physical hardware's local memory.*
* **Credential Provisioning (The Sync):** When the Secretary registers a new resident or maid, they push a command that securely syncs that person's physical credentials (RFID UID, encrypted fingerprint template, or Face ID vector) directly to the Edge Pi. This allows the local hub to open gates offline.
* **Instant Credential Revocation:** If a resident reports a lost RFID card, or a tenant moves out, the Secretary clicks "Revoke." The cloud instantly fires an MQTT payload to the Edge Pi to delete that specific UID from the local whitelist, turning the physical card into useless plastic within milliseconds.
* **Time-Based Access Rules:** Pushing scheduling logic to the hardware. For example, the Secretary configures the rule: "Domestic Help can only enter between 08:00 AM and 06:00 PM." The Edge Pi stores this rule and will physically reject a valid maid's card if scanned at 7:00 PM.
* **ANPR Whitelist Updates:** When a resident buys a new car and uploads the RC document, the Secretary approves it, which pushes the new License Plate string directly to the Edge Pi's local AI model, ensuring the boom barrier auto-opens the next time that car arrives.