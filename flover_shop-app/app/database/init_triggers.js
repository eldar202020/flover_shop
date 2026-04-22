/**
 * init_triggers.js
 * Создаёт хранимые процедуры (функции) и триггеры в PostgreSQL
 * Вызывается ПОСЛЕ db.sync() в server.js
 */

const { QueryTypes } = require("sequelize");

module.exports = async function initTriggers(sequelize) {
  try {
    // ─────────────────────────────────────────────────────────────────
    // ТРИГГЕР 1: При добавлении товара в продажу (prod_is_on_sales)
    // автоматически уменьшить quantity в products
    // ─────────────────────────────────────────────────────────────────
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_decrement_stock_on_sale()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE products
        SET quantity = quantity - NEW.quantity
        WHERE id = NEW.id_product;

        -- Проверка: если ушли в минус — откат
        IF (SELECT quantity FROM products WHERE id = NEW.id_product) < 0 THEN
          RAISE EXCEPTION 'Недостаточно товара на складе (id=%)', NEW.id_product;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await sequelize.query(`
      DROP TRIGGER IF EXISTS trg_decrement_stock_on_sale ON prod_is_on_sales;
    `);

    await sequelize.query(`
      CREATE TRIGGER trg_decrement_stock_on_sale
      AFTER INSERT ON prod_is_on_sales
      FOR EACH ROW
      EXECUTE FUNCTION fn_decrement_stock_on_sale();
    `);

    // ─────────────────────────────────────────────────────────────────
    // ТРИГГЕР 2: При добавлении поставки (shipments)
    // автоматически увеличить quantity в products
    // ─────────────────────────────────────────────────────────────────
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_increment_stock_on_shipment()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE products
        SET quantity = quantity + NEW.count
        WHERE id = NEW.product_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await sequelize.query(`
      DROP TRIGGER IF EXISTS trg_increment_stock_on_shipment ON shipments;
    `);

    await sequelize.query(`
      CREATE TRIGGER trg_increment_stock_on_shipment
      AFTER INSERT ON shipments
      FOR EACH ROW
      EXECUTE FUNCTION fn_increment_stock_on_shipment();
    `);

    // ─────────────────────────────────────────────────────────────────
    // ФУНКЦИЯ: Выручка за период (для отчётов)
    // Использование: SELECT * FROM fn_monthly_revenue(2024, 3);
    // ─────────────────────────────────────────────────────────────────
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_monthly_revenue(p_year INT, p_month INT)
      RETURNS TABLE(
        sale_day DATE,
        daily_revenue NUMERIC,
        sales_count BIGINT
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          DATE(sale_date) AS sale_day,
          SUM(total_amount) AS daily_revenue,
          COUNT(*)::BIGINT AS sales_count
        FROM sales
        WHERE EXTRACT(YEAR FROM sale_date) = p_year
          AND EXTRACT(MONTH FROM sale_date) = p_month
        GROUP BY DATE(sale_date)
        ORDER BY DATE(sale_date);
      END;
      $$ LANGUAGE plpgsql;
    `);

    // ─────────────────────────────────────────────────────────────────
    // ФУНКЦИЯ: Топ N продаваемых товаров
    // Использование: SELECT * FROM fn_top_products(10);
    // ─────────────────────────────────────────────────────────────────
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_top_products(p_limit INT DEFAULT 10)
      RETURNS TABLE(
        product_id INT,
        product_name VARCHAR,
        total_qty BIGINT,
        total_revenue NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          SUM(pis.quantity)::BIGINT AS total_qty,
          SUM(pis.quantity * pis.price) AS total_revenue
        FROM prod_is_on_sales pis
        JOIN products p ON p.id = pis.id_product
        GROUP BY p.id, p.name
        ORDER BY total_qty DESC
        LIMIT p_limit;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // ─────────────────────────────────────────────────────────────────
    // ФУНКЦИЯ: Отчёт по клиентам
    // Использование: SELECT * FROM fn_customer_report();
    // ─────────────────────────────────────────────────────────────────
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION fn_customer_report()
      RETURNS TABLE(
        customer_id INT,
        customer_name VARCHAR,
        total_orders BIGINT,
        total_spent NUMERIC,
        avg_order NUMERIC,
        discount INT
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          c.id AS customer_id,
          c.name AS customer_name,
          COUNT(s.id)::BIGINT AS total_orders,
          COALESCE(SUM(s.total_amount), 0) AS total_spent,
          COALESCE(AVG(s.total_amount), 0) AS avg_order,
          c.personal_discount AS discount
        FROM customers c
        LEFT JOIN sales s ON s.id_customer = c.id
        GROUP BY c.id, c.name, c.personal_discount
        ORDER BY total_spent DESC;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("✅ PostgreSQL triggers and functions initialized successfully.");
  } catch (err) {
    console.error("❌ Error initializing triggers:", err.message);
  }
};
