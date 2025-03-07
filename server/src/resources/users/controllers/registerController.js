const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../model");
const logger = require("../../../config/logger");

const handleNewUser = async (req, res) => {
  try {
    logger.info("User registration request received");
    console.log(req.body);
    const { fullName, email, password } = req.body;

    //check for duplicate users in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate)
      return res.status(409).json({
        message:
          "user already exist with that information, Please change Email!",
      }); //Conflict
    // encrypt password
    const hashedPwd = await bcrypt.hash(password, 10);

    // create and store the new user
    const result = await User.create({
      fullName,
      email,
      password: hashedPwd,
      refreshToken: [],
    });

    // create JWTs
    const accessToken = jwt.sign(
      { userInfo: { id: result._id, fullName, email, role: result.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userInfo: { id: result._id, fullName, email, role: result.role } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save the refreshToken inside the user doc
    await User.findByIdAndUpdate(result._id, {
      $set: { refreshToken: [refreshToken] },
    });

    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true, // comment this when using thunderclient to test refreshToken otherwise cookie will not be set on req.cookies
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "You are registered successfully",
      id: result._id,
      fullName,
      email,
      role: result.role,
      accessToken,
      emailVerified: result.emailVerified
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
