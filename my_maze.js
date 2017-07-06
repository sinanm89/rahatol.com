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
    .attr("height", h*cell_size);
var context = canvas.node().getContext("2d");

var walls = Array(w*h);
var visited = Array(w*h);
var previous = [];

function fill_maze(i) {
    // var x = i % cellWidth, y = i / cellWidth | 0;
    var x_0 = (i%w) * cell_size;
    var y_0 = Math.floor(i/h) * cell_size;
    context.fillRect(x_0, y_0, cell_size, cell_size);
}

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

function prims_generate_graph(w, h) {

    var current = (Math.floor(h/2) * w) + Math.floor(w/2);
    while (current) {
        fill_maze(current);
        visited[current] = true;
        previous.push(current);
        current = choose_direction(current);
    }

    return visited;
}

function choose_direction(i){
    var legal_directions = [N, E, S, W];
    var next_index;
    var direction = legal_directions.splice(Math.floor(Math.random()*legal_directions.length), 1);

    while(legal_directions.length > 0) {
        // direction = Math.floor(Math.random()*directions.length);
        next_index = i + directions[direction];
        direction = legal_directions.splice(Math.floor(Math.random()*legal_directions.length), 1)[0];
        if (!direction) {
            console.log('for i ' + i +' no directions left');
            break;
        }
        // N edge
        else if (visited[next_index] || walls[next_index]) {
            console.log(visited[next_index]);
            console.log(walls[next_index]);
            continue;}
        else if (next_index < w || next_index % w === 0 || next_index > w*h) continue;
        // not in visited or not a permanent wall
        else {
            for(var k=0; k < directions.length; k++){
                var wall_index = i + directions[k];
                if (wall_index === next_index || wall_index === i || visited[wall_index] || walls[wall_index]) continue;
                walls[wall_index] = true;
                fill_wall(wall_index);

            return next_index;
            }
        }
    }
    if (previous.length > 0) return choose_direction(previous.pop());
    else return false;
}

prims_generate_graph(w, h);
