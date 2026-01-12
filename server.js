const express = require("express");
const https = require("https");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

/* DHARMA proxy */
app.get("/api/dams", (req, res) => {

  const options = {
    hostname: "dharma.cwc.gov.in",
    path: "/dharma/project/projectAPI/list",
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Referer": "https://dharma.cwc.gov.in/",
      "Origin": "https://dharma.cwc.gov.in"
    }
  };

  const apiReq = https.request(options, apiRes => {
    let data = "";

    apiRes.on("data", chunk => (data += chunk));
    apiRes.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    });
  });

  apiReq.on("error", err => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });

  apiReq.end();
});

/* Start server */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
