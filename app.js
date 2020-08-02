const { Client } = require('discord.js');
const readline = require("readline");
const cfg = require('../config.json');
const chalk = require('chalk');
let stream = [];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})
const constructPrompt = (msg) => {
	let tmp = "";
	for (i = 0; i < stream.length; i++) {
		tmp += stream[i];
	}
	return tmp;
}
const post = (msg) => {
	stream.push(msg + '\n');
	tmp = constructPrompt(msg);
	rl.setPrompt(tmp);
	chalk.red(rl.prompt(1));
	//console.log(tmp);
}
const bot = new Client();

bot.on('ready', () => {
	console.log(chalk.green('I\'m ready!\n'));

	//be sure to put your identification in the user property of config.json
	bot.user.setActivity('on '+ cfg.user +'\'s PC');
})

//console commands
rl.on('line', (input) => {
	stream = [];
	const origMsg = `${input}`;
	var command = origMsg.split(' ')[0].toLowerCase();
	var attribute = origMsg.substr(origMsg.indexOf(' ')+1);

	if (command=="say") {
		bot.channels.get('511380337993973775').send(attribute);
	} else {
		post("\""+command+"\" is not a valid command");
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
		} else if (cmd == "active") {
			if (msg.member.roles.find(r => r.name === "Active")) {
				msg.member.removeRole('566427859606962186').catch(console.error);
				bot.channels.get('511380337993973775').send("You no longer have the `Active` role");
			} else {
				msg.member.addRole('566427859606962186').catch(console.error);
				bot.channels.get('511380337993973775').send('You now hove the `active` role');
			}
		} else {
			bot.channels.get('511380337993973775').send("\""+command+"\" is not a valid command");
		}
	}

	//bot.fetchUser(id)
	
	//logs users and their message
	//console.log(msg.author.username + ': ' + msg.content);
	post(msg.author.username + ': ' + msg.content);
})

//event when any user changes their presence
bot.on("presenceUpdate", (oldMember, newMember) => {

	//A string that gives the User and their discord status
	const generalStatus = newMember.displayName + " is now " + newMember.presence.status;

	//check if User went offline or something
	if (newMember.presence.game === null) {
		post(generalStatus);
		//console.log(generalStatus)
	} else {
		//Check if the user is streaming
		if (newMember.presence.game.streaming === true) {
			bot.channels.get("585613596134735874").send("<@!" + newMember.id + "> is now live! \n" + newMember.nickname + ": " + newMember.presence.game.name);
		} else {
			//state the status of the user
			post(generalStatus);
			//console.log(generalStatus);
		}
	}

})

//Add and removes a role that allows the user to type in vc-text
bot.on("voiceStateUpdate", (oldMember,newMember) => {
	if (newMember.voiceChannel == null) {
		console.log(newMember.displayName + " left VC.")
		newMember.removeRole('640311067485929476').catch(console.error)
	} else {
		console.log(newMember.displayName + " is in VC.")
		newMember.addRole('640311067485929476').catch(console.error)
	}
})

bot.login(cfg.token)