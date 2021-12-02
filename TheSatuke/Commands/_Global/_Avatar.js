const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {  
	if (!message.guild) return;
  let user = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author

  message.lineReply(`**${user.tag}** ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
}
module.exports.settings = {
    Commands: ["av", "avatar", "pp"],
    Usage: "av",
    Description: "",
    Category: "General",
    Activity: true
}