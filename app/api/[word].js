const line = require("@line/bot-sdk");

console.log(process.env.NEXT_PUBLIC_LINE_ACCESS_TOKEN);

const config = {
  channelAccessToken: process.env.NEXT_PUBLIC_LINE_ACCESS_TOKEN,
  channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

module.exports = (req, res) => {
  const word = req.query.word;
  console.info("res data", word);
  client
    .broadcast({
      type: "text",
      text: word,
    })
    .then((data) => console.log(data))
    .catch((e) => console.log(e));

  res.status(200).json({ message: `you requested for ${word}` });
};
