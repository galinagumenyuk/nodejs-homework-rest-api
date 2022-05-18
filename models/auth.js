const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");

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
  avatarURL: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
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
  const avatarURL = gravatar.url(email);
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const verificationToken = nanoid();

  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const msg = {
    to: email,
    subject: "Confirm your email",
    html: `<a target="_blank" href="http://localhost:3000/api//users/verify/${verificationToken}">Confirm email </a>`,
  };
  await sendEmail(msg);
  return result;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verify) {
    return res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Email or password is wrong or not verify",
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "48h" });
  await User.findByIdAndUpdate(user._id, { token });
  return { token, user };
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });
};

module.exports = {
  joiSchema,
  register,
  login,
  logout,
  User,
};
