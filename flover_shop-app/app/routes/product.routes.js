const { product } = require("../models/index.js");

module.exports = app =>{
    const product = require("../controllers/product.controller.js");
    
    var router = require("express").Router();

    router.post("/", product.create);
    router.get("/", product.findAll);
    router.get("/:id", product.findOne);
    router.put("/:id", product.update);
    router.delete("/:id", product.delete);
    router.delete("/", product.deleteAll);
    router.get("/:id/getproductgroup", product.getProductGroup);

    app.use("/api/product", router);//бызовый url модели ProductGroup
    console.log('router for /api/productgroups initialized')
}