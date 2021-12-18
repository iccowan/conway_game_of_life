var numRows = 0;
var numCols = 0;
const ALIVE = "alive";
const DEAD = "dead";
var isRunning = false;
var cycle = 0;

function generateBoard(newNumRows, newNumCols) {
    const table = document.createElement("table");
    numRows = newNumRows;
    numCols = newNumCols;

    for (let i = 0; i < numRows; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let box = document.createElement("td");
            box.classList.add("box");
            box.classList.add(DEAD);
            box.setAttribute("onClick", "toggleBoxCoords(" + i + ", " + j + ")")
            box.id = i + " " + j;
            row.appendChild(box);
        };
        table.appendChild(row);
    };

    const gameOfLifeDiv = document.getElementById("game-of-life");
    gameOfLifeDiv.appendChild(table);

    updateCycleCounter();
}

function getNumNeighbors(row, col, thisCycleBoxes) {
    var numNeighbors = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            if (di == 0 && dj == 0)
                continue;

            let i = row + di;
            let j = col + dj;

            if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
                numNeighbors += thisCycleBoxes[i][j];
            }
        };
    };

    return numNeighbors;
}

function setBoxClass(box, numNeighbors) {
    if ((box.classList.contains(ALIVE) && (numNeighbors == 2 || numNeighbors == 3)) || (box.classList.contains(DEAD) && numNeighbors != 3))
        return;

    toggleBox(box);
}

function toggleBox(box) {
    const boxId = String(box.id);
    const coords = boxId.split(" ");
    const row = coords[0];
    const col = coords[1];
    toggleBoxCoords(row, col);
}

function toggleBoxCoords(row, col) {
    const box = document.getElementById(row + " " + col);

    if (box.classList.contains(ALIVE)) {
        box.classList.remove(ALIVE);
        box.classList.add(DEAD);
    } else {
        box.classList.remove(DEAD);
        box.classList.add(ALIVE);
    }
}

function checkRunning() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let box = document.getElementById(i + " " + j);
            if (box.classList.contains(ALIVE)) {
                isRunning = true;
                return;
            }
        };
    };

    isRunning = false;
}

function runLoop() {
    isRunning = true;
    run();
}

function pause() {
    isRunning = false;
}

function reset() {
    isRunning = false;
    cycle = 0;

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numCols; j++) {
            let box = document.getElementById(i + " " + j);
            box.classList.remove(ALIVE);
            box.classList.add(DEAD);
        };
    };

    updateCycleCounter();
}

function updateCycleCounter() {
    document.getElementById("cycle-count").innerText = cycle;
}

function run() {
    if (! isRunning)
        return;

    cycle++;
    updateCycleCounter();

    let thisCycleBoxes = new Array();

    for (let i = 0; i < numRows; i++) {
        thisCycleBoxes[i] = new Array(numCols).fill(0);
        for (let j = 0; j < numCols; j++) {
            let box = document.getElementById(i + " " + j);
            if (box != null)
                thisCycleBoxes[i][j] = box.classList.contains(ALIVE) ? 1 : 0;
        };
    };

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let box = document.getElementById(i + " " + j);
            let numNeighbors = getNumNeighbors(i, j, thisCycleBoxes);
            setBoxClass(box, numNeighbors);
        };
    };

    checkRunning();
    setTimeout(run, 50);
}

window.onload = function() {
    generateBoard(100, 100);
};

