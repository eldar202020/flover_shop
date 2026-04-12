module.exports = app => {
  const provider = require("../controllers/provider.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * components:
   *   schemas:
   *     Provider:
   *       type: object
   *       required:
   *         - organization_name
   *       properties:
   *         id:
   *           type: integer
   *         organization_name:
   *           type: string
   */

  /**
   * @swagger
   * /api/provider:
   *   post:
   *     summary: Create provider
   *     tags: [Providers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Provider'
   *     responses:
   *       200:
   *         description: Provider created
   */
  router.post("/", provider.create);

  /**
   * @swagger
   * /api/provider:
   *   get:
   *     summary: Get all providers
   *     tags: [Providers]
   *     responses:
   *       200:
   *         description: List of providers
   */
  router.get("/", provider.findAll);

  /**
   * @swagger
   * /api/provider/{id}:
   *   get:
   *     summary: Get provider by ID
   *     tags: [Providers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Provider found
   */
  router.get("/:id", provider.findOne);

  /**
   * @swagger
   * /api/provider/{id}:
   *   put:
   *     summary: Update provider
   *     tags: [Providers]
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
   *             $ref: '#/components/schemas/Provider'
   *     responses:
   *       200:
   *         description: Provider updated
   */
  router.put("/:id", provider.update);

  /**
   * @swagger
   * /api/provider/{id}:
   *   delete:
   *     summary: Delete provider
   *     tags: [Providers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Provider deleted
   */
  router.delete("/:id", provider.delete);

  app.use("/api/provider", router);
};
