const app = require("./app");
const PORT = process.env.PORT || 5000;
const cleanExpiredLocks = require(".//utils/seatLockCleaner");
const {initSocket} = require("./socket");
const http = require("http");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const server = http.createServer(app);

// INIT SOCKET FIRST
const io = initSocket(server);
global.io = io;

setInterval(() => {
  cleanExpiredLocks();
}, 60 * 1000);

