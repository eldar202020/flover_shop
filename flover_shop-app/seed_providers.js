require("dotenv").config();
const db = require("./app/models");

async function seedProviders() {
  try {
    console.log("Connecting to DB and seeding providers...");
    const providersList = ["Эквадор Флауэрс", "Кения Роуз", "Голландия Опт", "Местные Теплицы", "GreenHouse Corp"];
    for (const org of providersList) {
      const [prov, created] = await db.provider.findOrCreate({ where: { organization_name: org } });
      if (created) {
        console.log(`Provider added: ${org}`);
      } else {
        console.log(`Provider already exists: ${org}`);
      }
    }
    console.log("All providers seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding providers:", err);
    process.exit(1);
  }
}

seedProviders();
