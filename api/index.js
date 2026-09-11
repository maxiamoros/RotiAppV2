module.exports = (req, res) => {
  res.status(200).json({ status: "API Root OK", method: req.method });
};
