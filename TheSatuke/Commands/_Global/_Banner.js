const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const axios = require('axios')

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
    let user = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
    let bannerurl = await bannerURL(user.id,client)
    message.lineReply(`**${user.username}** ${bannerurl}`)
 }

async function bannerURL(user, client) {
    const response = await axios.get(`https://discord.com/api/v9/users/${user}`, 
    { 
        headers: { 
        'Authorization': `Bot ${client.token}`
         } });
    if(response.data.banner.startsWith('a_')) 
    return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
    else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`);
  }
module.exports.settings = {
    Commands: ["banner","afiş","afis"],
    Usage: "banner",
    Activity: true,
    Category: "",
    cooldown: 10000
}