const Contestant = require('./contestant.js');

class Contest {
	constructor() {
		this.contestants = [];
		this.winner = [];
	}
	addContestant(name, id) {
		let contestant = new Contestant;
		contestant.setName(name);
		contestant.setId(id);
		this.contestants.push(contestant);
		console.log(contestant);
	}
	getWinner() {
		let highestVotes = this.getHighestVote();
		for (let contestant of this.contestants) {
			if (contestant.vote == highestVotes) {
				this.winner.push(contestant.name())
			}
		}
		return this.winner
	}
	getHighestVote() {
		let votes = [];
		for (let contestant of this.contestants) {
			votes.push(contestant.vote())
		}
		return Math.max(votes);
	}
	enterVote(count, messageId) {
		for (let contestant of this.contestants) {
			if (contestant.submission == messageId) {
				contestant.setVote(count);
			}
		}
	}
	setUserSubmit(userId, messageId) {
		let contestant = this.getUser(userId);
		contestant.setSubmission(messageId);
	}
	getUser(userId) {
		for (let contestant of this.contestants) {
			if (contestant.id == userId) {
				return contestant
			}
		}
	}
}

module.exports = Contest