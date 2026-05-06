const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const { requireLogin, requireRole } = require("../middleware/auth.middleware");
const { QueryTypes } = require("sequelize");


// GET /login
router.get("/login", (req, res) => {
  if (req.session && req.session.user) return res.redirect("/");
  res.render("login", { title: "Вход", error: null });
});
// POST /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.user.findOne({ where: { username } });
    if (!user) {
      return res.render("login", { title: "Вход", error: "Неверный логин или пароль", username });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render("login", { title: "Вход", error: "Неверный логин или пароль", username });
    }
    req.session.user = { id: user.id, username: user.username, role: user.role, full_name: user.full_name };
    res.redirect("/");
  } catch (err) {
    res.render("login", { title: "Вход", error: "Ошибка сервера: " + err.message });
  }
});
// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});
// Дашборд
router.get("/", requireLogin, async (req, res) => {
  try {
    const sales = await db.sale.findAll({ include: [{ model: db.customer }] });
    const customers = await db.customer.findAll();
    const products = await db.product.findAll();
    const salesItems = await db.prodIsOnSale.findAll({ include: [{ model: db.product }] });
    const expenses = await db.expense.findAll();

    const totalRevenue = sales.reduce((s, sale) => s + Number(sale.total_amount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalCOGS = salesItems.reduce((s, item) => {
      const cost = Number(item.product?.cost_price || 0);
      return s + (item.quantity * cost);
    }, 0);
    const netProfit = totalRevenue - totalCOGS - totalExpenses;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRevenue = sales
      .filter(s => { try { return new Date(s.sale_date).toISOString().startsWith(todayStr); } catch (e) { return false; } })
      .reduce((s, sale) => s + Number(sale.total_amount || 0), 0);

    const lowStockCount = products.filter(p => p.quantity <= (p.min_threshold || 5)).length;
    const productStats = {};
    salesItems.forEach(item => {
      const pId = item.id_product;
      if (!productStats[pId]) productStats[pId] = { name: item.product?.name || '?', qty: 0 };
      productStats[pId].qty += (item.quantity || 0);
    });
    const topProducts = Object.values(productStats).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const topCustomers = customers.map(c => ({
      name: c.name,
      spent: sales.filter(s => s.id_customer === c.id).reduce((s, sale) => s + Number(sale.total_amount || 0), 0)
    })).sort((a, b) => b.spent - a.spent).slice(0, 5);
    res.render("index", {
      title: "Дашборд", activePage: "dashboard",
      stats: {
        salesCount: sales.length, customersCount: customers.length, productsCount: products.length,
        totalRevenue: totalRevenue.toFixed(2), todayRevenue: todayRevenue.toFixed(2),
        lowStockCount, netProfit: netProfit.toFixed(2)
      },
      recentSales: sales.slice(-5).reverse(), topProducts, topCustomers, customers,
    });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
// Продажи
router.get("/sales", requireLogin, async (req, res) => {
  try {
    const sales = await db.sale.findAll({ order: [["id", "DESC"]] });
    const customers = await db.customer.findAll();
    const products = await db.product.findAll();
    const priceLists = await db.priceList.findAll();
    const allPrices = await db.prodInListPrice.findAll();
    const productsJson = JSON.stringify(products.map(p => ({ id: p.id, name: p.name, quantity: p.quantity })));
    const pricesJson = JSON.stringify(allPrices);
    res.render("sales", {
      title: "Управление продажами", activePage: "sales",
      sales, customers, products, priceLists,
      pageScripts: `<script>const PRODUCTS_DATA=${productsJson};const PRICES_DATA=${pricesJson};</script><script src="/js/sales.js"></script>`,
    });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
// Склад
router.get("/inventory", requireLogin, async (req, res) => {
  try {
    const products = await db.product.findAll({ order: [["id", "ASC"]] });
    const groups = await db.productGroup.findAll();
    res.render("inventory", { title: "Склад и товары", activePage: "inventory", products, groups });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});

// Клиенты
router.get("/customers", requireLogin, async (req, res) => {
  try {
    const customers = await db.customer.findAll({ order: [["id", "ASC"]] });
    const sales = await db.sale.findAll();
    res.render("customers", { title: "Клиенты", activePage: "customers", customers, sales });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});

// Поставки (только manager + admin)
router.get("/shipments", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  try {
    const shipments = await db.shipment.findAll({ order: [["id", "DESC"]] });
    const providers = await db.provider.findAll();
    const products = await db.product.findAll();
    res.render("shipments", { title: "Приходные накладные", activePage: "shipments", shipments, providers, products });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
// Расходы только manager + admin
router.get("/expenses", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  try {
    const expenses = await db.expense.findAll({ order: [["date", "DESC"]] });
    res.render("expenses", { title: "Расходы", activePage: "expenses", expenses });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
// Отчёты только manager + admin
router.get("/reports", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  try {
    const groups = await db.productGroup.findAll();
    const providers = await db.provider.findAll();
    res.render("reports", { title: "Отчёты", activePage: "reports", groups, providers });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
// Управление пользователями (только admin)
router.get("/users", requireLogin, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await db.user.findAll({ order: [["id", "ASC"]] });
    res.render("users", { title: "Пользователи", activePage: "users", users });
  } catch (err) {
    res.render("error", { title: "Ошибка", message: err.message, activePage: "error" });
  }
});
//  API только admin
router.post("/api/users", requireLogin, requireRole(["admin"]), async (req, res) => {
  const { username, password, role, full_name } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Логин и пароль обязательны" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await db.user.create({ username, password_hash: hash, role: role || "cashier", full_name });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message || "Ошибка при создании пользователя" });
  }
});
router.put("/api/users/:id/role", requireLogin, requireRole(["admin"]), async (req, res) => {
  const { role } = req.body;
  try {
    await db.user.update({ role }, { where: { id: req.params.id } });
    res.json({ message: "Роль обновлена" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/api/users/:id", requireLogin, requireRole(["admin"]), async (req, res) => {
  if (parseInt(req.params.id) === req.session.user.id) {
    return res.status(400).json({ message: "Нельзя удалить самого себя" });
  }
  try {
    await db.user.destroy({ where: { id: req.params.id } });
    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//  API ОТЧЁТОВ
// Отчёт 1: Выручка по периоду
router.get("/api/reports/revenue", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  const { date_from, date_to } = req.query;
  let where = "WHERE 1=1";
  const replacements = {};
  if (date_from) { where += " AND sale_date >= :date_from"; replacements.date_from = date_from; }
  if (date_to) { where += " AND sale_date <= :date_to::date + interval '1 day'"; replacements.date_to = date_to; }
  try {
    const rows = await db.sequelize.query(`
      SELECT
        DATE(sale_date) AS sale_date,
        COUNT(*) AS count,
        SUM(total_amount) AS revenue,
        AVG(total_amount) AS avg_check
      FROM sales ${where}
      GROUP BY DATE(sale_date)
      ORDER BY DATE(sale_date)
    `, { replacements, type: QueryTypes.SELECT });
    const totals = {
      revenue: rows.reduce((s, r) => s + Number(r.revenue || 0), 0).toFixed(2),
      count: rows.reduce((s, r) => s + Number(r.count || 0), 0),
      avg: rows.length ? (rows.reduce((s, r) => s + Number(r.avg_check || 0), 0) / rows.length).toFixed(2) : 0
    };
    res.json({ rows, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Отчёт 2: Топ товаров
router.get("/api/reports/top-products", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  const { category_id, date_from, date_to } = req.query;
  let saleWhere = "WHERE 1=1";
  let prodWhere = "";
  const replacements = {};
  if (date_from) { saleWhere += " AND s.sale_date >= :date_from"; replacements.date_from = date_from; }
  if (date_to) { saleWhere += " AND s.sale_date <= :date_to::date + interval '1 day'"; replacements.date_to = date_to; }
  if (category_id) { prodWhere = "AND p.id_category = :category_id"; replacements.category_id = category_id; }
  try {
    const data = await db.sequelize.query(`
      SELECT
        p.id, p.name,
        pg.name AS category,
        SUM(pis.quantity) AS total_qty,
        SUM(pis.quantity * pis.price) AS revenue
      FROM prod_is_on_sales pis
      JOIN products p ON p.id = pis.id_product ${prodWhere}
      LEFT JOIN product_groups pg ON pg.id = p.id_category
      JOIN sales s ON s.id = pis.id_sale ${saleWhere}
      GROUP BY p.id, p.name, pg.name
      ORDER BY total_qty DESC
      LIMIT 20
    `, { replacements, type: QueryTypes.SELECT });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Отчёт 3: Клиенты
router.get("/api/reports/customers", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  const { min_spent = 0, min_orders = 0 } = req.query;
  try {
    const data = await db.sequelize.query(`
      SELECT
        c.id, c.name, c.phone,
        COUNT(s.id) AS total_orders,
        COALESCE(SUM(s.total_amount), 0) AS total_spent,
        COALESCE(AVG(s.total_amount), 0) AS avg_order,
        c.personal_discount AS discount
      FROM customers c
      LEFT JOIN sales s ON s.id_customer = c.id
      GROUP BY c.id, c.name, c.phone, c.personal_discount
      HAVING COALESCE(SUM(s.total_amount), 0) >= :min_spent
         AND COUNT(s.id) >= :min_orders
      ORDER BY total_spent DESC
    `, { replacements: { min_spent, min_orders }, type: QueryTypes.SELECT });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Отчёт 4: Поставки по поставщикам
router.get("/api/reports/shipments", requireLogin, requireRole(["admin", "manager"]), async (req, res) => {
  const { provider_id, date_from, date_to } = req.query;
  let where = "WHERE 1=1";
  const replacements = {};
  if (provider_id) { where += " AND sh.provider_id = :provider_id"; replacements.provider_id = provider_id; }
  if (date_from) { where += " AND sh.purchase_date >= :date_from"; replacements.date_from = date_from; }
  if (date_to) { where += " AND sh.purchase_date <= :date_to::date + interval '1 day'"; replacements.date_to = date_to; }
  try {
    const data = await db.sequelize.query(`
      SELECT
        pr.organization_name AS provider,
        COUNT(sh.id) AS shipments_count,
        SUM(sh.count) AS total_units,
        SUM(sh.count * sh.unit_price) AS total_cost,
        AVG(sh.count * sh.unit_price) AS avg_cost
      FROM shipments sh
      JOIN providers pr ON pr.id = sh.provider_id
      ${where}
      GROUP BY pr.id, pr.organization_name
      ORDER BY total_cost DESC
    `, { replacements, type: QueryTypes.SELECT });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Отчёт 5: Прибыль по месяцам
router.get("/api/reports/profit", requireLogin, requireRole(["admin"]), async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  try {
    const revenue = await db.sequelize.query(`
      SELECT EXTRACT(MONTH FROM sale_date)::INT AS month, SUM(total_amount) AS revenue
      FROM sales WHERE EXTRACT(YEAR FROM sale_date) = :year
      GROUP BY month ORDER BY month
    `, { replacements: { year }, type: QueryTypes.SELECT });

    const expenses = await db.sequelize.query(`
      SELECT EXTRACT(MONTH FROM date)::INT AS month, SUM(amount) AS expenses
      FROM expenses WHERE EXTRACT(YEAR FROM date) = :year
      GROUP BY month ORDER BY month
    `, { replacements: { year }, type: QueryTypes.SELECT });

    const months = Array.from({ length: 12 }, (_, i) => {
      const r = revenue.find(x => x.month === i + 1) || {};
      const e = expenses.find(x => x.month === i + 1) || {};
      const rev = Number(r.revenue || 0);
      const exp = Number(e.expenses || 0);
      return { month: i + 1, revenue: rev.toFixed(2), expenses: exp.toFixed(2), profit: (rev - exp).toFixed(2) };
    }).filter(m => Number(m.revenue) > 0 || Number(m.expenses) > 0);

    res.json(months);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Отчёт 6: ABC-анализ
router.get("/api/reports/abc", requireLogin, requireRole(["admin"]), async (req, res) => {
  const { category_id } = req.query;
  const prodWhere = category_id ? "AND p.id_category = :category_id" : "";
  try {
    const data = await db.sequelize.query(`
      SELECT
        p.id, p.name,
        SUM(pis.quantity * pis.price) AS revenue
      FROM prod_is_on_sales pis
      JOIN products p ON p.id = pis.id_product ${prodWhere}
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
    `, { replacements: category_id ? { category_id } : {}, type: QueryTypes.SELECT });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
