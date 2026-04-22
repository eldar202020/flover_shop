require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const db = require("./app/models");
const { injectUser } = require("./app/middleware/auth.middleware");
const initTriggers = require("./app/database/init_triggers");

const PORT = process.env.NODE_DOCKER_PORT || 8081;

// ── Сессии ────────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || "flover_shop_secret_key_2024",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 часа
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));

// ── JSON и form-data ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── EJS — движок шаблонов ─────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Статические файлы ─────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Inject current user in all EJS templates ─────────────────────────────────
app.use(injectUser);

// ── Swagger ───────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Flower Shop API", version: "1.0.0", description: "API для магазина цветов" },
    servers: [{ url: `http://localhost:${process.env.NODE_LOCAL_PORT || 8080}`, description: "Development server" }],
    components: {
      schemas: {},
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./app/routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Веб-роуты (EJS) ───────────────────────────────────────────────────────────
const webRouter = require("./app/web/web.routes");
app.use("/", webRouter);

// ── API роуты ─────────────────────────────────────────────────────────────────
require("./app/routes/productgroup.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/sale.routes")(app);
require("./app/routes/pricelist.routes")(app);
require("./app/routes/prodinlistprice.routes")(app);
require("./app/routes/prodisOnSale.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/provider.routes")(app);
require("./app/routes/shipment.routes")(app);
require("./app/routes/expense.routes")(app);

// ── Функция подключения к БД с повторными попытками ──────────────────────────
const connectWithRetry = (attempt = 1) => {
  console.log(`Connecting to database (Attempt ${attempt}/5)...`);
  db.sequelize.authenticate()
    .then(() => {
      console.log("Database connection established.");
      return db.sequelize.sync({ alter: true });
    })
    .then(async () => {
      console.log("Database schema synced successfully.");

      // Инициализация триггеров и хранимых процедур
      await initTriggers(db.sequelize);

      // Создание первого администратора, если пользователей нет
      const userCount = await db.user.count();
      if (userCount === 0) {
        const hash = await bcrypt.hash("admin123", 10);
        await db.user.create({
          username: "admin",
          password_hash: hash,
          role: "admin",
          full_name: "Администратор"
        });
        console.log("✅ Default admin created: login=admin, password=admin123");
      }

      app.listen(PORT, () => console.log(`>>> Server is ready on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error(`Attempt ${attempt} failed: Unable to connect to Database!`);
      console.error(err.message);
      if (attempt < 5) {
        console.log("Retrying in 5 seconds...");
        setTimeout(() => connectWithRetry(attempt + 1), 5000);
      } else {
        console.warn("CRITICAL: All connection attempts failed. Starting in SAFE MODE.");
        app.listen(PORT, () => console.log(`Server started in SAFE MODE on port ${PORT}.`));
      }
    });
};

connectWithRetry();