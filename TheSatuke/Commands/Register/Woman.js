const { MessageEmbed } = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const teyitci = require("../../Models/Database/Teyitci");
const kayitlar = require("../../Models/Database/Kayıtlar");
const Config = require("../../Configuration/Config.json");
const Text = require("../../Configuration/Text.json");

module.exports.execute = async (client, message, args) => {
  
  if(!message.member.roles.cache.get("915176007177232434") && !message.member.hasPermission('ADMINISTRATOR'))  return message.lineReply(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`);
  var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  var embed = new MessageEmbed().setColor(Config.EmbedColor).setFooter(Config.Footer).setTimestamp();
  if (!member) return message.lineReply(embed.setDescription(`${Settings.emojiler.iptal} Geçerli bir \`@Satuke/ID\` belirtmelisin`)).then(x => x.delete({ timeout: 5500 }));
  if (message.member.roles.highest.position <= member.roles.highest.position) return message.lineReply(embed.setDescription(`${Settings.emojiler.iptal} ${member} Bu işlemi gerçekleştiremiyorum (üst/aynı) yetkidesiniz`)).then(x => x.delete({ timeout: 5500 }));
    if (args[1]) {
      var newName;
      args = args.filter(a => a.trim().length).slice(1);
      if (Config.name_age) {
        let name = args.filter(a => isNaN(a)).map(a => a.charAt(0).replace("i", "İ").toUpperCase() + a.slice(1)).join(" ");
        if (!name) return message.lineReply(embed.setDescription(`Geçerli bir isim ve yaş belirtmelisin!`)).then(x => x.delete({ timeout: 5000 }));
        newName = `${name} Shiva`;
      };
      await member.setNickname(newName).catch(err => { return undefined; });
    };
    message.react(Settings.emojiler.onayID);
      if (Settings.Roles.Unregistered.some(r => member.roles.cache.has(r))) {
    await teyitci.findByIdAndUpdate(message.author.id, { $inc: { teyitler: 1 } }, { upsert: true });
    await kayitlar.findByIdAndUpdate(member.id, { $push: { kayitlar: [{ isim: member.displayName, roller: Settings.Roles.Woman, tarih: Date.now() }] } }, { upsert: true });
  };
  await member.roles.set(member.roles.cache.map(r => r.id).filter(r => !Settings.Roles.Unregistered.includes(r) && !Settings.Roles.Man.includes(r)).concat(Settings.Roles.Woman)).catch(err => { return undefined; });
  let kanal = member.guild.channels.cache.find(r => r.id === Settings.Server.ChatChannel);
  kanal.send(`${member} Aramıza katıldı, Hoşgeldin <a:1784_hello:915736178618150992>`).then(x => x.delete({ timeout: 15000 }));  
};

module.exports.settings = {
  Commands: ["k", "kiz", "girl", "woman","kız","Kız","Kadın","K"],
  Usage: "kız",
  Description: "",
  Category: "General",
  Activity: true
}
