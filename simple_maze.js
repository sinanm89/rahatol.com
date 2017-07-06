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

var pixel_width = w * cell_size;
var pixel_width = w * cell_size;

var N = -w,
  E = -1,
  S = +w,
  W = +1;

var directions = [-w, +1, +w, -1];

var cell_size = 10;

var canvas = d3.select("body").append("canvas")
  .attr("width", w*cell_size)
  .attr("height", h*cell_size);
var context = canvas.node().getContext("2d");

var walls = Array(w*h);
var maybe_maze = Array(w*h);
var visited = Array(w*h);
var remaining = Array(w*h);
var previous = [];

function fill_maze(i) {
  // var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillStyle = "#fff";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_wall(i) {
  // var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillStyle = "#f00";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_maybe_maze(i) {
  // var x = i % cellWidth, y = i / cellWidth | 0;
  context.fillStyle = "#00f";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}



function prims_generate_graph(w, h) {

  var current_i = (Math.floor(h/2) * w) + Math.floor(w/2) - 1;
  // middle start point

  while (current_i) {
      fill_maze(current_i);
      var node = {
          parent: previous[previous.length - 1],
          index: current_i
      };
      visited[node.index] = node;
      // previous.push(current_i);
      current_i = choose_next_index(current_i, node);
      // while we dont have a cell to go to, select random wall
      while (current_i === null){
          current_i = maybe_maze.splice(Math.floor(Math.random()*maybe_maze.length), 1)[0];
      }
  }
  return visited;
}

function choose_next_index(current_index){
  var legal_directions = [-w, +1, +w, -1];
  // legal_directions.push(false);
  var next_index;
  var maybe_maze_index;
  var maybe_direction = direction;
  var direction;
  while(legal_directions.length > 0) {
      // pop a random legal direction from the list of directions left on the node.
      // TODO: add switcher direction case to legal_directions
      direction = legal_directions.splice(Math.floor(Math.random()*legal_directions.length), 1)[0];
      maybe_direction = direction;
      if (!direction) break;
      next_index = current_index + direction;
      // edge cases and if the next chosen index is in an unmutable wall or visited ; continue
      if (next_index < w || next_index % w === 0 || next_index > w*h ) {
          fill_wall(next_index);
          walls[next_index] = true;
          continue;
      } else if (walls[next_index] || visited[next_index]) continue;

      // add maybe maze
      while (maybe_direction) {
          maybe_direction = legal_directions.pop();
          maybe_maze_index = current_index + maybe_direction;
          if (walls[maybe_maze_index] || visited[maybe_maze_index]) continue;
          maybe_maze[maybe_maze_index] = maybe_maze_index;
          fill_maybe_maze(maybe_maze_index);
      }
      return next_index;
    }
  // if we run out of legal directions get a random from maybe maze.
  // maybe_maze_index = maybe_maze.splice(Math.floor(Math.random()*maybe_maze.length), 1)[0];
  return null;
}

prims_generate_graph(w, h);
