const axios = require("axios");
const { io } = require("socket.io-client");

async function createSocket(email) {
  const res = await axios.post("http://localhost:3000/admin/login", {
    email: "admin@gmail.com",
    password: "12345678",
  });

  const token = res.data.accessToken;
  console.log(token)

  const socket = io("http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log(`✅ ${email} connected:`, socket.id);
  });

  socket.on("onlineUsers", (count) => {
    console.log(`👥 ${email}:`, count);
  });
}

async function main() {
  const users = [
    "admin@gmail.com",
    // "admin1@gmail.com",
    // "admin2@gmail.com",
    // "admin3@gmail.com",
  ];

  for (const email of users) {
    await createSocket(email);
  }
}

main();