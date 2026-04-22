/**
 * ПЕЧАТНЫЙ МОДУЛЬ (FRONTEND UTILITY)
 * Этот скрипт позволяет имитировать печать чека из базы данных.
 * Запуск: node index.js [ID_ПРОДАЖИ]
 */

const axios = require('axios');

async function printReceipt(saleId) {
    console.log(`\n--- ПОЛУЧЕНИЕ ДАННЫХ ДЛЯ ЧЕКА #${saleId} ---\n`);

    try {
        // Запрос к нашему API (убедитесь, что сервер запущен на порту 8080)
        const response = await axios.get(`http://localhost:8080/api/sales/${saleId}`);
        const sale = response.data;

        // Красивый шаблон чека для консоли (эмуляция термопринтера)
        console.log("********************************");
        console.log("         FLOVER SHOP           ");
        console.log("    Магазин живых цветов       ");
        console.log("********************************");
        console.log(`Чек №: ${sale.id}`);
        console.log(`Дата:  ${new Date(sale.sale_date).toLocaleString('ru-RU')}`);
        console.log("--------------------------------");

        // В реальном API мы бы получили список товаров, здесь пример:
        console.log("Товары:");
        console.log(" - Букет 'Весна' x1   | 2500р");
        console.log(" - Упаковка крафт x1  | 150р");

        console.log("--------------------------------");
        console.log(`ИТОГО:          ${sale.total_amount} руб.`);
        console.log("********************************");
        console.log("      СПАСИБО ЗА ПОКУПКУ!       ");
        console.log("********************************\n");

    } catch (error) {
        console.error("Ошибка при получении данных: Сервер не отвечает или ID не найден.");
        console.log("Убедитесь, что Docker-контейнер 'app' запущен.");
    }
}

// Получаем ID из аргументов командной строки
const saleId = process.argv[2] || 1;
printReceipt(saleId);
