# President (Society Admin) - Master Workflows & Responsibilities

## 1. The Boundary & End Goal
* **The Boundary:** The President operates strictly within their isolated PostgreSQL tenant schema (e.g., `schema_society_alpha`). They cannot access platform billing or delete the society's root environment.
* **The End Goal:** To ensure the smooth operational, financial, and physical security of the society, resolve top-level escalations (SLA breaches, resident disputes), and eventually execute a democratic handover of power via the digital Election Module to the next committee.

## 2. Authentication & Access
* **Web Login:** Authenticates via the society's specific portal URL (e.g., `/society_alpha/admin/login`).
* **Role Guard:** Granted the `role_id` of `PRESIDENT`. This role possesses the highest hierarchical permission *within* the tenant schema, allowing them to override the Secretary, Treasurer, and Supervisor.
* **Mobile Override:** While primarily a web user, the President's mobile app login recognizes their role, granting them access to the "Emergency Broadcast" and "SOS Override" features directly from their phone.

## 3. The Global Society Dashboard (The Daily View)
*Unlike the Treasurer who looks at money, or the Supervisor who looks at staff, the President looks at system-wide bottlenecks.*
* **SLA Breaches:** Immediately sees Helpdesk/Complaint tickets that have breached their maximum resolution time.
* **Pending Approvals:** A unified queue of major items requiring the President's signature (e.g., a massive vendor payout, a new tenant move-in approval).
* **Security Alerts:** A log of physical security anomalies (e.g., Gate barrier forced open, offline Edge Server, fire alarm triggers).

## 4. Member & Property Authority (The Judge)
*The Secretary manages the daily data entry, but the President handles the final authorizations and disputes.*
* **Resident Onboarding/Offboarding:** Final approval for adding new owners or authorizing tenant move-ins/move-outs (NOC generation).
* **Eviction/Access Revocation:** In extreme cases of non-compliance or legal disputes, the President can authorize a "Hard Block" on a resident. This instantly revokes their mobile app access, blocks their RFID cards from all gates, and removes their vehicle from the ANPR whitelist.
* **Rule Overrides:** Can manually override system rules for specific edge cases (e.g., allowing an amenity booking outside normal hours for a special event).

## 5. Financial Oversight & Approvals (The Vault Key)
*The Treasurer manages the daily books, but the President acts as the final financial safeguard.*
* **Expense Approvals (Maker-Checker):** The system enforces a Maker-Checker rule. The Treasurer uploads a massive vendor bill (e.g., ₹5,000,000 for elevator repair). The bill is locked until the President digitally signs off on the PO (Purchase Order) for the payout.
* **Waivers & Scholarships:** Has the sole authority to waive late fees or approve maintenance fee reductions for residents citing extreme hardship.
* **Budget Ratification:** Reviews and locks the annual society budget before it is published to the residents on the Notice Board.

## 6. Security & IoT Emergency Controls (The Red Button)
*The President has direct control over the society's physical hardware during critical events.*
* **Emergency Broadcast:** Can trigger an instant, un-mutable Push Notification + WhatsApp blast to every single registered resident and staff member (e.g., "Severe flooding in Basement 2, evacuate vehicles immediately").
* **Gate Lockdown / Open All:** In the event of an emergency (like a fire or a security threat), the President can click a global override button that communicates via MQTT to the Edge Pi server to either permanently drop all barriers (Lockdown) or raise all barriers and unlock all RFID doors (Evacuation).
* **CCTV & Patrol Audits:** Can audit the Guard's physical patrol logs (QR checkpoints) and request live CCTV snapshots from the ANPR cameras.

## 7. Communications & Community Escalation
* **Notice Board Override:** Can pin, edit, or delete any notice posted by the Secretary or Supervisor.
* **Dispute Resolution:** Acts as the final escalation tier for the in-app Helpdesk. If a resident is furious about an unresolved plumbing issue, the ticket escalates to the President's queue.
* **Digital AGM (Annual General Meeting):** Hosts the live digital AGM. The President acts as the moderator, tracking quorum (attendance), initiating the live voting polls, and ratifying the digital minutes.

## 8. Vendor & Staff Terminations
* **Vendor Management:** While the Supervisor manages daily staff, the President holds the authority to terminate an AMC (Annual Maintenance Contract) with a vendor or blacklist a contractor company from the premises.
* **Staff Access:** Can permanently revoke a staff member's biometric/RFID access to the premises upon termination.

## 9. The Transition of Power (Election Module)
*The final act of a President is passing the baton.*
* **Election Setup:** Configures the digital voting module for the new committee elections.
* **Role Handover:** Once the digital votes are tallied and verified by the system, the outgoing President initiates the "Handover Protocol". This automatically transfers the `PRESIDENT` role and permissions to the newly elected user account, downgrading their own account back to a standard `RESIDENT`.


## 10. Society Hardware & IoT Controls (Inputs & Outputs)
*The President does not perform daily hardware maintenance (that is the Supervisor's job), nor do they assign RFID cards (that is the Secretary's job). Instead, the President holds the "Master Override" keys for the society's physical infrastructure.*

### A. Hardware Inputs (Data Flowing from Edge Pi -> President Dashboard)
*This is the high-level telemetry and emergency data the system escalates directly to the President.*
* **Critical Security Breaches:** Instant alerts if physical hardware is tampered with (e.g., "Main Gate Boom Barrier forced open without software trigger" or "RFID Server Room door opened at 3:00 AM").
* **Emergency Escalations (SOS/Fire):** If a fire alarm IoT sensor is triggered, or if a resident's SOS button press is not acknowledged by the Guard/Supervisor within 60 seconds, the hardware pushes a direct, overriding alarm to the President's mobile app.
* **Infrastructure Failure Alerts:** Notifications of catastrophic hardware failures that affect the whole society, such as "Society Edge Pi is Offline (Running on Local Fallback)" or "Generator (DG Set) Fuel Level Critically Low."
* **CCTV / ANPR Audit Feeds:** The ability to pull a static image frame or a 10-second video clip from any IoT-connected camera (Gate, Lobby, Pool) for audit or dispute resolution purposes.
* **Macro Utility Telemetry:** High-level dashboard widgets showing real-time society consumption (e.g., "Total Water Tank Capacity at 15%" or "Current Total Power Load").

### B. Hardware Outputs (Commands Flowing from President -> Edge Pi)
*These are the executive "Red Button" commands the President can fire from the cloud down to the local hardware during edge cases or emergencies.*
* **The Evacuation Protocol (Open All):** In the event of a fire or earthquake, the President triggers a macro-command that tells the Edge Pi to instantly raise all boom barriers and unlock all magnetic RFID doors across the entire property to allow free exit and fire engine entry.
* **The Lockdown Protocol (Seal All):** In the event of a severe security threat (e.g., a theft in progress or police action), the President can drop all barriers and lock all pedestrian turnstiles, overriding even valid RFID cards until the lockdown is lifted.
* **Targeted Zone Override:** The ability to lock or unlock specific IoT zones remotely. For example, if a glass breaks in the swimming pool, the President can hit "Lock Pool Pedestrian Gate," instantly rejecting all resident RFID scans for that specific door until it is cleaned.
* **VVIP Remote Entry:** The ability to bypass the Guard Tablet entirely and trigger the Main Gate boom barrier to open directly from the President's mobile app (used for high-profile guests or emergency vehicles).
* **Public Address (PA) / Siren Trigger:** If the society has IoT-connected speakers or sirens, the President can push a button to sound the physical alarm or broadcast a pre-recorded voice message across the physical premises.