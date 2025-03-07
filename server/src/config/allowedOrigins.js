const allowedOrigins = [
  // "http://192.168.8.3:5173",
  "http://localhost:5173",
  // "http://localhost:4173",
  process.env.FRONTEND_URL,
];

module.exports = allowedOrigins;
