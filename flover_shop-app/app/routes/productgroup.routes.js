module.exports = app =>{
    const productgroup = require("../controllers/productGroup.controller.js")
    var router = require('express').Router();
    
    //roures
    router.post("/", productgroup.create);
    router.get("/", productgroup.findAll);
    router.get("/:id", productgroup.findOne);
    router.put("/:id", productgroup.updete);
    router.delete("/:id", productgroup.delete);
    router.delete("/:id", productgroup.deleteAll);

    app.use("/api/goodsgroups", router);//бызовый url модели ProductGroup
}