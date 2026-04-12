module.exports = app => {
  const shipment = require("../controllers/shipment.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Shipment:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *         product_id:
   *           type: integer
   *         provider_id:
   *           type: integer
   *         count:
   *           type: integer
   */

  /**
   * @swagger
   * /api/shipment:
   *   post:
   *     summary: Create shipment
   *     tags: [Shipments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Shipment'
   *     responses:
   *       200:
   *         description: Shipment created
   */
  router.post("/", shipment.create);

  /**
   * @swagger
   * /api/shipment:
   *   get:
   *     summary: Get all shipments
   *     tags: [Shipments]
   *     responses:
   *       200:
   *         description: List of shipments
   */
  router.get("/", shipment.findAll);

  /**
   * @swagger
   * /api/shipment/{id}:
   *   get:
   *     summary: Get shipment by ID
   *     tags: [Shipments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Shipment found
   */
  router.get("/:id", shipment.findOne);

  /**
   * @swagger
   * /api/shipment/{id}:
   *   put:
   *     summary: Update shipment
   *     tags: [Shipments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Shipment'
   *     responses:
   *       200:
   *         description: Shipment updated
   */
  router.put("/:id", shipment.update);

  /**
   * @swagger
   * /api/shipment/{id}:
   *   delete:
   *     summary: Delete shipment
   *     tags: [Shipments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Shipment deleted
   */
  router.delete("/:id", shipment.delete);

  app.use("/api/shipment", router);
};
