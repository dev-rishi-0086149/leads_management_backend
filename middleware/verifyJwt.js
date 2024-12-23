const jwt = require("jsonwebtoken");


const verifyJWT = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decodedData) => {
      if (error) {
        return reject(error);
      }
      resolve(decodedData);
    });
  });
};

const authenticateToken = async (req, res, next) => {
  try {
    const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
    const receivedToken = req.headers["authorization"]?.split(" ")[1];
    if (!receivedToken) {
      console.log("no token received");
      throw new Error();
    }

    const user = await verifyJWT(receivedToken, SECRET_KEY);
    //console.log("user - " + user);
    req.id=user.id;
    req.emp_id = user.emp_id;
    req.emp_name = user.emp_name;
    req.branch_id = user.branch_id;
    next();
  } catch (error) {
    //console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ status: false, message: "token expired" });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "token is invalid" });
    }
  }
};

module.exports = authenticateToken;
