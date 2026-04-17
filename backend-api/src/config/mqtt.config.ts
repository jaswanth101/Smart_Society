import { registerAs } from '@nestjs/config'

// MQTT / Mosquitto broker configuration (IoT protocol layer)
export default registerAs('mqtt', () => ({
  brokerUrl:  process.env.MQTT_BROKER_URL ?? 'mqtt://localhost:1883',
  username:   process.env.MQTT_USERNAME,
  password:   process.env.MQTT_PASSWORD,
  clientId:   process.env.MQTT_CLIENT_ID ?? `ss360-api-${process.pid}`,
  // Topics
  topics: {
    gateEntry:    'ss360/+/gate/entry',      // + = tenantId wildcard
    gateExit:     'ss360/+/gate/exit',
    rfidScan:     'ss360/+/rfid/scan',
    sensorData:   'ss360/+/sensor/+',
    edgePing:     'ss360/+/edge/ping',
    commandOut:   'ss360/+/command',
  },
}))
