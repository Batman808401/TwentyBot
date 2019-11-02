const { Client } = require('discord.js');
const readline = require("readline");
const bot = new Client();
const cfg = require('../config.json');

bot.on('ready', () => {
	console.log('I\'m ready!');

	//be sure to put your identification in the user property of config.json
	bot.user.setActivity('on '+ cfg.user +'\'s PC');
})

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

//console commands
rl.on('line', (input) => {

	const origMsg = `${input}`;
	var command = origMsg.split(' ')[0].toLowerCase();
	var attribute = origMsg.substr(origMsg.indexOf(' ')+1);

	if (command=="say") {
		bot.channels.get('511380337993973775').send(attribute);
	} else {
		console.log("\""+command+"\" is not a valid command")
	}

})

//event when messages are sent through 20 QUAD
bot.on('message', msg => {

	const origMsg = msg.content;
	const attribute = origMsg.substr(origMsg.indexOf(' ')+1);
	const command = origMsg.split(' ')[0].toLowerCase();
	const cmd = command.substr(command.indexOf("!")+1)

	if (origMsg[0] == "!" && !msg.author.bot) {
		if (cmd == "mimic") {
			bot.channels.get('511380337993973775').send(attribute);
		} else {
			bot.channels.get('511380337993973775').send("\""+command+"\" is not a valid command");
		}
	}

	//logs users and their message
	console.log(msg.author.username + ': ' + msg.content);
})

//event when any user changes their presence
bot.on("presenceUpdate", (oldMember, newMember) => {

	//A string that gives the User and their discord status
	const generalStatus = newMember.displayName + " is now " + newMember.presence.status;

	//check if User went offline or something
	if (newMember.presence.game === null) {
		console.log(generalStatus)
	} else {
		//Check if the user is streaming
		if (newMember.presence.game.streaming === true) {
			//check if this person has been streaming
			if (newMember.user.tag === oldMember.user.tag && oldMember.presence.game.streaming === true) {
				bot.channels.get("585613596134735874").send("<@!" + newMember.id + "> changed their stream name to: " + newMember.presence.game.name);
			} else {
				//A new stream has started
				bot.channels.get("585613596134735874").send("<@!" + newMember.id + "> is now live! \n" + newMember.nickname + ": " + newMember.presence.game.name);
			}
		} else {
			//state the status of the user
			console.log(generalStatus);
		}
	}

})

bot.login(cfg.token)