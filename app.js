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

	let submission = '';

	if (msg.channel.type == "dm") {
		//console.log(Array.from(msg.attachments.values())[0].proxyURL)
		if (Array.from(msg.attachments.values())[0] != undefined) {
			submission = Array.from(msg.attachments.values())[0].url;
		} else {
			console.log('no attachments');
		}
		if (origMsg[0] == "!" && msg.author.id == '184326588655992832') {
			switch (cmd) {
				case 'add':
					const addToContest = async () => {
						let user = await bot.users.fetch(attribute).catch(e => {
							return null;
						});
						if (user === null) {
							spamChannel.send(`"${attribute}" is not a user`);
						} else {
							modelContest.addContestant(user.username, user.id);
							spamChannel.send(`${user.username} has been added to the contest`);
							//msg.delete({timeout: 1000});
						}
					}
					addToContest();
					break;
				case 'contestants':
					let users = modelContest.getUsers();
					let i = 1;
					let temp = '';
					for (let user of users) {
						//send a message containing an anonymous name and image
						spamChannel.send({
							files: [user.submissionURL],
							content: `Contestant ${i}`
						}).then( 
						//set the message id for this user instance and react to the sent message
						(message) => {
							modelContest.setUserSubmit(user.id, message.id)
							message.react('⭐')
						}).catch(console.error)
						//iterate to count the next contestant
						i++
					}
					break;
				case 'submit':
					const id = attribute;
					modelContest.setUserSubmitURL(id, submission);
					break;
				case 'image':
					spamChannel.send({
						files: [attribute],
						content: msg.author.username
					}).then((message) => {message.react('⭐')}).catch(console.error)
					break;
				case 'message': 
					let msgID = attribute;
					spamChannel.messages.fetch(attribute).then(
						(message) => {
							console.log(message.reactions.resolve('⭐').count)
						})
					break;
				default:
					//spamChannel.send(`"${cmd}" is not a valid command`)
					break;
			}
		}
	} else 
	//check for a command and if the command is from a human
	if (origMsg[0] == "!" && !msg.author.bot) {
		switch (cmd) {
			case 'mimic':
				spamChannel.send(attribute).then((message) => {console.log(message.id)}).catch(console.error);
				break;
			default:
				if (msg.author.id != '184326588655992832') {
					spamChannel.send(`"${msg}" is not a valid command`)
				}
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