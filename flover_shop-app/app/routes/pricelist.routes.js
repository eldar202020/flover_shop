module.exports = app =>{
    const productgroup = require("../controllers/priceList.controller.js");
    
    var router = require("express").Router();

    router.post("/", productgroup.create);
    router.get("/", productgroup.findAll);
    router.get("/:id", productgroup.findOne);
    router.put("/:id", productgroup.update);
    router.delete("/:id", productgroup.delete);
    router.delete("/", productgroup.deleteAll);

    app.use("/api/priceList", router);//бызовый url модели ProductGroup
    console.log('router for /api/priceList initialized')
}