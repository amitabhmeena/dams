const express = require("express");
const https = require("https");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* Serve static files */
app.use(express.static(path.join(__dirname, "public")));

/* Dam API proxy */
app.get("/api/dams", (req, res) => {

  const options = {
    hostname: "dharma.cwc.gov.in",
    path: "/dharma/project/projectAPI/list",
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
      "Referer": "https://dharma.cwc.gov.in/"
    }
  };

  https.request(options, apiRes => {
    let data = "";
    apiRes.on("data", chunk => data += chunk);
    apiRes.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    });
  }).on("error", err => {
    res.status(500).json({ error: err.message });
  }).end();
});

/* Start server */
app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
