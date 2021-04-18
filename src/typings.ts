export enum GameMode {
    HOME,
    PLACEMENT,
    LIVE,
    OVER
}

export enum CellState {
    EMPTY,
    FLEET,
    HIT,
    MISS
}

export enum FleetDirection {
    HORIZONTAL,
    VERTICAL
}

export type FleetConfig = {
    direction: FleetDirection
    sizes: number[]
}