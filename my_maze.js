"use strict";
// d3.timer(_ticker);
// var w = window.innerWidth;
// var h = window.innerHeight;


// context.fillRect(100, 100, 220,220);
// cell_spacing = 4

// cellWidth = Math.floor((w - cell_spacing)/(cell_size+cell_spacing))
// cellHeight = Math.floor((h - cell_spacing)/(cell_size+cell_spacing))

var w = 100;
var h = 100;

// var _blocks = 10000

var N = 0,
    E = 1,
    S = 2,
    W = 3;

var directions = [-w, +1, +w, -1];

var cell_size = 10;

var canvas = d3.select("body").append("canvas")
    .attr("width", w*cell_size)
    .attr("height", h*cell_size)
    .attr("id", "myCanvas");
var context = canvas.node().getContext("2d");

var walls = Array(w*h);
var visited = Array(w*h);
var previous = [];

function fill_maze(evt) {
    // var rect = canvas.getBoundingClientRect();

    // var x = i % cellWidth, y = i / cellWidth | 0;
    context.fillStyle = "#fff";
    // var x_0 = (i%w) * cell_size;
    // var y_0 = Math.floor(i/h) * cell_size;
    // context.fillRect(x_0, y_0, cell_size, cell_size);
    console.log('evt');
    // console.log(rect.top);
    // console.log(rect.left);
    // console.log('client');
    console.log(Object.keys(evt));
    console.log(evt.clientX);
    console.log('-------------');
    // return {
    //   x: evt.clientX - rect.left,
    //   y: evt.clientY - rect.top
    // };
  }
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

canvas.addEventListener('click', function(evt) {
    fill_maze(canvas, evt);
}, false);
// canvas.addEventListener('mousemove', function(evt) {
// var mousePos = getMousePos(canvas, evt);
// var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
// writeMessage(canvas, message);
// }, false);
