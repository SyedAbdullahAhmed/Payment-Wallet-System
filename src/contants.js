// const BASE_URL = 'https://payment-wallet-system-backend.vercel.app'
const BASE_URL = process.env.NODE_ENV !== 'development'
  ? 'https://vljen465ka.execute-api.ap-south-1.amazonaws.com'
  : 'http://localhost:3000';

export { BASE_URL }
