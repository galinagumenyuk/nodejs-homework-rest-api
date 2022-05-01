const express = require("express");
const router = express.Router();
const { joiSchema, register } = require("../../models/auth");

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

module.exports = router;
