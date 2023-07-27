const { User } = require("../models");

module.exports = {
  getAll() {
    try {
      return User.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return User.findOne({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["password"],
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByMail(email) {
    try {
      return User.findOne({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return User.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return User.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
