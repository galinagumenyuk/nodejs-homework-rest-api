const express = require("express");
const router = express.Router();
const getCurrent = require("../../models/users");
const auth = require("../../middlewares/auth");

router.get("/current", auth, async (req, res) => {
  const currentUser = await getCurrent(req, res);
  res.status(200).json({
    Status: "200 OK",
    ResponseBody: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
});

module.exports = router;
