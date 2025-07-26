import http from "http";

const options = {
  host: "localhost",
  port: process.env.PORT || 5001,
  path: "/health",
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on("error", (err) => {
  console.log("ERROR:", err);
  process.exit(1);
});

request.on("timeout", () => {
  console.log("TIMEOUT");
  request.destroy();
  process.exit(1);
});

request.end();
