const { Message, Client, MessageEmbed, Discord, Application, MessageFlags} = require("discord.js");
const moment = require("moment");
require("moment-timezone");
require("moment-duration-format")
moment.locale("tr")

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */

module.exports.execute = async (client, message, args) => {
if (message.author.id != "707325480378040430") return;
if (!args[0]) return;
let code = args.join(' ');
function clean(text) {
if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
return text;
};
try { 
var evaled = clean(await eval(code));
if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Ups! Did you take your head?");
message.channel.send(`${evaled.replace(client.token, "Ups! Did you take your head?")}`, {code: "js", split: true});
} catch(err) { message.channel.send(err, {code: "js", split: true}) };
};

module.exports.settings = {
    Commands: ["eval"],
    Usage: "eval <code>",
    Category: "Owner",
    Description: "",
    cooldown: 5000,
    Activity: true
}