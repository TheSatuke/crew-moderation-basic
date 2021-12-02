const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const roller = require("../../Models/Database/RolLog")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

  /** 
  * @param {Client} client 
  * @param {Message} message 
  * @param {Array<String>} args 
  */  

module.exports.execute = async (client, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Roles.Commander.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));
    const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const Veri = await roller.findOne({ user: Member.id });
    if (!Veri) return message.lineReply("<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı.", message.author, message.channel)
    let page = 1;
    let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
    let liste = rol.map(x =>  `${x.state == "Ekleme" ? Settings.emojiler.tik : Settings.emojiler.iptal} Rol: <@&${x.rol}> Yetkili: <@${x.mod}>\nTarih: ${moment(x.tarih).format("LLL")}`)
    var msg = await message.channel.send(new MessageEmbed().setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n ${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n─────────────────\n')}`).setColor("RANDOM").setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
    if (liste.length > 10) {
        await msg.react(`⬅️`);
        await msg.react(`➡️`);
        let collector = msg.createReactionCollector((react, user) => ["⬅️", "➡️"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
        collector.on("collect", (react) => {
            if (react.emoji.name == "➡️") {
                if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                page += 1;
                let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\--------------------------------------\n");
                msg.edit(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n${rollogVeri}`).setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
                react.users.remove(message.author.id)
            }
 
            if (react.emoji.name == "⬅️") {
                if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                page -= 1;
                let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n--------------------------------------\n");
                msg.edit(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n${rollogVeri}`).setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
                react.users.remove(message.author.id)
            }
        })
    }
}

module.exports.settings = {
    Commands: ["rl","rolelog","rol-log","rollog"],
    Usage: "r",
    Description: "Sunucuda rolü olmayan kişilere kayıtsız rolünü verir!",
    Category: "General",
    Activity: true
}