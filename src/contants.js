// const BASE_URL = 'https://payment-wallet-system-backend.vercel.app'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://payment-wallet-system-backend.vercel.app'
  : 'http://localhost:3000';

export { BASE_URL }