import { registerAs } from '@nestjs/config'

// MongoDB Atlas config (IoT Event Store)
export default registerAs('mongodb', () => ({
  uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/smartsociety_iot',
}))
