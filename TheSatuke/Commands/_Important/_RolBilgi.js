const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Config = require("../../Configuration/Config.json");
const Settings = require("../../Configuration/Settings.json");
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Owner.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

let SatukEmbed = new MessageEmbed()
.setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
.setFooter(Config.Status)
.setColor(Config.EmbedColor)

let SatukeRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]); 
if (!SatukeRole) return message.lineReply(SatukEmbed.setDescription(`${Settings.emojiler.iptal} Geçerli bir rol belirtmeli/Rol ID'si girmelisin.`))
  
let satArray = new Array();
let satukecimÜyeler = SatukeRole.members.forEach(satukecim => {satArray.push(`<@!${satukecim.id}> (\`${satukecim.id}\`)`);})
message.lineReply(SatukEmbed.setDescription(`
${SatukeRole} (\`${SatukeRole.id}\`) adlı role ait bilgiler aşağıda verilmiştir.

➜ **Rol Rengi:** ${SatukeRole.hexColor}
➜ **Rol ID'si:** ${SatukeRole.id}
➜ **Roldeki Kişi Sayısı**: ${SatukeRole.members.size}


**Roldeki kişiler:**

${SatukeRole.members.size <= 20 ? satArray.join("\n") : `\`\`\`Rolde 20'ten Fazla Kişi Olduğu İçin Sıralayamadım.\`\`\``}`))
};

module.exports.settings = {
    Commands: ["rb", "rolbilgi", "rol-bilgi", "rolinfo"],
    Usage: "rolbilgi",
    Description: "",
    Category: "Advanced",
    cooldown: 5000,
    Activity: true
}