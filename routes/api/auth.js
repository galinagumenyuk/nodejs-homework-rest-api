const express = require("express");
const router = express.Router();
const { joiSchema, register, login } = require("../../models/auth");

router.post("/signup", async (req, res, next) => {
  const validationResult = joiSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({
      status: "400 Bad Request",
      responseBody: `${validationResult.error}`,
    });
  }
  const newUser = await register(req, res);
  res.status(201).json({
    Status: "201 Created",
    ResponseBody: {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    },
  });
});

router.post("/login", async (req, res, next) => {
  const validationResult = joiSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({
      status: "400 Bad Request",
      responseBody: `${validationResult.error}`,
    });
  }
  const authUser = await login(req, res);
  res.status(200).json({
    Status: "200 OK",
    ResponseBody: {
      token: authUser.token,
      user: {
        email: authUser.user.email,
        subscription: authUser.user.subscription,
      },
    },
  });
});

module.exports = router;
