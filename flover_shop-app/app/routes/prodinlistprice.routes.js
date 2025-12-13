module.exports = app =>{
    const pilp = require("../controllers/prodinListPrice.controller.js");
    
    var router = require("express").Router();

    router.post("/", pilp.create);
    router.get("/", pilp.findAll);
    router.get("/:id", pilp.findOne);
    router.put("/:id", pilp.update);
    router.delete("/:id", pilp.delete);
    router.delete("/", pilp.deleteAll);
    router.get("/:id/ProdandPrice", pilp.ProdandPrice);
    router.get("/:id/Pricedata", pilp.priceDATA);

    app.use("/api/prodinListPrice", router);//бызовый url модели ProductGroup
    console.log('router for /api/prodinListPrice initialized')
}