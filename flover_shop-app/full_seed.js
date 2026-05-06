const db = require("./app/models");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("--- Starting Extended Seeding Process ---");

    // 1. Кодирование паролей
    const saltRounds = 10;
    const adminHash = await bcrypt.hash("admin123", saltRounds);
    const managerHash = await bcrypt.hash("manager123", saltRounds);
    const cashierHash = await bcrypt.hash("cashier123", saltRounds);

    // 2. Пользователи
    const users = [
      { username: "admin", password_hash: adminHash, role: "admin", full_name: "Администратор (Эльдар)" },
      { username: "manager1", password_hash: managerHash, role: "manager", full_name: "Анна Иванова (Менеджер)" },
      { username: "cashier1", password_hash: cashierHash, role: "cashier", full_name: "Мария Смирнова (Кассир)" }
    ];

    for (const u of users) {
      await db.user.findOrCreate({ where: { username: u.username }, defaults: u });
    }
    console.log("✔ Users seeded.");

    // 3. Категории и товары (Расширенный список)
    const categories = [
      { name: "Розы", items: ["Ред Наоми", "Мондиаль", "Фридом", "Пионовидная роза", "Кения Микс"] },
      { name: "Хризантемы", items: ["Бакарди", "Зембла", "Антонов", "Кустовая белая"] },
      { name: "Экзотика", items: ["Протея", "Леукадендрон", "Эвкалипт", "Хлопок"] },
      { name: "Букеты", items: ["Свадебный классик", "Весенний микс", "Гранд-букет 101", "Композиция в шляпной коробке"] },
      { name: "Уход и декор", items: ["Секатор", "Удобрение Chrysal", "Ваза стеклянная", "Крафт-бумага"] }
    ];

    const allProducts = [];
    for (const cat of categories) {
      const [group] = await db.productGroup.findOrCreate({ where: { name: cat.name } });
      for (const itemName of cat.items) {
        const [prod] = await db.product.findOrCreate({
          where: { name: itemName },
          defaults: {
            id_category: group.id,
            quantity: 50 + Math.floor(Math.random() * 100),
            cost_price: 50 + Math.floor(Math.random() * 2000),
            min_threshold: 10
          }
        });
        allProducts.push(prod);
      }
    }
    console.log(`✔ ${allProducts.length} Products seeded.`);

    // 4. Прайс-листы
    const [priceList] = await db.priceList.findOrCreate({ where: { name: "Основной прайс" }, defaults: { effective_date: new Date() } });
    for (const p of allProducts) {
      const salePrice = parseFloat(p.cost_price) * 1.7;
      await db.prodInListPrice.findOrCreate({
        where: { id_product: p.id, id_price_list: priceList.id },
        defaults: { price: salePrice.toFixed(2) }
      });
    }

    // 5. Клиенты
    const customerNames = ["Виктор Сидоров", "Елена Павлова", "Дмитрий Назаров", "Ольга Петрова", "Артем Соколов"];
    const customerInstances = [];
    for (const name of customerNames) {
      const [cust] = await db.customer.findOrCreate({
        where: { name },
        defaults: { phone: `+7900${Math.floor(1000000 + Math.random() * 9000000)}`, personal_discount: Math.floor(Math.random() * 11) }
      });
      customerInstances.push(cust);
    }

    // 5.5 Поставщики и Поставки
    const providersList = ["Эквадор Флауэрс", "Кения Роуз", "Голландия Опт", "Местные Теплицы", "GreenHouse Corp"];
    const providerInstances = [];
    for (const org of providersList) {
      const [prov] = await db.provider.findOrCreate({ where: { organization_name: org } });
      providerInstances.push(prov);
    }
    console.log("✔ Providers seeded.");

    // Дополнительно: Создаем историю поставок (Shipments)
    console.log("Generating shipments...");
    for (const p of allProducts) {
      // 1-2 поставки на товар
      const shipCount = Math.floor(Math.random() * 2) + 1;
      for (let s = 0; s < shipCount; s++) {
        const provider = providerInstances[Math.floor(Math.random() * providerInstances.length)];
        const month = Math.floor(Math.random() * 4) + 1; // 1-4
        const day = Math.floor(Math.random() * 28) + 1;
        await db.shipment.create({
          product_id: p.id,
          provider_id: provider.id,
          count: 20 + Math.floor(Math.random() * 100),
          unit_price: p.cost_price,
          purchase_date: new Date(2026, month, day)
        });
      }
    }
    console.log("✔ Shipments seeded.");

    // 6. Расходы (за последние 3 месяца)
    const expCats = ["Аренда", "Зарплата", "Закупки", "Реклама", "Налоги"];
    for (let m = 1; m <= 3; m++) {
      for (const cat of expCats) {
        await db.expense.create({
          category: cat,
          amount: 5000 + Math.random() * 50000,
          date: new Date(2026, m, 1),
          description: `Плановые расходы за ${cat}`
        });
      }
    }

    // 7. Продажи (Массово)
    console.log("Generating sales history (approx 60 sales)...");
    for (let i = 0; i < 60; i++) {
      const month = Math.floor(Math.random() * 4) + 1; // 1-4
      const day = Math.floor(Math.random() * 28) + 1;
      const customer = customerInstances[Math.floor(Math.random() * customerInstances.length)];

      const sale = await db.sale.create({
        id_customer: customer.id,
        id_price_list: priceList.id,
        sale_date: new Date(2026, month, day),
        total_amount: 0
      });

      let total = 0;
      const itemsCount = Math.floor(Math.random() * 3) + 1;
      const shuffeled = [...allProducts].sort(() => 0.5 - Math.random());

      for (let j = 0; j < itemsCount; j++) {
        const p = shuffeled[j];
        const qty = Math.floor(Math.random() * 5) + 1;
        const price = parseFloat(p.cost_price) * 1.7;
        total += qty * price;
        await db.prodIsOnSale.create({
          id_sale: sale.id,
          id_product: p.id,
          quantity: qty,
          price: price.toFixed(2)
        });
      }
      await sale.update({ total_amount: total.toFixed(2) });
    }

    console.log("--- Seeding Done! ---");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
