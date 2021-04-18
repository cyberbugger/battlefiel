import { GameProps } from "./Game"
import { CellState } from "../../typings"
import React from "react"
import cx from 'classnames';

const styles = require("./Game.module.css")

export const GameOver = (props: GameProps) => {
    const winner = props.entities.reduce((_, entity, eIndex) => {
        const won = entity.batteground.grid.every(g => !g.includes(CellState.FLEET))
        return won ? eIndex : -1
    }, -1)

    if (winner < 0) {
        return <>Game Over</>
    }

    return (
        <>
            <p>Game Over, winner is {props.entities[winner].player.name}</p>

            {props.entities.forEach((e, eIndex) => (
                <div key={eIndex}>
                    {e.batteground.grid.map((column, colummId) => (
                        <div key={colummId} className={styles.gridRow}>
                            {column.map((row, rowId) => (
                                <div key={rowId} className={cx(styles.node, {
                                    [styles.fleet]: row === CellState.FLEET,
                                    [styles.miss]: row === CellState.MISS,
                                    [styles.hit]: row === CellState.HIT,
                                })} />
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}