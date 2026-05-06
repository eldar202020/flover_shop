const db = require("../models");
const ProdIsOnSale = db.prodIsOnSale;
const Product = db.product;
const { Sequelize } = db;

// Получить все позиции чека по id продажи
exports.findBySaleId = async (req, res) => {
  const saleId = req.params.saleId;
  try {
    const items = await ProdIsOnSale.findAll({
      where: { id_sale: saleId },
      include: [{ model: Product, attributes: ['id', 'name', 'description'] }],
    });
    console.log(`Finding items for saleId: ${saleId}, found: ${items.length}`);
    res.send(items);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Ошибка получения позиций.' });
  }
};

exports.create = async (req, res) => {
  const { id_product, id_sale, quantity, price } = req.body;

  if (!id_product || !id_sale || !quantity || quantity <= 0) {
    return res.status(400).send({ message: "Укажите корректные id_product, id_sale и quantity." });
  }

  const t = await db.sequelize.transaction();
  try {
    // Блокируем строку товара на время транзакции
    const product = await Product.findOne({
      where: { id: id_product },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).send({ message: `Товар с id=${id_product} не найден.` });
    }

    if (product.quantity < quantity) {
      await t.rollback();
      return res.status(409).send({
        message: `Недостаточно товара на складе.`,
        product: product.name,
        requested: quantity,
        available: product.quantity,
      });
    }

    // Декрементируем остаток
    await product.decrement("quantity", { by: quantity, transaction: t });

    // Создаём запись
    const item = await ProdIsOnSale.create(
      { id_product, id_sale, quantity, price },
      { transaction: t }
    );

    await t.commit();
    res.send(item);

  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message || "Ошибка при создании позиции." });
  }
};

exports.findAll = (req, res) => {
  ProdIsOnSale.findAll()
    .then(data => res.send(data))
    .catch(() => res.status(500).send({ message: "Ошибка получения записей." }));
};

exports.findOne = (req, res) => {
  ProdIsOnSale.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Не найдено." }))
    .catch(() => res.status(500).send({ message: "Ошибка." }));
};

exports.update = (req, res) => {
  ProdIsOnSale.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1
      ? res.send({ message: "Обновлено." })
      : res.send({ message: "Не удалось обновить." }))
    .catch(() => res.status(500).send({ message: "Ошибка." }));
};

exports.delete = (req, res) => {
  ProdIsOnSale.destroy({ where: { id: req.params.id } })
    .then(num => num == 1
      ? res.send({ message: "Удалено." })
      : res.send({ message: "Не удалось удалить." }))
    .catch(() => res.status(500).send({ message: "Ошибка." }));
};
