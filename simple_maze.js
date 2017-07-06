"use strict";

var w = 200;
var h = 200;

var pixel_width = w * cell_size*100;
var pixel_height = w * cell_size*100;

var directions = [-w, +1, +w, -1];

var cell_size = 10;

var canvas = d3.select("body").append("canvas")
  .attr("width", w*cell_size +10)
  .attr("height", h*cell_size +10);
var context = canvas.node().getContext("2d");

var walls = Array(w*h);
var visited = Array(w*h);

var maybe_maze = {
  'stack': [],
};


function fill_maze(i) {
  context.fillStyle = "#fff";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_wall(i) {
  context.fillStyle = "#000";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function fill_maybe_maze(i) {
  context.fillStyle = "#00f";
  var x_0 = (i%w) * cell_size;
  var y_0 = Math.floor(i/h) * cell_size;
  context.fillRect(x_0, y_0, cell_size, cell_size);
}

function add_maybe_walls(current_index) {
  // add maybe maze
  var i;
  for (var j=0; j < directions.length; j++) {
    i = current_index + directions[j];
    if (check_edges(i) || walls[i] || visited[i]) {continue;}
    else if (maybe_maze[i]) {
      walls[i] = true;
      delete maybe_maze[i];
      // should be already popped
      fill_wall(i);
    } else {
      fill_maybe_maze(i);
      maybe_maze.stack.push(i);
      maybe_maze[i] = true;
    }
  }
}

function prims_generate_graph(w, h) {

  var current_i = (Math.floor(h/2) * w) + Math.floor(w/2) - 1;
  maybe_maze.stack.push(current_i);
  maybe_maze[current_i] = true;
  // middle start point
  while (maybe_maze.stack.length > 0) {
      delete maybe_maze[current_i];
      fill_maze(current_i);
      visited[current_i] = true;
      add_maybe_walls(current_i);
      current_i = choose_next_index(current_i);
  }
  return visited;
}

function check_edges(index) {
  if (index < w || index % w === 0 || index > w*h || (index+1)%w === 0) {
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
  // pop a random legal direction from the list of directions left on the node.
  // TODO: add switcher direction case to legal_directions
  while (legal_directions.length > 0) {
    direction = legal_directions.splice(Math.floor(Math.random() * legal_directions.length), 1)[0];
    next_index = current_index + direction;
    // edge cases and if the next chosen index is in an unmutable wall or visited ; continue
    if (check_edges(next_index) || walls[next_index] || visited[next_index]) {continue;}
    else return next_index;
  }
  // if we run out of legal directions get a random legal index from maybe_maze
  do {
    next_index = maybe_maze.stack.pop();
    delete maybe_maze[next_index];
  } while (check_edges(next_index) || walls[next_index] || visited[next_index]);
  return next_index;
}

prims_generate_graph(w, h);


