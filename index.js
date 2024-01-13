const http = require("http");
const express = require("express");
const socketManager = require("./libs/socket.class");
const BidsPool = require("./libs/bids-pool.class");

const app = express();
const httpServer = http.createServer(app);
socketManager.start(httpServer);

const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  let { id, name } = req.body;

  if (!id) return res.status(400).json({ message: "please provide valid id" });

  let BidChecker = BidsPool.createOrGetInstance(id);
  BidChecker.sendHighestBid(req.body);

  return res.json({ message: "Bid Place it will be updated in few secs" });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
