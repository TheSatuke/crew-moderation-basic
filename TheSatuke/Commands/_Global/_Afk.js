const Discord = require('discord.js');
const Settings = require("../../Configuration/Settings.json");
const Config = require("../../Configuration/Config.json");

const db = require('quick.db');
  
module.exports.execute = async (client, message, args) => {
  
if (message.member.displayName.startsWith("[AFK] ")) return;
let uye = message.guild.members.cache.get(message.author.id);
let reason = args.join(' ') || "Sebep Belirtilmedi!";
let nick = uye.displayName;
db.set(`sebep_${message.author.id}_${message.guild.id}`, reason);
db.set(`user_${message.author.id}_${message.guild.id}`,message.author.id);
db.set(`afktime_${message.guild.id}`,Date.now());
db.set(`nick_${message.author.id}_${message.guild.id}`, nick);
let sebep = db.fetch(`sebep_${message.author.id}_${message.guild.id}`);
message.member.setNickname(`[AFK] ` + nick)
message.lineReply(`${message.author} Başarıyla **${sebep}** sebebiyle afk moduna giriş yaptınız.`).then(x => x.delete({ timeout: 7500 }))
}

module.exports.settings = {
    Commands: ["afk"],
    Usage: "afk <sebep>",
    Description: "Etiketlediğin kişinin aktif olan susturma cezalarından herhangi birini kaldırabilirsin.",
    Category: "General",
    permlevel: 0,
    Activity: true
}