const Settings = require("../Configuration/Settings.json");

module.exports = (message) => {
    if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
  message.channel.send(`\`Shiva, Shivâ * 1784\``);
  }
    if (message.content.toLowerCase() === ".patlat" || message.content.toLowerCase() === "!patlat") {
    message.channel.send(`Sunucudaki kanallar ve roller silinyor!`);
    }  
  };


module.exports.config = {
    Event: "message"
};
