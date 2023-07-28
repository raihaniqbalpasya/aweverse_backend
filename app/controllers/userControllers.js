const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userServices");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await userService.getAll();
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data empty, please input some data!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async register(req, res) {
    try {
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      if (req.body.password === null || req.body.password === "") {
        res.status(422).json({
          status: false,
          message: "Password cannot be empty",
        });
      } else {
        const data = await userService.create({
          username: req.body.username,
          phone: req.body.phone,
          email: req.body.email,
          password: hashPassword,
        });
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data,
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async login(req, res) {
    try {
      const mail = req.body.email;
      const user = await userService.getByMail(mail);
      if (!user)
        return res.status(404).send({ message: "Email account not found!" });

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(400).json({ message: "Wrong Password" });

      const id = user.id;
      const name = user.username;
      const email = user.email;
      const accessToken = jwt.sign(
        { id, name, email },
        process.env.ACCESS_TOKEN || "o4k5n43n5o3n2p3n5pm3mp99fgnl4dmblwq4m3",
        { expiresIn: "3d" }
      );
      res.status(200).json({
        status: true,
        message: "Login Successfull!",
        accessToken: accessToken,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getMyProfile(req, res) {
    try {
      const data = await userService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Successfully get user profile",
          data,
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async changePassword(req, res) {
    const user = await userService.getByMail(req.user.email);
    if (user) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        if (req.body.password === req.body.oldPassword) {
          res.status(404).json({
            status: false,
            message: "Please create a different new password!",
          });
        } else {
          await userService.update(user.id, {
            password: newPassword,
          });
          res.status(200).json({
            status: true,
            message: "Successfully change password",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "Password not match with old password",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  },
};
