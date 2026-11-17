import { initBotId } from "botid/client/core";

// Vercel BotID checks the form endpoints only. Pages, analytics and
// everything else load without it.
initBotId({
  protect: [
    { path: "/api/booking", method: "POST" },
    { path: "/api/booking/slots", method: "GET" },
    { path: "/api/brief", method: "POST" },
  ],
});
