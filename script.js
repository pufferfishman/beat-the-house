let dealerHand;
let playerHand;
let playerCards = document.getElementById("playerCards");
let dealerCards = document.getElementById("dealerCards");
let dealB = document.getElementById("deal");
let hitB = document.getElementById("hit");
let standB = document.getElementById("stand");
let doubleB = document.getElementById("double");
let splitB = document.getElementById("split");
let playerActionDisplay = document.getElementById("playerAction");
let correctActionDisplay = document.getElementById("correctAction");
let totalsDisplay = document.getElementById("totals");
let outcomeDisplay = document.getElementById("outcome");
let playerTotal = document.getElementById("playerTotal");
let dealerTotal = document.getElementById("dealerTotal");
let dealerRevealed;
let deck;
let doubled;
let turn;

setup();

function setup() {
	turn = "player";
	doubled = false;
	dealerRevealed = false;
	dealerHand = [];
	playerHand = [];
	totalsDisplay.innerHTML = "";
	outcomeDisplay.innerHTML = "";
	playerTotal.innerHTML = "";
	dealerTotal.innerHTML = "";
	playerActionDisplay.innerHTML = "You:";
	correctActionDisplay.innerHTML = "Correct:";
	purgeCards();
	toggle(hitB, true);
	toggle(standB, true);
	toggle(doubleB, true);
	toggle(splitB, true);
	deck = [
		"2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac",
		"2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "th", "jh", "qh", "kh", "ah",
		"2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "ts", "js", "qs", "ks", "as",
		"2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "td", "jd", "qd", "kd", "ad"
	];
	deal();
}

function deal() {
	toggle(dealB, true);
	toggle(hitB, false);
	toggle(standB, false);
	toggle(doubleB, false);
	toggle(splitB, true);

	deck = shuffle(deck);

	let first = deck.shift();
	playerHand.push(first);

	let second = deck.shift();
	dealerHand.push(second);

	let third = deck.shift();
	playerHand.push(third);

	let fourth = deck.shift();
	dealerHand.push(fourth);

	// detect if player can split
	/*if (first.charAt(0) == third.charAt(0)) {
		toggle(splitB, false);
	}*/

	dealCard(first, "player");
	dealCard(second, "dealer");
	dealCard(third, "player");
	dealCard(fourth, "dealer", true);

	if (updateTotals()[1] == 21 && updateTotals()[3] !== 21) {
		blackjack("player");
	}
	if (updateTotals()[3] == 21 && updateTotals()[1] !== 21) {
		blackjack("dealer");
	}
}

function blackjack(person) {
	if (person == "dealer") {
		dealerCards.children[1].classList.remove("flipped");
		dealerRevealed = true;
	}
	endHand(person);
}

function endHand(blackjack) {
	displayOutcome(blackjack);
	toggle(dealB, false);
	toggle(hitB, true);
	toggle(standB, true);
	toggle(doubleB, true);
	toggle(splitB, true);
}

function dealerTurn() {
	toggle(dealB, true);
	toggle(hitB, true);
	toggle(standB, true);
	toggle(doubleB, true);
	toggle(splitB, true);

	dealerCards.children[1].classList.remove("flipped");
	dealerRevealed = true;
	updateTotals();

	function hitLoop() {
		// Always recalculate fresh
		let [, , dealerHard, dealerSoft] = updateTotals();
		let isSoft = dealerSoft !== dealerHard && dealerSoft <= 21;

		console.log("Dealer hard:", dealerHard, "soft:", dealerSoft, "isSoft:", isSoft);

		// Dealer hits on soft 17, and on any total < 17
		if ((isSoft && dealerSoft < 18) || (!isSoft && dealerHard < 17)) {
			console.log("Dealer hits");
			hitDealer();
			setTimeout(hitLoop, 1500); // Wait and re-evaluate
		} else {
			console.log("Dealer stands");
			if (dealerHard > 21) {
				bust("dealer");
			} else {
				standDealer();
			}
		}
	}

	setTimeout(hitLoop, 1000); // Start the loop
}


function hit() {
	checkAction("h");
	let card = deck.shift();

	playerHand.push(card);
	dealCard(card, "player");
	if (updateTotals()[0] > 21) {
		bust("player");
	}
}

function hitDealer() {
	let card = deck.shift();

	dealerHand.push(card);
	dealCard(card, "dealer");
	dealerRevealed = true;
	updateTotals();
}

function stand() {
	turn = "dealer";
	dealerRevealed = true;
	checkAction("s");
	dealerTurn();
}

function standDealer() {
	endHand();
	displayOutcome();
}

function double() {
	checkAction("d");
	let card = deck.shift();

	playerHand.push(card);
	dealCard(card, "player");
	turn = "dealer";

	if (updateTotals()[0] > 21) {
		bust();
	}
	dealerTurn();
}

function split() {
}

function bust(person) {
	endHand();
	displayOutcome(null, person);
}

function checkAction(action) {
	let playerHard = updateTotals()[0];
	let dealerHard = updateTotals()[2];
	let playerSoft = updateTotals()[1];
	let table;
	let firstCard = playerHand[0].charAt(0);
	let secondCard = playerHand[1].charAt(0);
	let dealerCard = dealerHand[0].charAt(0);
	let correct;

	if (playerHand.length == 2 && firstCard == secondCard) {
		table = "splits";
	} else if (playerHard !== playerSoft) {
		table = "soft";
	} else {
		table = "hard";
	}

	console.log(table);
	console.log(firstCard, secondCard, dealerCard);

	switch (table) {
		case ("hard"):
			if (playerHard >= 4 && playerHard <= 7) { // 4-7
				correct = "h";
			} else if (playerHard == 8) { // 8
				if (dealerCard == "5" || dealerCard == "6") {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (playerHard == 9) { // 9
				if (/^[2-6]/.test(dealerCard)) {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (playerHard == 10) { // 10
				if (/^[2-9]/.test(dealerCard)) {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (playerHard == 11) { // 11
				correct = "d";
			} else if (playerHard == 12) { // 12
				if (/^[4-6]/.test(dealerCard)) {
					correct = "s";
				} else {
					correct = "h";
				}
			} else if (playerHard >= 13 && playerHard <= 16) { // 13-16
				if (/^[2-6]$/.test(dealerCard)) {
					correct = "s";
				} else {
					correct = "h";
				}

			} else if (playerHard >= 17) { // 17-21
				correct = "s";
			}
			break;

		case ("soft"):
			if (playerSoft <= 16) { // 13-16
				if (/^[4-6]/.test(dealerCard)) {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (playerSoft == 17) { // 17
				if (/^[2-6]/.test(dealerCard)) {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (playerSoft == 18) { // 18
				if (/^[3-6]/.test(dealerCard)) {
					correct = "d";
				} else if (/^[278]/.test(dealerCard)) {
					correct = "s";
				} else {
					correct = "h";
				}
			} else if (playerSoft == 19) { // 19
				if (dealerCard == "6") {
					correct = "d";
				} else {
					correct = "s";
				}
			} else if (playerSoft >= 20) { // 20
				correct = "s";
			}

			break;

		case ("splits"):
			if (firstCard == 2) { // 2,2
				if (/^[2-7]/.test(dealerCard)) {
					correct = "p";
				} else {
					correct = "h";
				}
			} else if (firstCard == 3) { // 3,3
				if (/^[2-8]/.test(dealerCard)) {
					correct = "p";
				} else {
					correct = "h";
				}
			} else if (firstCard == 4) { // 4,4
				if (/^[4-6]/.test(dealerCard)) {
					correct = "p";
				} else {
					correct = "h";
				}
			} else if (firstCard == 5) { // 5,5
				if (/^[2-9]/.test(dealerCard)) {
					correct = "d";
				} else {
					correct = "h";
				}
			} else if (firstCard == 6) { // 6,6
				if (/^[2-7]/.test(dealerCard)) {
					correct = "p";
				} else {
					correct = "h";
				}
			} else if (firstCard == 7) { // 7,7
				if (/^[2-8]/.test(dealerCard)) {
					correct = "p";
				} else if (/^[9a]/.test(dealerCard)) {
					correct = "h";
				} else {
					correct = "s";
				}
			} else if (firstCard == 8 || firstCard == "a") { // 8,8

			}

			break;
	}

	console.log(action, correct)

	if (action == correct) {
		playerActionDisplay.innerHTML = "You: <br><span class='green'>" + actionToFull(action) + "</span>";
		correctActionDisplay.innerHTML = "Correct: <br><span class='green'>" + actionToFull(correct) + "</span>";
		return [true, action, correct];
	} else {
		playerActionDisplay.innerHTML = "You: <br><span class='red'>" + actionToFull(action) + "</span>";
		correctActionDisplay.innerHTML = "Correct: <br><span class='green'>" + actionToFull(correct) + "</span>";
		return [false, action, correct];
	}
}

function actionToFull(action) {
	if (action == "h") {
		return "Hit";
	}

	if (action == "s") {
		return "Stand";
	}

	if (action == "d") {
		return "Double";
	}

	if (action == "p") {
		return "Split";
	}
}

/*function updateTotals(blackjack) {
	if (blackjack == "dealer") {
		document.getElementById("dealerTotal").innerHTML = "Dealer: <br>21";
		return;
	} else if (blackjack == "player") {
		document.getElementById("playerTotal").innerHTML = "Player: <br>21";
		return;
	}

	let playerTotal = 0;
	let playerAces = 0;
	let dealerTotal = 0;
	let dealerAces = 0;

	for (let i = 0; i < playerHand.length; i++) {
		const rank = playerHand[i].charAt(0).toLowerCase();

		if (/\d/.test(rank)) {
			playerTotal += parseInt(rank);
		} else if (/^[tjqk]$/.test(rank)) {
			playerTotal += 10;
		} else if (rank === "a") {
			playerAces += 1;
		}
	}

	// calculate hard and soft totals
	let playerSoftTotal = playerTotal;
	if (playerAces > 0) {
		playerSoftTotal += 11 + (playerAces - 1); // one ace as 11, others as 1
		playerTotal += playerAces;         // all aces as 1
	} else {
		playerSoftTotal = playerTotal;
	}

	console.log(playerSoftTotal);
	console.log(playerTotal);

	// decide what to show
	let playerDisplay = "";
	if (playerAces > 0 && playerSoftTotal <= 21 && playerSoftTotal !== playerTotal) {
		playerDisplay = `${playerTotal}/${playerSoftTotal}`;
	} else {
		playerDisplay = `${playerTotal}`;
	}

	document.getElementById("playerTotal").innerHTML = "Player: <br>" + playerDisplay;

	for (let i = 0; i < dealerHand.length; i++) {
		const rank = dealerHand[i].charAt(0).toLowerCase();

		if (/\d/.test(rank)) {
			dealerTotal += parseInt(rank);
		} else if (/^[tjqk]$/.test(rank)) {
			dealerTotal += 10;
		} else if (rank === "a") {
			dealerAces += 1;
		}
	}

	// calculate hard and soft totals
	let dealerSoftTotal = dealerTotal;
	if (dealerAces > 0) {
		dealerSoftTotal += 11 + (dealerAces - 1); // one ace as 11, others as 1
		dealerTotal += dealerAces;         // all aces as 1
	} else {
		dealerSoftTotal = dealerTotal;
	}

	console.log(dealerSoftTotal);
	console.log(dealerTotal);

	// decide what to show
	let dealerDisplay = "";
	if (dealerAces > 0 && dealerSoftTotal <= 21 && dealerSoftTotal !== dealerTotal) {
		dealerDisplay = `${dealerTotal}/${dealerSoftTotal}`;
	} else {
		dealerDisplay = `${dealerTotal}`;
	}

	if (dealerRevealed) {
		document.getElementById("dealerTotal").innerHTML = "Dealer: <br>" + dealerDisplay;
	}
	return ([playerTotal, playerSoftTotal, dealerTotal, dealerSoftTotal]);
}*/
function updateTotals() {
	let playerTotal = 0;
	let playerAces = 0;
	let dealerTotal = 0;
	let dealerAces = 0;

	for (let i = 0; i < playerHand.length; i++) {
		const rank = playerHand[i].charAt(0).toLowerCase();
		if (/\d/.test(rank)) {
			playerTotal += parseInt(rank);
		} else if (/^[tjqk]$/.test(rank)) {
			playerTotal += 10;
		} else if (rank === "a") {
			playerAces += 1;
		}
	}

	let playerSoftTotal = playerTotal;
	if (playerAces > 0) {
		playerSoftTotal += 11 + (playerAces - 1);
		playerTotal += playerAces;
	}

	const isPlayerBlackjack = playerHand.length === 2 &&
		((playerHand[0].charAt(0) === "a" && "tjqk".includes(playerHand[1].charAt(0))) ||
		 (playerHand[1].charAt(0) === "a" && "tjqk".includes(playerHand[0].charAt(0))));

	if (isPlayerBlackjack) {
		document.getElementById("playerTotal").innerHTML = "Player: <br>21";
	} else {
		let playerDisplay = "";
		if (playerAces > 0 && playerSoftTotal <= 21 && playerSoftTotal !== playerTotal) {
			playerDisplay = `${playerTotal}/${playerSoftTotal}`;
		} else {
			playerDisplay = `${playerTotal}`;
		}
		document.getElementById("playerTotal").innerHTML = "Player: <br>" + playerDisplay;
	}

	for (let i = 0; i < dealerHand.length; i++) {
		const rank = dealerHand[i].charAt(0).toLowerCase();
		if (/\d/.test(rank)) {
			dealerTotal += parseInt(rank);
		} else if (/^[tjqk]$/.test(rank)) {
			dealerTotal += 10;
		} else if (rank === "a") {
			dealerAces += 1;
		}
	}

	let dealerSoftTotal = dealerTotal;
	if (dealerAces > 0) {
		dealerSoftTotal += 11 + (dealerAces - 1);
		dealerTotal += dealerAces;
	}

	const isDealerBlackjack = dealerHand.length === 2 &&
		((dealerHand[0].charAt(0) === "a" && "tjqk".includes(dealerHand[1].charAt(0))) ||
		 (dealerHand[1].charAt(0) === "a" && "tjqk".includes(dealerHand[0].charAt(0))));

	if (dealerRevealed) {
		if (isDealerBlackjack) {
			document.getElementById("dealerTotal").innerHTML = "Dealer: <br>21";
		} else {
			let dealerDisplay = "";
			if (dealerAces > 0 && dealerSoftTotal <= 21 && dealerSoftTotal !== dealerTotal) {
				dealerDisplay = `${dealerTotal}/${dealerSoftTotal}`;
			} else {
				dealerDisplay = `${dealerTotal}`;
			}
			document.getElementById("dealerTotal").innerHTML = "Dealer: <br>" + dealerDisplay;
		}
	}

	return [playerTotal, playerSoftTotal, dealerTotal, dealerSoftTotal];
}


function purgeCards() {
	while (dealerCards.firstChild) {
		dealerCards.removeChild(dealerCards.firstChild);
	}

	while (playerCards.firstChild) {
		playerCards.removeChild(playerCards.firstChild);
	}
}

function flipCard() {

}

function shuffle(cards) {
	for (let k = 0; k < 5; k++) {
		for (let i = cards.length - 1; i > 0; i--) {

			const j = Math.floor(Math.random() * (i + 1));

			const temp = cards[i];
			cards[i] = cards[j];
			cards[j] = temp;
		}
	}
	return (cards);
}

function dealCard(card, person, flipped) {
	let deck = document.getElementById("deck");
	let newCard = document.createElement("div");
	newCard.innerHTML = `<div class="card-inner">
									<div class="card-front">
										<div class="rank r`+ card.charAt(0) + `">` + card.charAt(0) + `</div>
										<div class="suit `+ card.charAt(1) + `"></div>
									</div>
									<div class="card-back"></div>
								</div>`;
	newCard.classList = "card";

	if (flipped) {
		newCard.classList = "card flipped";
	}

	if (person == "player") {
		playerCards.appendChild(newCard);
	} else if (person == "dealer") {
		dealerCards.appendChild(newCard);
	}
}

function toggle(button, disabled) {
	console.log("disable");
	if (disabled) {
		console.log("successfully disabled");
		button.disabled = true;
	} else {
		button.disabled = false;
	}
}

function displayOutcome(blackjack, busted) {
	let [playerHard, playerSoft, dealerHard, dealerSoft] = updateTotals();

	let bestPlayer = (playerSoft <= 21) ? playerSoft : playerHard;
	let bestDealer = (dealerSoft <= 21) ? dealerSoft : dealerHard;

	let totals;
	let outcome;

	if (blackjack == "player") {
		totals = "Blackjack!"
		outcome = "Player wins!";
		updateTotals("player");
	} else if (blackjack == "dealer") {
		totals = "Blackjack!"
		outcome = "Dealer wins!";
		updateTotals("dealer");
	} else if (busted == "player") {
		totals = "Player busts!"
		outcome = "Dealer wins!";
	} else if (busted == "dealer") {
		totals = "Dealer busts!"
		outcome = "Player wins!";
	} else if (bestPlayer > bestDealer) {
		totals = bestPlayer + " against " + bestDealer;
		outcome = "Player wins!";
	} else if (bestPlayer < bestDealer) {
		totals = bestPlayer + " against " + bestDealer;
		outcome = "Dealer wins!";
	} else {
		totals = bestPlayer + " against " + bestDealer;
		outcome = "Push!";
	}

	totalsDisplay.innerHTML = totals;
	outcomeDisplay.innerHTML = outcome;
}
