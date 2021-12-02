const { MessageEmbed } = require("discord.js");
const Text = require("../../Configuration/Text.json");
const Settings = require("../../Configuration/Settings.json");

module.exports.execute = async (client, message, args) => {
  if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.RegisterID.some(authRole => message.member.roles.cache.has(authRole))) return message.lineReply(`${Settings.emojiler.iptal} ${Text.YetkinYetmiyor}`);


  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setColor("PURPLE");
  if (!member) return message.channel.send(embed.setDescription("Kullanıcı belirtmelisin")).then(x => x.delete({ timeout: 5500 }));
  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`${member} bu işlemi gerçekleştiremiyorum`)).then(x => x.delete({ timeout: 5000 }));
  var newName;
  args = args.filter(a => a.trim().length).slice(1);
  if (Config.name_age) {
    let name = args.filter(a => isNaN(a)).map(a => a.charAt(0).replace("i", "İ").toUpperCase() + a.slice(1)).join(" ");
    if (!name) return message.lineReply(`${Settings.emojiler.iptal} Geçerli bir isim belirt.`).then(x => x.delete({ timeout: 7000 }));
    newName = `${name} Shiva`;
  } else {
    newName = `${member.user.tag.includes(Settings.Tag.Tag) ? Settings.Tag.Tag : Settings.Tag.Tag2} ${args.join(" ")}`;
  };
member.setNickname(newName).catch(err => { return undefined; });
  message.react(Settings.emojiler.onayID);
};


module.exports.settings = {
  Commands: ["isim","nick"],
  Usage: "isim",
  Description: "",
  Category: "General",
  Activity: true
}

