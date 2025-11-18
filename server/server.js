app.get("/:code", async (req, res) => {
  const Url = require("./models/Url");
  const code = req.params.code;

  try {
    const record = await Url.findOne({ shortCode: code });

    if (!record) return res.status(404).send("Short URL not found");

    record.clicks += 1;
    record.clickHistory.push(Date.now());
    await record.save();

    return res.redirect(record.originalUrl);
  } catch (err) {
    console.error("Redirect Error:", err);
    res.status(500).send("Server error");
  }
});
