const {
  createSessionHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
} = require("./controllers/session.controller");
const { requireUser } = require("./middlewares/requireUser");

function routes(app) {
  // sign up
  app.post("/api/signup", createUserHandler);

  // login
  app.post("/api/login", createSessionHandler);
  // get the current session

  app.get("/api/session", requireUser, getSessionHandler);
  // logout
  app.delete("/api/logout", requireUser, deleteSessionHandler);
}

module.exports = routes;
