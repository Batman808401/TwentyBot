const { Client } = require('discord.js');
const readline = require("readline");
const bot = new Client();
const cfg = require('../config.json');
const Contest = require('./scripts/model-contest.js');

const modelContest = new Contest();

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
		bot.channels.fetch('511380337993973775').send(attribute);
	} else {
		console.log("\""+command+"\" is not a valid command")
	}

})

//event when messages are sent through 20 QUAD
bot.on('message', msg => {

	//parse the message for a command and attribute
	const origMsg = msg.content;
	const attribute = origMsg.substr(origMsg.indexOf(' ')+1);
	const command = origMsg.split(' ')[0].toLowerCase();
	const cmd = command.substr(command.indexOf("!")+1);

	const spamChannel = bot.channels.cache.get('511380337993973775');

	if (origMsg[0] == "!" && !msg.author.bot) {
		switch (cmd) {
			case 'mimic':
				spamChannel.send(attribute);
				break;
			case 'add':
				//add a contestant to the contest
				break;
			default:
				spamChannel.send(`"${msg}" is not a valid command`)
		}
	}

	//logs users and their message
	console.log(msg.author.username + ': ' + msg.content);
})

//event when any user changes their presence
bot.on("presenceUpdate", (oldPresence, newPresence) => {

	//A string that gives the User and their discord status
	const generalStatus = newPresence.user.username + " is now " + newPresence.status;
	console.log(generalStatus);

})

//Add and removes a role that allows the user to type in vc-text
bot.on("voiceStateUpdate", (oldPresence,newPresence) => {
	if (newPresence.voiceChannel == null) {
		console.log(newPresence.displayName + " left VC.")
		newPresence.removeRole('640311067485929476').catch(console.error)
	} else {
		console.log(newPresence.displayName + " is in VC.")
		newPresence.addRole('640311067485929476').catch(console.error)
	}
})

bot.login(cfg.token)