require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to flover-shop API" });
});

const PORT = process.env.NODE_DOCKER_PORT || 8081;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flower Shop API",
      version: "1.0.0",
      description: "API для магазина цветов",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./app/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routers
require("./app/routes/productgroup.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/sale.routes")(app);
require("./app/routes/pricelist.routes")(app);
require("./app/routes/prodinlistprice.routes")(app);
require("./app/routes/prodisOnSale.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/provider.routes")(app);
require("./app/routes/shipment.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});