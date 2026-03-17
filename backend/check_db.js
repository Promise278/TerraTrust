const { Lands, Users } = require("./models");

async function check() {
  try {
    const total = await Lands.count();
    const available = await Lands.count({ where: { status: "available" } });
    const lands = await Lands.findAll({ limit: 5 });
    console.log("Total Lands:", total);
    console.log("Available Lands:", available);
    console.log("Sample Lands:", JSON.stringify(lands, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
