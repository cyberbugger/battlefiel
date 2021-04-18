import { GameMode } from "../typings";
import { Player } from "./Player";
import { BattleGround } from "./BattleGround";
import { Fleet } from "./Fleet";
import { makeFleets } from "../controllers/fleetHelpers";

export type GameEntity = {
    player: Player
    batteground: BattleGround
    fleets: Fleet[]
}

export class Game {
    mode: GameMode;
    entities: GameEntity[]
    turn: number

    constructor() {
        this.mode = GameMode.HOME
        this.turn = 0
        this.entities = [
            {player: new Player(1), batteground: new BattleGround(), fleets: makeFleets()},
            {player: new Player(2), batteground: new BattleGround(), fleets: makeFleets()}
        ]
    }

    setGameMode(mode: GameMode) {
        this.mode = mode
    }

    setTurn(turn: number) {
        this.turn = turn
    }
}