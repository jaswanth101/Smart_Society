# SmartSociety 360 - Hardware & IoT Specifications

## 1. IoT Architecture & Protocol Baseline
[cite_start]All physical devices connect the physical society to the digital platform using a standardized communication layer[cite: 543].
* [cite_start]**Primary Protocol:** MQTT (via Mosquitto Broker)[cite: 540].
* [cite_start]**Network Layer:** Devices communicate over Wi-Fi or Power over Ethernet (PoE)[cite: 544].
* [cite_start]**Offline Resilience:** The architecture relies on an Edge Server to ensure critical access control functions remain operational during cloud outages[cite: 545].

## 2. Central Edge Infrastructure
* [cite_start]**Device:** Edge Server (Raspberry Pi 4)[cite: 545].
* [cite_start]**Placement:** Society Server Room[cite: 545].
* [cite_start]**Purpose:** Runs the local MQTT broker and processes local hardware logic[cite: 545]. [cite_start]Must be capable of working offline during internet outages[cite: 545].

## 3. Access Control & Gate Hardware
* **UHF RFID Readers:**
    * [cite_start]*Placement:* Main vehicle/pedestrian gates (x2), each amenity door, and lift lobbies[cite: 545].
    * [cite_start]*Purpose:* Auto-scan resident and staff RFID cards for entry/exit tracking and amenity access validation[cite: 545].
    * [cite_start]*Security:* Includes tamper or disconnection sensors that trigger instant maintenance alerts[cite: 415].
* **Resident RFID Smart Card:**
    * [cite_start]*Format:* NFC/RFID All-in-One Smart Card[cite: 528].
    * [cite_start]*Purpose:* Carried by every registered person for gate, amenity, and locker access[cite: 545].
* **Vehicle Barrier Controller:**
    * [cite_start]*Placement:* Main vehicle gate[cite: 545].
    * [cite_start]*Purpose:* Motorised barrier that opens automatically upon receiving a verified ANPR or RFID match payload[cite: 545].
* **ANPR IP Camera:**
    * [cite_start]*Tech Stack:* OpenALPR + Hikvision[cite: 540].
    * [cite_start]*Placement:* Vehicle entry/exit barrier[cite: 545].
    * [cite_start]*Purpose:* Automatic number plate reading and barrier control[cite: 545].
* **AI Camera (Premium Module):**
    * [cite_start]*Tech Stack:* AWS Rekognition / DeepFace[cite: 540].
    * [cite_start]*Placement:* Main gate, each amenity entry[cite: 545].
    * [cite_start]*Purpose:* Face recognition entry for registered residents and staff (contactless access)[cite: 47, 545].
* **Biometric Fingerprint Device:**
    * [cite_start]*Placement:* Staff room, guard post[cite: 545].
    * [cite_start]*Purpose:* Dual-authentication fallback for high-security roles and staff clock-in[cite: 262, 545].

## 4. Smart Utilities & Infrastructure Sensors
* **IoT Smart Electricity Meter:**
    * [cite_start]*Placement:* Each flat's distribution board and common areas (gym, pool pump, lifts)[cite: 438, 545].
    * [cite_start]*Purpose:* Tracks individual and common consumption for auto-billing[cite: 422, 545].
* **IoT Water Flow Meter:**
    * [cite_start]*Placement:* Each flat's water inlet pipe[cite: 545].
    * [cite_start]*Purpose:* Tracks individual water consumption and triggers excessive usage alerts[cite: 440, 545].
* **Tank Level Sensor:**
    * [cite_start]*Device Type:* Ultrasonic sensor[cite: 432].
    * [cite_start]*Placement:* Overhead water tank[cite: 545].
    * [cite_start]*Purpose:* Broadcasts live water level to the admin app and triggers auto-start for pumps when levels are low[cite: 432, 545].
* **Generator Fuel Sensor:**
    * [cite_start]*Placement:* DG set fuel tank[cite: 442].
    * [cite_start]*Purpose:* Monitors live fuel levels, logs refills, and triggers auto-alerts at a 25% threshold[cite: 442].
* **Lift IoT Controller:**
    * [cite_start]*Placement:* Lift machine room/cabin[cite: 436].
    * [cite_start]*Purpose:* Tracks trips per day, door open cycles, and alerts the system when service intervals are due[cite: 436].
* **LED Street Light Automation:**
    * [cite_start]*Device Type:* Light sensor[cite: 445].
    * [cite_start]*Purpose:* Automatically turns society street lights on at sunset and off at sunrise (with manual app override)[cite: 444, 445].

## 5. Security & Safety Hardware
* **Smoke & Gas Detectors:**
    * [cite_start]*Placement:* Common kitchens, basement parking, utility areas[cite: 545].
    * [cite_start]*Purpose:* IoT sensors that trigger immediate fire/gas leak alerts to residents via WhatsApp and unlock emergency exits[cite: 401, 448, 545].
* **Panic/SOS Button:**
    * [cite_start]*Placement:* Physical buttons at the guard post[cite: 388].
    * [cite_start]*Purpose:* Instantly alerts the entire committee in case of emergency[cite: 388].
* **Guard Tablet:**
    * [cite_start]*Device Type:* 10-inch Android Tablet[cite: 545].
    * [cite_start]*Placement:* Guard post, main gate[cite: 545].
    * [cite_start]*Purpose:* Operates the check-in app, displays live CCTV feeds, and shows the live alerts dashboard[cite: 545].

## 6. Convenience & Community IoT
* **Smart Parking Sensor:**
    * [cite_start]*Device Type:* Ultrasonic sensor[cite: 73].
    * [cite_start]*Placement:* Under each individual parking bay[cite: 545].
    * [cite_start]*Purpose:* Detects real-time occupancy (free/occupied) to feed the live parking map[cite: 64, 73, 545].
* **Smart Parcel Locker:**
    * [cite_start]*Placement:* Society entrance lobby[cite: 545].
    * [cite_start]*Purpose:* RFID-secured locker for contactless delivery collection[cite: 460, 545]. [cite_start]Support for multiple parcels and future temperature-controlled (cold storage) compartments[cite: 482, 492].
* **NFC Reader Kiosk:**
    * [cite_start]*Placement:* Society canteen, notice board kiosk[cite: 545].
    * [cite_start]*Purpose:* Allows residents to tap their NFC card for canteen payments or to retrieve information[cite: 545].