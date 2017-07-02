// d3.timer(_ticker);
// var w = window.innerWidth;
// var h = window.innerHeight;
var w = 200;
var h = 200;

var canvas = d3.select("body").append("canvas")
    .attr("width", w)
    .attr("height", h);
var context = canvas.node().getContext("2d");

cell_size = 4
// cell_spacing = 4

// cellWidth = Math.floor((w - cell_spacing)/(cell_size+cell_spacing))
// cellHeight = Math.floor((h - cell_spacing)/(cell_size+cell_spacing))

context.fillStyle = "#fff";
function create_maze(w, h) {
    graph = prims_generate_graph(w, h);
    return graph
}

maze = create_maze(w, h)

function Cell(index) {
    this.i = index;
    this.walls = [true, true, true, true];

    this.check_neighbors = function() {
//      0  1  2  3  4   5x3
//     +--+--+--+--+--+
//   0  0 |         4 |
//     +  +  +--+--+  +
//   1 |5 |6    |  |9 |
//     +  +--+  +  +--+
//   2 |10          14|
//     +--+--+--+--+  +
// i=2

        // horizontal bias
        for (i=0; i < this.walls.length; i++) {
            // top edge detect
            if (i === 0 && this.i < w) continue;
            // right edge detect
            if (i === 1 && this.i+1 % w == 0) continue;
            // bottom edge detect
            if (i === 2 && this.i+w > w*h) continue;
            // left edge detect
            if (i === 3 && this.i % w == 0) continue;
            // if (!this.walls) return i;
        }
        return i;
    }
    return this;
}

function prims_generate_graph(w, h) {
    // var cells = Array(w*h);
    var visited = Array();
    // var previous = new Array(cells.length);
    cell = Cells
    direction = Math.floor(Math.random()*4);

    for (var i=0; i < cells.length; i++) {
        current = Cells(i)
        // direction = current.check_neighbors();
        // select a legal direction
        fill_cell(i);
        if (direction) {
            console.log(direction);
            visited.push(current);
            continue;
        }
        visited.pop();

    }
}
function fill_cell(i) {
    // var x = i % cellWidth, y = i / cellWidth | 0;
    context.fillRect(
        // horiz
        // cell_size
        (i%w+1)*(cell_size),
        // vert
        (i%w)*(cell_size),
        // x * cellSize + (x + 1) * cellSpacing, y * cellSize + (y + 1) * cellSpacing,
        // i%w)*(cell_spacing+cell_size)
        cell_size, cell_size
    );
}

// function _ticker(elapsed) {
//     // timer_elapsed = _elapsed;
// }
