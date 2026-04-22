const db = require("./app/models");
const Product = db.product;
const ProductGroup = db.productGroup;

async function seedTools() {
  try {
    console.log("Seeding care tools...");

    // 1. Create or find the "Flower Care Tools" category
    const [group, created] = await ProductGroup.findOrCreate({
      where: { name: "Инструменты для ухода" },
      defaults: {
        name: "Инструменты для ухода",
        description: "Инструменты и средства для поддержания здоровья и красоты цветов"
      }
    });

    if (created) {
      console.log("Created 'Инструменты для ухода' group.");
    } else {
      console.log("'Инструменты для ухода' group already exists.");
    }

    // 2. Add tools
    const tools = [
      {
        name: "Профессиональный секатор",
        description: "Высококачественный секатор для точной обрезки стеблей.",
        id_category: group.id,
        quantity: 15,
        cost_price: 850.00,
        min_threshold: 3
      },
      {
        name: "Дизайнерская лейка (2л)",
        description: "Элегантная металлическая лейка для комнатного полива.",
        id_category: group.id,
        quantity: 10,
        cost_price: 1200.00,
        min_threshold: 2
      },
      {
        name: "Пульверизатор Fine Mist",
        description: "Мелкодисперсный распылитель для увлажнения листьев.",
        id_category: group.id,
        quantity: 25,
        cost_price: 450.00,
        min_threshold: 5
      },
      {
        name: "Удобрение 'Цветочный Рай'",
        description: "Комплексное жидкое удобрение для всех видов домашних цветов.",
        id_category: group.id,
        quantity: 40,
        cost_price: 320.00,
        min_threshold: 10
      },
      {
        name: "Набор мини-инструментов",
        description: "Три компактных инструмента: лопатка, грабельки и сажалка.",
        id_category: group.id,
        quantity: 12,
        cost_price: 680.00,
        min_threshold: 4
      },
      {
        name: "Влагомер для почвы",
        description: "Цифровой датчик для контроля уровня влажности грунта.",
        id_category: group.id,
        quantity: 8,
        cost_price: 950.00,
        min_threshold: 2
      }
    ];

    for (const tool of tools) {
      const [product, pCreated] = await Product.findOrCreate({
        where: { name: tool.name },
        defaults: tool
      });
      if (pCreated) {
        console.log(`Added tool: ${tool.name}`);
      } else {
        console.log(`Tool already exists: ${tool.name}`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding tools:", error);
    process.exit(1);
  }
}

seedTools();
