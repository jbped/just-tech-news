const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const dashboardRoutes = require("./dashboard-routes");

router.use("/api", apiRoutes);

router.use("/", homeRoutes);

router.use("/dashboard", dashboardRoutes);

// Returns 404 err if a non-existent endpoint is attempted
router.use((req,res) => {
    res.status(404).end();
});

module.exports = router;