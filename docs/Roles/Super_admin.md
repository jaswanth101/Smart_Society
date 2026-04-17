# Super Admin (Platform Owner) - Master Workflows & Responsibilities

## 1. Authentication & Security
*The Super Admin operates entirely outside the isolated tenant schemas. They log into the global control plane.*
* **Platform Login:** Authenticates via a dedicated highly-secure portal (`/platform/login`), requiring strict 2FA (Two-Factor Authentication).
* **Session Management:** Can view active Super Admin sessions and forcefully revoke access if a platform-level breach is suspected.
* **Audit Logging:** Every action the Super Admin takes (e.g., deleting a society, changing a billing plan, updating an API key) is permanently recorded in a master audit log with a timestamp and IP address.

## 2. Global Dashboard & Analytics (The Daily View)
*The bird's-eye view of the entire SaaS business.*
* **Live Revenue Tracking:** View MRR (Monthly Recurring Revenue) generated from society SaaS subscriptions.
* **Platform Health:** Monitor global API health, Edge Server (Raspberry Pi) offline alerts across all societies, and database load.
* **Adoption Metrics:** Track total onboarded societies, total active residents, and total daily gate hardware triggers across the network.

## 3. Society Lifecycle Management (The Core Goal)
*This is the end-to-end workflow for managing the clients (Societies).*

### A. Creating & Onboarding a Society
* **Provisioning:** Creates a new society profile. The system automatically provisions a brand new, isolated PostgreSQL schema (e.g., `schema_society_omega`).
* **Initial Configuration:** Sets the society name, address, total unit capacity, and the primary "President/Admin" contact details.
* **Master Import:** Can upload a master CSV file provided by the builder/committee to bulk-generate the spatial architecture (wings, flats) and initial resident accounts.
* **Welcome Dispatch:** Triggers the automated WhatsApp/Email welcome sequence to the society's committee to hand over the keys to their specific admin panel.

### B. Module & Tier Management
* **Feature Toggling:** Enables or disables specific software modules for a society based on their SaaS contract. (e.g., turning off "Face Recognition Entry" or "Smart Utilities" if they are on the Basic Tier).
* **Capacity Overrides:** Increases system limits for a society (e.g., allowing more API calls, expanding maximum resident counts, or increasing photo storage limits).

### C. Suspending, Archiving, or Removing an Organization (The End Goal)
* **Soft Suspension:** Disables access to the society's admin panel and resident apps (usually due to non-payment of SaaS fees) while keeping the database intact. *Crucially, local offline hardware (Edge Pi) must be instructed to default to open/safe mode if suspended.*
* **Data Export:** Generates a complete GDPR-compliant SQL dump or CSV export of a society's data to hand over if they leave the platform.
* **Hard Deletion (Tear Down):** Permanently drops the tenant's PostgreSQL schema, wipes their AWS S3 media buckets, and revokes their hardware Edge Pi access keys. This is the absolute final step of offboarding.

## 4. Financial & SaaS Billing Management
*Managing the money the platform makes, not the money the individual societies make.*
* **Subscription Invoicing:** Auto-generates and tracks monthly/annual SaaS invoices sent to the society committees for using SmartSociety 360.
* **Payment Gateway Fees:** Monitors the split/commission taken from Razorpay transactions happening within the societies (if a revenue-share model is active).
* **Payment Reminders:** Triggers automated or manual payment reminders to society Presidents/Treasurers for overdue SaaS bills.

## 5. Hardware & IoT Infrastructure Tracking
*Since the platform relies on physical hardware, the Super Admin must track the physical assets installed across the country.*
* **Hardware Inventory:** Logs every Edge Server (Raspberry Pi), ANPR camera, and RFID reader deployed.
* **MAC Address Whitelisting:** Assigns specific hardware MAC addresses to specific society schemas so data routes correctly.
* **AMC (Annual Maintenance Contracts):** Tracks the warranty and maintenance contract expiry dates for the physical hardware installed at each society.
* **OTA (Over-The-Air) Updates:** Pushes global software updates or security patches simultaneously to all physical Edge Servers in the field.

## 6. Global Settings & Integrations
*The master keys that make the platform function.*
* **API Key Management:** Inputs and updates the global production keys for:
    * Razorpay (Master Merchant Account)
    * WhatsApp Business API (WATI/Interakt)
    * SMS Gateways (MSG91/Twilio)
    * Push Notifications (Firebase Admin)
    * AI Services (OpenAI, AWS Rekognition)
* **Whitelabeling (Enterprise Feature):** If a massive township buys the software, the Super Admin can change the color schemes, logos, and custom domains (e.g., `admin.prestigetowers.com`) for that specific tenant.
* **Notification Templates:** Edits the global master templates for SMS, Email, and WhatsApp (e.g., standardizing how the "Visitor OTP" message looks for all societies).


## 7. Global Hardware Telemetry & Control (Inputs & Outputs)
*The Super Admin manages the physical fleet of Edge Servers (Raspberry Pis). Their dashboard acts as a Network Operations Center (NOC) for the hardware.*

### A. Hardware Inputs (Data Flowing from Edge Pi -> Cloud)
*This is the telemetry data the Super Admin dashboard constantly consumes to monitor system health.*
* **The "Heartbeat" (Ping):** A lightweight MQTT payload sent every 60 seconds from every Edge Pi. If the cloud misses 3 heartbeats in a row, the dashboard flags that society's server as `OFFLINE` and alerts the Super Admin.
* **Resource Telemetry:** Real-time data on the physical health of the Raspberry Pi, including CPU temperature, RAM usage, and SD card storage capacity (crucial for knowing if logs are filling up the memory).
* **Fatal Error Logs:** If the local Node.js script crashes or the local Mosquitto broker fails on the Pi, the crash dump is instantly uploaded to the Super Admin's log viewer.
* **Volume Metrics (For Billing):** Total count of API calls and MQTT payloads processed per day. This is used to enforce SaaS Tier limits (e.g., if a society exceeds 10,000 gate triggers a day, they might be moved to an Enterprise tier).
* **Firmware & IP Status:** Constant reporting of the current Docker image version running on the Pi, its assigned local IP, and its external Public IP address.

### B. Hardware Outputs (Commands Flowing from Cloud -> Edge Pi)
*These are the master override commands the Super Admin can execute to control the physical hardware from the cloud.*
* **OTA (Over-The-Air) Updates:** Pushing a command that tells the Edge Pi's Docker/Watchtower client to pull the latest `v2.1` software image from the DigitalOcean Container Registry and restart seamlessly.
* **Remote Reboot:** A master command to forcefully reboot the physical Raspberry Pi or restart specific crashed Docker containers without needing a physical technician on-site.
* **The "Kill Switch" (Service Suspension):** If a society permanently defaults on their SaaS payments, the Super Admin sends a payload that instantly revokes the Pi's API keys and severs its connection to the cloud backend. *(Note: The Pi must be programmed to default to a 'Safe Open' mode for the physical gates when this happens to prevent locking residents inside).*
* **Master Configuration Sync:** Pushing updated global configurations, such as new SSL certificates, new IP addresses for the cloud backend, or updated global MAC address whitelists.
* **Remote Diagnostic Trigger:** Command the Edge Pi to run a local network speed test or run a diagnostic check on its attached USB RFID readers and report the results back to the cloud.