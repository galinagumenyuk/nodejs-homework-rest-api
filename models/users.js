const getCurrent = async (req, res) => {
  const curUser = req.user;
  return curUser;
};

module.exports = getCurrent;
