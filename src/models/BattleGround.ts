import { CellState } from "../typings";
import { DEFAULT_GRID_SIZE } from "../constants";

export class BattleGround {
    rows: number
    columns: number
    grid: CellState[][]

    constructor() {
        this.rows = DEFAULT_GRID_SIZE
        this.columns = DEFAULT_GRID_SIZE
        this.grid = []

        this.initGrid()
    }

    initGrid() {
        for (let i = 0; i < this.columns; i++) {
            const row = []
            for (let j = 0; j < this.rows; j++) {
                row.push(CellState.EMPTY)
            }
            this.grid.push(row)
        }
    }

    getLength() {
        return this.grid[0].length
    }

    getHeight() {
        return this.grid.length
    }

    setCellState(xPos: number, yPos: number, cellState: CellState) {
        this.grid[xPos][yPos] = cellState
    }
}