var readline = require("readline");
const { exec } = require("child_process");

var rl = readline.createInterface({
  input: process.stdin
});

rl.on("line", line => {
  try {
    var o = JSON.parse(line);

    if (o.pgn == "126992") {
      if (o.fields && o.fields.Date && o.fields.Time) {
        let rfc = o.fields.Date.replace(/\./g, "-") + "T" + o.fields.Time + "Z";
        // console.log(JSON.stringify(o));
        // console.log(rfc);
        exec("date -s '" + rfc + "'", (err, stdout, stderr) => {
          if (err) {
            console.error("Couldn't set date!", stdout, stderr);
            process.exit(1);
          }
          console.log("Synchronized to NMEA time " + rfc);
          process.exit(0);
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
});

// Check for NTP as well.
const INTERVAL = 5000;

setInterval(() => {
  exec("systemctl status systemd-timesyncd", (err, stdout, stderr) => {
    if (stdout.indexOf("Synchronized to time server") != -1) {
      console.log("Synchronized to time server");
      process.exit(0);
    }
  });
}, INTERVAL);
