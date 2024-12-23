const { Sequelize } = require("sequelize");
const { where, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
require('dotenv').config()



const bcrypt = require("bcrypt");

const Users = require("../models/users");

const generateAccessToken = (payload, time) => {
  try {
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: time,
      }
    );
    return accessToken;
  } catch (error) {
    console.log(error);
    throw { code: 500, message: "error while creating jwt token" };
  }
};

const verifyPassword = async (hashedPassword, plainTextPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

const login = async (req, res) => {
  try {
    const { empRef, password } = req.body;
    if (!empRef || !password)
      return res
        .status(400)
        .json({ status: false, message: "missing empRef or password feilds" });

    const user = await Users.findOne({
      where: {
        [Sequelize.Op.or]: [{ emp_id: empRef }, { emp_email: empRef }],
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "Employee ID/Email not registered" });

    const result = await verifyPassword(user["password"], password);
    if (!result)
      return res
        .status(400)
        .json({ status: "false", message: "invalid credentials" });

    //generate token
    const payload = {
      id: user["id"],
      emp_id: user["emp_id"],
      emp_name:user["emp_name"],
      emp_email: user["emp_email"],
      branch_id: user["branch_id"],
    };
    const accessToken = generateAccessToken(payload, "1h");
    return res.status(200).json({ status: true, token: accessToken });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "error while logging in" });
  }
};

module.exports = { login };

