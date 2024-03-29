const controller = require("../controllers/auth.controllers");

module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/sendOtp", controller.sendOTP);
    app.post("/api/auth/verifyOtp", controller.verifyOTP);
    app.post("/api/auth/registerUser", controller.registerUser);
    app.post("/api/auth/loginUser", controller.loginUser);
};