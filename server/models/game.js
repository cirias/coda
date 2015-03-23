var uuid = require('node-uuid');

var Game = function (players) {
	this.id = uuid.v1();
    this.players = players;
	this.cards = generateShuffledCards();

	players = shuffle(players);
	link(players);
	
	this.round = 1;
	this.phase = 'draw';
	this.turn = 0;
  this.activePlayer = players[0].id;
};

Game.prototype.publish = function() {
  return {
    cards: this.cards.map(function (card) {
             return card ? { color: card.color } : null;
           }),
    round: this.round,
    phase: this.phase,
    turn: this.turn
  };
};

Game.prototype.move = function() {
  this.phase = this.phase === 'draw' ? 'guess' : 'draw';
  this.turn++;
  if (this.turn % this.game.players.length === 0) {
    this.turn = 0;
    this.round++;
  }
};

Game.prototype.draw = function(player, index) {
  player.newCard = this.cards[index];
  this.cards[index] = null;
  return player.newCard;
};

function generateShuffledCards (color) {
  var colors = ['black', 'white'];
  var cards = colors.reduce(function (cards, color) {
    for (var i = 0; i < 12; i++) {
      cards.push({
        number: i,
        color: color
      });
    }
    cards.push({
      number: '-',
      color: color
    });
    return cards;
  }, []);

  return shuffle(cards);
}

function shuffle (o) {
  // for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i)) {
    x = o[--i];
    o[i] = o[j];
    o[j] = x;
  }
  return o;
}

function link (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].next     = array[i + 1 === array.length ? 0 : i + 1].id;
    array[i].previous = array[i === 0 ? array.length - 1 : i - 1].id;
  }
}
