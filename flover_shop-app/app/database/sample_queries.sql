-- ============================================================
-- Flover Shop — Примеры SQL-запросов для курсовой работы
-- СУБД: PostgreSQL
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SELECT — ЗАПРОСЫ НА ВЫБОРКУ
-- ────────────────────────────────────────────────────────────

-- 1.1 Все товары с их категориями (LEFT JOIN)
SELECT
    p.id,
    p.name AS "Товар",
    pg.name AS "Категория",
    p.quantity AS "Остаток",
    p.cost_price AS "Себестоимость",
    p.min_threshold AS "Мин. порог"
FROM products p
LEFT JOIN product_groups pg ON pg.id = p.id_category
ORDER BY pg.name, p.name;

-- 1.2 Товары с низким остатком (CHECK: quantity <= min_threshold)
SELECT
    p.name AS "Товар",
    p.quantity AS "Текущий остаток",
    p.min_threshold AS "Минимальный порог",
    pg.name AS "Категория"
FROM products p
LEFT JOIN product_groups pg ON pg.id = p.id_category
WHERE p.quantity <= p.min_threshold
ORDER BY p.quantity ASC;

-- 1.3 Выручка по периоду с фильтром дат и агрегацией
SELECT
    DATE(sale_date) AS "Дата",
    COUNT(*) AS "Кол-во продаж",
    SUM(total_amount) AS "Выручка",
    AVG(total_amount) AS "Средний чек",
    MAX(total_amount) AS "Максимальный чек"
FROM sales
WHERE sale_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY DATE(sale_date)
ORDER BY DATE(sale_date);

-- 1.4 Топ-10 продаваемых товаров с выручкой
SELECT
    p.name AS "Товар",
    pg.name AS "Категория",
    SUM(pis.quantity) AS "Продано шт.",
    SUM(pis.quantity * pis.price) AS "Выручка"
FROM prod_is_on_sales pis
JOIN products p ON p.id = pis.id_product
LEFT JOIN product_groups pg ON pg.id = p.id_category
GROUP BY p.id, p.name, pg.name
ORDER BY "Продано шт." DESC
LIMIT 10;

-- 1.5 Отчёт по клиентам (WITH агрегатами)
SELECT
    c.name AS "Клиент",
    c.phone AS "Телефон",
    c.personal_discount AS "Скидка, %",
    COUNT(s.id) AS "Кол-во заказов",
    COALESCE(SUM(s.total_amount), 0) AS "Сумма покупок",
    COALESCE(AVG(s.total_amount), 0) AS "Средний чек"
FROM customers c
LEFT JOIN sales s ON s.id_customer = c.id
GROUP BY c.id, c.name, c.phone, c.personal_discount
ORDER BY "Сумма покупок" DESC;

-- 1.6 Статистика поставок по поставщикам
SELECT
    pr.organization_name AS "Поставщик",
    COUNT(sh.id) AS "Кол-во поставок",
    SUM(sh.count) AS "Единиц товара",
    SUM(sh.count * sh.unit_price) AS "Стоимость закупок"
FROM shipments sh
JOIN providers pr ON pr.id = sh.provider_id
GROUP BY pr.id, pr.organization_name
ORDER BY "Стоимость закупок" DESC;

-- 1.7 Полный чек продажи (JOIN трёх таблиц)
SELECT
    s.id AS "ID продажи",
    s.sale_date AS "Дата",
    c.name AS "Клиент",
    p.name AS "Товар",
    pis.quantity AS "Кол-во",
    pis.price AS "Цена",
    pis.quantity * pis.price AS "Сумма строки"
FROM sales s
JOIN customers c ON c.id = s.id_customer
JOIN prod_is_on_sales pis ON pis.id_sale = s.id
JOIN products p ON p.id = pis.id_product
WHERE s.id = 1;

-- 1.8 Анализ прибыли по месяцам (год = 2024)
SELECT
    EXTRACT(MONTH FROM sale_date)::INT AS "Месяц",
    SUM(total_amount) AS "Выручка",
    (SELECT COALESCE(SUM(amount), 0) FROM expenses
     WHERE EXTRACT(YEAR FROM date) = 2024
       AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM s.sale_date)) AS "Расходы"
FROM sales s
WHERE EXTRACT(YEAR FROM sale_date) = 2024
GROUP BY EXTRACT(MONTH FROM sale_date)
ORDER BY "Месяц";


-- ────────────────────────────────────────────────────────────
-- 2. INSERT — ДОБАВЛЕНИЕ ДАННЫХ
-- ────────────────────────────────────────────────────────────

-- 2.1 Добавить нового клиента
INSERT INTO customers (name, phone, personal_purchases, personal_discount, birthday, notes, created_at, updated_at)
VALUES ('Анна Соколова', '+79001234567', 0, 0, '1990-05-15', 'Новый клиент', NOW(), NOW());

-- 2.2 Добавить новый товар
INSERT INTO products (name, description, id_category, quantity, cost_price, min_threshold, created_at, updated_at)
VALUES ('Роза Пионовидная (60см)', 'Нежная пионовидная роза, сорт Дэвид Остин', 1, 50, 120.00, 10, NOW(), NOW());

-- 2.3 Зарегистрировать поставку (триггер автоматически увеличит quantity)
INSERT INTO shipments (product_id, provider_id, count, unit_price, purchase_date, created_at, updated_at)
VALUES (1, 1, 100, 80.00, NOW(), NOW(), NOW());

-- 2.4 Создать продажу и её состав (триггер автоматически уменьшит quantity)
BEGIN;
INSERT INTO sales (id_customer, sale_date, total_amount, created_at, updated_at)
VALUES (1, NOW(), 1500.00, NOW(), NOW());

INSERT INTO prod_is_on_sales (id_sale, id_product, quantity, price, created_at, updated_at)
VALUES (currval('sales_id_seq'), 1, 5, 150.00, NOW(), NOW());
COMMIT;

-- 2.5 Записать расход
INSERT INTO expenses (category, amount, description, date, created_at, updated_at)
VALUES ('Аренда', 50000.00, 'Аренда торгового помещения за апрель', '2024-04-01', NOW(), NOW());


-- ────────────────────────────────────────────────────────────
-- 3. UPDATE — ОБНОВЛЕНИЕ ДАННЫХ
-- ────────────────────────────────────────────────────────────

-- 3.1 Обновить скидку клиента
UPDATE customers
SET personal_discount = 10, updated_at = NOW()
WHERE phone = '+79001234567';

-- 3.2 Корректировка количества товара (инвентаризация)
UPDATE products
SET quantity = 45, updated_at = NOW()
WHERE id = 1;

-- 3.3 Обновить цену в прайс-листе
UPDATE product_in_list_prices
SET price = 175.00, updated_at = NOW()
WHERE id_product = 1 AND id_price_list = 1;


-- ────────────────────────────────────────────────────────────
-- 4. DELETE — УДАЛЕНИЕ ДАННЫХ
-- ────────────────────────────────────────────────────────────

-- 4.1 Удалить клиента без покупок
DELETE FROM customers
WHERE id NOT IN (SELECT DISTINCT id_customer FROM sales WHERE id_customer IS NOT NULL)
  AND created_at < NOW() - INTERVAL '30 days';

-- 4.2 Удалить товар (только если нет в продажах)
DELETE FROM products
WHERE id = 99
  AND id NOT IN (SELECT DISTINCT id_product FROM prod_is_on_sales);

-- 4.3 Удалить устаревшие записи расходов (старше 2 лет)
DELETE FROM expenses
WHERE date < NOW() - INTERVAL '2 years';


-- ────────────────────────────────────────────────────────────
-- 5. ХРАНИМЫЕ ПРОЦЕДУРЫ (созданы через init_triggers.js)
-- ────────────────────────────────────────────────────────────

-- 5.1 Вызов функции: выручка за месяц
SELECT * FROM fn_monthly_revenue(2024, 3);

-- 5.2 Топ 10 продаваемых товаров
SELECT * FROM fn_top_products(10);

-- 5.3 Отчёт по клиентам
SELECT * FROM fn_customer_report();


-- ────────────────────────────────────────────────────────────
-- 6. ПРОВЕРКА РАБОТЫ ТРИГГЕРОВ
-- ────────────────────────────────────────────────────────────

-- Посмотреть все триггеры в БД
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Посмотреть все хранимые функции
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
