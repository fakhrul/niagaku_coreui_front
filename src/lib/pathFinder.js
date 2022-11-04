

class PathFinder {
    constructor() {

    }

    AStarPathFinder(grid, start, end, allowDiagonals) {
        this.grid = grid;
        this.lastCheckedNode = start;
        this.openSet = [];
        // openSet starts with beginning node only
        this.openSet.push(start);
        this.closedSet = [];
        this.start = start;
        this.end = end;
        this.allowDiagonals = allowDiagonals;


        this.heuristic = function (a, b) {
            var d;

            d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
            return d;
        }

        // Function to delete element from the array
        this.removeFromArray = function (arr, elt) {
            // Could use indexOf here instead to be more efficient
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] == elt) {
                    arr.splice(i, 1);
                }
            }
        }

        var LURDMoves = [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1]
        ];
        var DiagonalMoves = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
        ];
        //references to the LURDMoves entries that would block the diagonal
        //if they are both walls and canPassThroughCorners = false
        var DiagonalBlockers = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0]
        ];

        this.getNode = function (i, j) {
            if (i < 0 || i >= this.grid.length ||
                j < 0 || j >= this.grid[0].length) {
                return null;
            }
            return this.grid[i][j];
        }

        this.getNeighbors = function (spot) {
            this.neighbors = [];
            this.neighboringWalls = [];

            //Add Left/Up/Right/Down Moves
            for (var i = 0; i < 4; i++) {
                var node = this.getNode(spot.i + LURDMoves[i][0], spot.j + LURDMoves[i][1]);
                if (node != null) {
                    if (!node.wall) {
                        this.neighbors.push(node);
                    } else {
                        this.neighboringWalls.push(node);
                    }
                }
            }

            //Add Diagonals

            for (var i = 0; i < 4; i++) {
                var gridX = spot.i + DiagonalMoves[i][0];
                var gridY = spot.j + DiagonalMoves[i][1];

                var node = this.getNode(gridX, gridY);

                if (node != null) {
                    if (allowDiagonals && !node.wall) {
                        if (!canPassThroughCorners) {
                            //Check if blocked by surrounding walls
                            var border1 = DiagonalBlockers[i][0];
                            var border2 = DiagonalBlockers[i][1];
                            //no need to protect against OOB as diagonal move
                            //check ensures that blocker refs must be valid
                            var blocker1 = this.grid[spot.i + LURDMoves[border1][0]]
                            [spot.j + LURDMoves[border1][1]];
                            var blocker2 = this.grid[spot.i + LURDMoves[border2][0]]
                            [spot.j + LURDMoves[border2][1]];


                            if (!blocker1.wall || !blocker2.wall) {
                                //one or both are open so we can move past
                                this.neighbors.push(node);
                            }
                        } else {
                            this.neighbors.push(node);
                        }
                    }
                    if (node.wall) {
                        this.neighboringWalls.push(node);
                    }
                }
            }
            return this.neighbors;

        }
        this.getLastCheckedNode = function () {
            return this.lastCheckedNode;
        }
        this.step = function () {
            if (this.openSet.length > 0) {

                // Best next option
                var winner = 0;
                for (var i = 1; i < this.openSet.length; i++) {
                    if (this.openSet[i].f < this.openSet[winner].f) {
                        winner = i;
                    }
                    //if we have a tie according to the standard heuristic
                    if (this.openSet[i].f == this.openSet[winner].f) {
                        //Prefer to explore options with longer known paths (closer to goal)
                        if (this.openSet[i].g > this.openSet[winner].g) {
                            winner = i;
                        }
                        //if we're using Manhattan distances then also break ties
                        //of the known distance measure by using the visual heuristic.
                        //This ensures that the search concentrates on routes that look
                        //more direct. This makes no difference to the actual path distance
                        //but improves the look for things like games or more closely
                        //approximates the real shortest path if using grid sampled data for
                        //planning natural paths.
                        if (!this.allowDiagonals) {
                            if (this.openSet[i].g == this.openSet[winner].g &&
                                this.openSet[i].vh < this.openSet[winner].vh) {
                                winner = i;
                            }
                        }
                    }
                }
                var current = this.openSet[winner];
                this.lastCheckedNode = current;

                // Did I finish?
                if (current === this.end) {
                    console.log("DONE!");
                    return 1;
                }

                // Best option moves from openSet to closedSet
                this.removeFromArray(this.openSet, current);
                this.closedSet.push(current);

                // Check all the neighbors
                // var neighbors = current.getNeighbors();
                var neighbors = this.getNeighbors(current);

                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];

                    // Valid next spot?
                    if (!this.closedSet.includes(neighbor)) {
                        // Is this a better path than before?
                        var tempG = current.g + this.heuristic(neighbor, current);

                        // Is this a better path than before?
                        if (!this.openSet.includes(neighbor)) {
                            this.openSet.push(neighbor);
                        } else if (tempG >= neighbor.g) {
                            // No, it's not a better path
                            continue;
                        }

                        neighbor.g = tempG;
                        neighbor.h = this.heuristic(neighbor, end);

                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }

                }
                return 0;
                // Uh oh, no solution
            } else {
                console.log('no solution');
                return -1;
            }
        }
    }
}


export default PathFinder;

