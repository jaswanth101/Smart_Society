import { registerAs } from '@nestjs/config'

// ─────────────────────────────────────────────────────────
// Application configuration — reads from environment variables.
// No magic strings: all config values come from process.env.
// ─────────────────────────────────────────────────────────

export default registerAs('app', () => ({
  nodeEnv:  process.env.NODE_ENV ?? 'development',
  port:     parseInt(process.env.PORT ?? '8000', 10),
  jwtSecret:            process.env.JWT_SECRET,
  jwtExpiresIn:         process.env.JWT_EXPIRES_IN ?? '7d',
  refreshTokenSecret:   process.env.REFRESH_TOKEN_SECRET,
  allowedOrigins:       process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  // Razorpay
  razorpayKeyId:        process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret:    process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret:process.env.RAZORPAY_WEBHOOK_SECRET,
  // Firebase FCM
  firebaseProjectId:   process.env.FIREBASE_PROJECT_ID,
  // WhatsApp / WATI
  watiApiUrl:          process.env.WATI_API_URL,
  watiApiToken:        process.env.WATI_API_TOKEN,
  // MSG91 SMS
  msg91AuthKey:        process.env.MSG91_AUTH_KEY,
  // OpenAI
  openaiApiKey:        process.env.OPENAI_API_KEY,
  // AWS
  awsRegion:           process.env.AWS_REGION ?? 'ap-south-1',
  awsS3Bucket:         process.env.AWS_S3_BUCKET,
  awsRekognitionCollection: process.env.AWS_REKOGNITION_COLLECTION,
}))
