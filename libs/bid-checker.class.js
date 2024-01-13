const moment = require("moment/moment");
const { EventEmitter } = require("stream");
const { clearTimeout } = require("timers");
const socketManager = require("./socket.class");

class BidChecker extends EventEmitter {
  fair_value_gap = 3000;
  timeoutCounter = 0;

  created_at = null;
  timeout_ref = null;

  constructor(BidsPool) {
    super();
    this.created_at = moment();

    this.on("send-highest-bid", (data) => {
      let { id } = data;
      console.log("event Call", data);
      //   Todo: Determine the highest Bid ...
      socketManager.io.emit("get-highest-bid", data);
      BidsPool.deleteInstance(id);
    });
  }

  sendHighestBid(eventData) {
    let now_time = moment();
    let duration = now_time.diff(this.created_at, "milliseconds");
    let is_fair_value_gap_cross = duration > this.fair_value_gap;

    if (!is_fair_value_gap_cross && this.timeout_ref) {
      clearTimeout(this.timeout_ref);
      this.decrementTimeoutCounter();
    }

    if (is_fair_value_gap_cross) {
      this.created_at = moment();
    }

    this.incrementTimeoutCounter();

    this.timeout_ref = setTimeout(() => {
      this.decrementTimeoutCounter();
      this.emit("send-highest-bid", eventData);
    }, 1000);
  }

  cleanup(cb) {
    if (this.timeoutCounter <= 0) {
      cb();
    }
  }

  incrementTimeoutCounter() {
    this.timeoutCounter = this.timeoutCounter + 1;
  }

  decrementTimeoutCounter() {
    this.timeoutCounter = this.timeoutCounter - 1;
  }
}

module.exports = BidChecker;
