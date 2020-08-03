const Contestant = require('./contestant.js');

class Contest {
	constructor() {
		this.contestants = [];
		this.winner = "";
	}
	addContestant(name, id) {
		let contestant = new Contestant;
		contestant.name(name);
		contestant.id(id);
		this.contestants.push(contestant);
	}
	//get contestants() {
	//	return contestants;
	//}
}

module.exports = Contest