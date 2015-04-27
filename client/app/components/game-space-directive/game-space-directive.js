'use strict';

angular.module('codaApp')
  .directive('gameSpace', function ($window) {
    return {
      restrict: 'EA',
      scope: {
      },
      link: function (scope, element, attrs) {
        var svg = d3.select(element[0])
          .append('svg')
          .style('width', '100%');
        
        window.onresize = function () {
          scope.$apply();
        };

        scope.$watch(function () {
          return angular.element($window)[0].innerWidth;
        }, function () {
          scope.render();
        });

        scope.render = function () {
          svg.selectAll('*').remove();

          if (!scope.data) return;

          var width = d3.select(element[0]).node().offsetWidth;
          var height = window.innerHeight;

          var x = d3.scale.linear()
            .domain([0, 400])
            .range([0, width]);

          var y = d3.scale.linear()
            .domain([0, 600])
            .range([0, height]);

          svg.attr('height', height);

          var playerGroup = svg.selectAll('g')
              .data([{
                id: 'shdfjhskdjhflkshjdflkashdf',
                name: aaaa,
                cards: [{
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }]
              }, {
                id: 'asdxcdwert37864896cc281hdf',
                name: bbbb,
                cards: [{
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }]
              }, {
                id: '12hghgk3jhg4123jhg4kj312g4',
                name: cccc,
                cards: [{
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }]
              }, {
                id: '4123jg4kj2h13g4j231g4kj124',
                name: dddd,
                cards: [{
                  color: 'black',
                  number: 1
                }, {
                  color: 'white',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }, {
                  color: 'black',
                  number: 1
                }]
              }]);

          var nameGroup = playerGroup.select('g')
            .enter().append('g');

          var cardsGroup = playerGroup.select('g')
              .data(function (d) { return d.cards; })
            .enter().append('g');
        };
      }
    };
  });
