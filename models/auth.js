const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const authSchema = Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

const joiSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(4).required(),
});

const User = model("user", authSchema);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      Status: "409 Conflict",
      ResponseBody: {
        message: "Email in use",
      },
    });
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({ email, password: hashPassword });
  return result;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });
  }
  const passCompare = bcrypt.compareSync(password, user.password);
  if (!passCompare) {
    return res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  return { token, user };
};

const logout = async (req, res) => {
  const { _id } = req.user._conditions;
  if (!_id) {
    return res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Not authorized",
      },
    });
  }
  await User.findByIdAndUpdate(_id, { token: null });
};

module.exports = {
  joiSchema,
  register,
  login,
  logout,
  User,
};
