const socketIO = require("socket.io");

class SocketIOServer {
  /**
   * @type {SocketIOServer | null}
   * @private
   */
  static #_instance = null;

  /**
   * @type {socketIO.Server | null}
   */
  io = null;

  /**
   * Gets the singleton instance of SocketIOServer.
   * @returns {SocketIOServer} The singleton instance.
   */
  static getInstance() {
    if (!this.#_instance) {
      this.#_instance = new SocketIOServer();
    }
    return this.#_instance;
  }

  /**
   * @param {http.Server} server - The HTTP server to attach Socket.IO to.
   */
  start(server) {
    try {
      this.io = socketIO(server);
      this.io.on("connection", (socket) => {
        try {
          let userId = socket.handshake.query.user_id;
          if (!userId) throw Error("Please provide valid user Id");
          console.log(`A user ${userId} connected!`);
          // Disc
          socket.on("disconnect", () => {
            console.log(`User ${userId ?? "UNKNOWN"} disconnected`);
          });
        } catch (error) {
          socket.emit("error", "Please provide valid user_id");
          socket.disconnect();
        }
      });
    } catch (error) {
      console.error("Error starting Socket.IO server:", error);
    }
  }

 
  stop() {
    try {
      if (this.io) {
        this.io.close();
        this.io = null; 
      }
    } catch (error) {
      console.error("Error stopping Socket.IO server:", error);
    }
  }
}

;

module.exports = SocketIOServer.getInstance();
