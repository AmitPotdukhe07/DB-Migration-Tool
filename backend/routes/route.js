const express = require("express")
const { getTables, getTableData, getTableSchema, getTableQuery, getProcedures, getFunctions, getViews, getOverview } = require("../controller/onprem.controller")
const { connectCloudDB, createTable, generateCreteQuery } = require("../controller/clouddb.controller")
const router = express.Router()

router.get("/", async (req, res) => {
    res.json({
        msg: "Hello"
    })
})

// on-prem table routes
router.post("/get-tables", getTables)
router.post("/fetch-tables", getTableData)
router.post("/get-table-schema", getTableSchema)
router.get("/get-table-query", getTableQuery)

// on-prem procedures routes
router.get("/get-procedures", getProcedures)
router.get("/get-functions", getFunctions)
router.get("/get-views", getViews)

// Overview
router.get("/get-database-overview", getOverview)

router.post("/insert-data", connectCloudDB)
router.post("/create-table", createTable)
router.post("/generate-create-query", generateCreteQuery)

module.exports = router
