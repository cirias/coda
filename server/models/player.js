var uuid    = require('node-uuid');
var Moniker = require('moniker');
var Room    = require('./room');
var names   = Moniker.generator(
    [Moniker.adjective, Moniker.noun],
    {glue: ' '}
  );

// All players store at here
var players = {};

var Player = function () {
	this.id = uuid.v1();
	this.name = names.choose();
	this.keepalive();
	players[this.id] = this;
};

Player.get = function (id) {
	var player = players[id];
	if (player) {
		return player.keepalive();
	} else {
		return;
	}
};

// Player.prototype.toString = function() {
// 	return {
// 		id   : this.id,
// 		name : this.name
// 	};
// };

Player.prototype.destroy = function() {
	this.leave();
	delete players[this.id];
};

Player.prototype.keepalive = function() {
	var that = this;
	if (this.life) clearTimeout(this.life);
	this.life = setTimeout(function () {
		that.destroy();
	}, 86400000);
	return this;
};

Player.prototype.join = function (room) {
	if (this.room) throw new Error('player ' + this.id + ' already in a room');
	if (!room) throw new Error('room is not defined');

	room.add(this);
	this.room = room;
};

Player.prototype.leave = function () {
	if (!this.room) return;

	var room = this.room;
	delete this.room;
	return room.remove(this);
};

Player.prototype.createRoom = function () {
	this.join(new Room());
};

Player.prototype.toggleReady = function() {
	if (!this.room) throw new Error('player ' + this.id + ' not in a room');

	this.ready = !this.ready;
	if (this.room.allReady()) {
		return this.room.startGame();
	}
};

Player.prototype.draw = function(index) {
	if (!this.game.cards[index]) return;

  this.newCard = this.game.draw(index);

	return this.newCard;
};

Player.prototype.place = function(index) {
	this.cards = this.cards || [];

	if (index > this.cards.length || index < 0) return;

	this.cards.splice(index, 0, this.newCard);
  this.game.move();
	delete this.newCard;

  return {
    public: {
      remainingCards: this.game.cards.map(function (card) {
        return card ? { color: card.color } : null;
      }),
      activePlayer: {
        id        : this.id,
        cardIndex : index,
        cards     : this.cards.map(function (card) {
          return { color: card.color };
        })
      }
    },
    private: {
      cards: this.cards
    }
  }
};

Player.prototype.guess = function(playerId, index, number) {
  var player = Player.get(playerId);

  var right = player.check(index, number);
  this.game.move();
  
  return {
    guess: {
      playerId  : playerId,
      cardIndex : index,
      number    : number
    },
    expose: {
      playerId  : right ? playerId : this.id,
      cardIndex : right ? index : this.newCardIndex,
      number    : right ? number : this.cards[this.newCardIndex].number
    }
  };
};

Player.prototype.check = function(index, number) {
  if (this.cards[index].number == number) {
    this.cards[index].exposed = true;
    this.isAlive()

    return true;
  } else {
    return false;
  }
};

Player.prototype.isAlive = function () {
  return this.cards.reduce(function (alive, card) {
    return alive || !card.exposed;
  }, false);
};

module.exports = Player;
