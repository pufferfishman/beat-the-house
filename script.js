let dealerHand;
let playerHand;
let deck;

setup();

console.log(shuffle(deck));

function setup() {
	dealerHand = [];
	playerHand = [];
	deck = [
		"2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac",
		"2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "th", "jh", "qh", "kh", "ah",
		"2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "ts", "js", "qs", "ks", "as",
		"2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "td", "jd", "qd", "kd", "ad"
	];
}

function deal() {
	shuffle(deck);
	playerHand.push(deck.shift());
	playerHand.push(deck.shift());
	dealerHand.push(deck.shift());
	dealerHand.push(deck.shift());
}

function renderCard(shown) {
	if (shown) {

	} else {

	}
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
