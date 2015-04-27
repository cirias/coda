var uuid = require('node-uuid');

var Game = function (players) {
	this.id = uuid.v1();
  this.players = players;
	this.cards = generateShuffledCards();

	players = shuffle(players);
	//link(players);
	
	this.round = 1;
	this.phase = 'draw';
	this.turn = 0;
  this.activePlayerId = players[0].id;
};

Game.prototype.move = function() {
  if (this.round > 3) {
    this.phase = this.phase === 'draw' ? 'guess' : 'draw';
  }

  this.turn++;

  if (this.turn >= this.game.players.length) {
    this.turn = 0;
    this.round++;
  }
};

Game.prototype.draw = function(index) {
  if (!this.cards[index])
    return null;

  var card = this.cards[index];
  this.cards[index] = null;
  return card;
};

module.exports = Game;

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
