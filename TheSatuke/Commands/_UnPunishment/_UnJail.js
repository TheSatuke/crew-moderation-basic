const { Message, Client, Application, MessageFlags} = require("discord.js");
const Discord = require("discord.js");
const Settings = require("../../Configuration/Settings.json");
const client = global.client;
const moment = require("moment");
const Penal = require("../../Models/Database/Penal");
const PenalManager = require("../../Managers/PenalManager");
const Config = require("../../Configuration/Config.json");
const PM = require("../../Managers/PenalManager");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !Settings.Penals.Mute.AuthRoles.some(authRole => message.member.roles.cache.has(authRole)))
    return message.lineReply(`${Settings.emojiler.iptal} Bu komudu kullanmaya yetkin yetmiyor :c`).then(x => x.delete({timeout: 7500}));

    let penals = await PenalManager.getPenals({ User: victim.id, Activity: true, $or: [{ Type: PenalManager.Types.TEMP_JAIL }, {  Type: PenalManager.Types.TEMP_JAIL  }] });
    if (penals.length <= 0) return message.lineReply(`${Settings.emojiler.iptal} ${victim} Bu kullanıcının hiç **Jail** cezası yok.`);

    let member = await message.guild.getMember(victim.id);
    if (member && member.roles.highest.position >= message.member.roles.highest.position) return message.reply("Senin rolünden üstte ya da aynı roldeki birisinin cezasını kaldıramazsın.");

    let cezaNumaraları = penals.map(penal => penal.Id);

    let msg = await message.lineReply(`${victim} Kullanıcısının toplam **${penals.length}** adet sohbet cezası var, Cezalardan hangisin kaldırmak istiyorsunuz? \`(${cezaNumaraları.map(e => "#" + e).join(", ")})\``);

    let messages = await msg.channel.awaitMessages((m) => m.author.id == message.author.id && cezaNumaraları.some(cevap => m.content.toLowerCase().includes(cevap)), {
        max: 1,
        time: 15000
    });

    if (messages.size <= 0) {
        return message.lineReply(`${Settings.emojiler.iptal} ${member} için başlatılmış ceza kaldırmaya cevap vermediin için iptal ediliyor`)
    }

    let reply = messages.first();
    let penalId = cezaNumaraları.find(e => reply.content.includes(e));
    if (penalId) {
    penalId = Number(penalId);
    await Penal.updateMany({ Id: penalId }, { $set: { Activity: false } }).exec();
    if (member && member.roles.cache.has(Settings.Penals.Jail.Role)) member.roles.remove(Settings.Penals.Jail.Role);

    message.lineReply(`${Settings.emojiler.tik} ${member} kullanıcısının \`#${penalId}\` Numaralı **Jail** cezası kaldırıldı.`);
    message.react(Settings.emojiler.onayID)
    }
    else message.lineReply(`${Settings.emojiler.iptal} ${victim} **Jail** cezası kaldırılma işlemi iptal edildi.`);
};

module.exports.settings = {
    Commands: ["un-jail","unjail","Unjail","karantinakaldır","karantinaaf","cezaf","cezakaldır","Un-jail"],
    Usage: "unjail",
    Description: "",
    Category: "Penal",
    Activity: true
}