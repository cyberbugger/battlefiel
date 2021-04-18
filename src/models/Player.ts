export class Player {
    name: string;

    constructor(index: number) {
        this.name = "player_" + index
    }

    setName(name: string) {
        this.name = name
    }
}