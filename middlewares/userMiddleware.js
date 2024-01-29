require("dotenv").config();
const jwt = require("jsonwebtoken");
const userService = require("../app/services/userServices");

module.exports = {
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN || "o4k5n43n5o3n2p3n5pm3mp99fgnl4dmblwq4m3"
      );

      req.user = await userService.getByMail(tokenPayload.email);
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: "Anda tidak punya akses (Unauthorized)",
        });
        return;
      }

      next();
    } catch (error) {
      if (error.message.includes("jwt expired")) {
        res.status(401).json({ message: "Token Expired" });
        return;
      }
      res.status(401).json({
        message: "Anda tidak punya akses (Unauthorized)",
      });
    }
  },

  async validateToken(req, res) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN || "o4k5n43n5o3n2p3n5pm3mp99fgnl4dmblwq4m3"
      );
      const expDate = new Date(tokenPayload.exp * 1000);
      if (tokenPayload != null) {
        res.status(200).json({
          tokenStatus: "Valid",
          dateExpired: expDate,
        });
      }
    } catch (error) {
      if (error.message.includes("jwt expired")) {
        res.status(401).json({ tokenStatus: "Expired" });
        return;
      }
      res.status(401).json({
        message: "Anda tidak punya akses (Unauthorized)",
      });
    }
  },
};
