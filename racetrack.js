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

//

function check_maybe_maze(index) {
  // check to see if a maybe cell exists
  if (maybe_stats[index]) {
    walls[index] = true;
    return true;
  }
  return false;
}

// function add_maybe_walls(current_index) {
//   // add maybe maze
//   var maybe_maze_index;
//   for (var j=0; j< directions.length; j++) {
//     maybe_maze_index = current_index + directions[j];
//     if (walls[maybe_maze_index] || visited[maybe_maze_index]) {continue;}
//     else if (!check_maybe_maze(maybe_maze_index)) {
//       fill_maybe_maze(maybe_maze_index);
//       maybe_maze.push(maybe_maze_index);
//     }
//   }
// }

// //

function add_maybe_walls(current_index) {
  // add maybe maze
  var maybe_maze_index;
  for (var j=0; j< directions.length; j++) {
    maybe_maze_index = current_index + directions[j];
    if (walls[maybe_maze_index] || visited[maybe_maze_index]) continue;
    if (maybe_maze[maybe_maze_index]) {
      walls[maybe_maze_index] = true;
      fill_wall(maybe_maze_index);
    } else {
      fill_maybe_maze(maybe_maze_index);
      maybe_maze[maybe_maze_index] = true;
    }
  }
}

function prims_generate_graph(w, h) {

  var current_i = (Math.floor(h/2) * w) + Math.floor(w/2) - 1;
  // middle start point

  while (current_i) {
      fill_maze(current_i);
      visited[current_i] = true;
      add_maybe_walls(current_i);
      current_i = choose_next_index(current_i);
  }
  return visited;
}

function check_edges(index) {
  if (index < w || index % w === 0 || index > w*h ) {
    fill_wall(index);
    walls[index] = true;
    return true;
  }
  return false;
}

function choose_next_index(current_index){
  var legal_directions = [-w, +1, +w, -1];
  var next_index = null;
  var direction;
  var random_maybe_index = Math.floor(Math.random()*maybe_maze.length);
  // pop a random legal direction from the list of directions left on the node.
  // TODO: add switcher direction case to legal_directions
  while (legal_directions.length > 0) {
    direction = legal_directions.splice(Math.floor(Math.random()*legal_directions.length), 1)[0];
    if (!direction) {
      next_index = maybe_maze[random_maybe_index];
    } else next_index = current_index + direction;
    // edge cases and if the next chosen index is in an unmutable wall or visited ; continue
    if (check_edges(next_index) || walls[next_index] || visited[next_index]) {continue;}
    else return next_index;
  }
  // if we run out of legal directions get a random from maybe maze.
  random_maybe_index = Math.floor(Math.random()*maybe_maze.length);
  next_index = maybe_maze[random_maybe_index];
  // maybe_maze[random_maybe_index] = false
  return next_index;
}

prims_generate_graph(w, h);




// function choose_next_index(current_index){
//   var legal_directions = [-w, +1, +w, -1];
//   var next_index = null;
//   var direction;
//   // pop a random legal direction from the list of directions left on the node.
//   while (legal_directions.length > 0) {
//     direction = legal_directions.splice(Math.floor(Math.random()*legal_directions.length), 1)[0];
//     next_index = current_index + direction;
//     // edge cases and if its wall or visited, pass
//     if (check_edges(next_index) || walls[next_index] || visited[next_index]) {continue;}
//     else return next_index;
//   }
//   // pop the first random maybe maze
//   var maybe_index = maybe_maze.splice(0, 1)[0];
//   maybe_stats[maybe_index] = false;
//   return maybe_index;
// }

// prims_generate_graph(w, h);

