const Config = global.Config = require("./TheSatuke/Configuration/Config.json");
const { Client } = require("discord.js");
const client = global.Client = new Client({ fetchAllMembers: true });
require('discord-reply');
const fs = require("fs");

let CommandId = 0;
const Commands = global.Commands = new Array();

let dirs = fs.readdirSync("./TheSatuke/Commands", { encoding: "utf8" });
dirs.forEach(dir => {
  let files = fs.readdirSync(`./TheSatuke/Commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
  files.forEach(file => {
    let ref = require(`./TheSatuke/Commands/${dir}/${file}`);
    if (!ref.settings)

    if (ref.onLoad != undefined && typeof ref.onLoad == "function") ref.onLoad(client);
    ref.settings.id = CommandId;
    Commands.push(ref);
    CommandId += 1;
  });
});

const mongoose = require("mongoose");
mongoose.connect(Config.DatabaseUrl.replace("<dbname>", Config.DatabaseName), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.on("connected", () => { console.log(`MongoDB'ye başarıyla bağlandım.`)  
require("./TheSatuke/Moderation.js");
require("./TheSatuke/Counter.js");
});

