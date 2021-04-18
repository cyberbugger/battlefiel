import { GameProps } from "./Game"
import { CellState, GameMode } from "../../typings"
import React from "react"
import cx from 'classnames';

const styles = require("./Game.module.css")

const PREDEFINED_COLORS = ["#faad14", "#52c41a"]

export const Live = (props: GameProps) => {
    const handleTurnChange = () => props.onTurnChange(props.turn < props.entities.length - 1 ? props.turn + 1 : 0)

    const calculateGameOver = (): boolean => props.entities.some((e) => {
        let allFleetsTargeted = true
        e.batteground.grid.forEach((column, _) => {
            column.forEach((row, _) => {
                if (row === CellState.FLEET) {
                    allFleetsTargeted = false
                }
            })
        })
        return allFleetsTargeted
    })

    const opponent = 1 - props.turn
    const opponentEntity = props.entities[opponent]
    const grid = opponentEntity.batteground.grid
    const currentEntity = props.entities[props.turn]

    return (
        <>
            <p>Turn for <strong>{currentEntity.player.name}</strong></p>
            <div style={{ border: `2px solid ${PREDEFINED_COLORS[opponent]}`, padding: "15px" }}>
                {grid.map((column, colummId) => (
                    <div key={colummId} className={styles.gridRow}>
                        {column.map((row, rowId) => {
                            return (
                                <div key={colummId + rowId} className={cx(styles.node, {
                                    [styles.miss]: row === CellState.MISS,
                                    [styles.hit]: row === CellState.HIT,
                                })} onClick={() => {
                                    if (row === CellState.FLEET) {
                                        opponentEntity.batteground.setCellState(colummId, rowId, CellState.HIT)
                                    } else {
                                        opponentEntity.batteground.setCellState(colummId, rowId, CellState.MISS)
                                    }
                                    
                                    props.onEntitiesChange(props.entities.map(e => ({...e})))

                                    setTimeout(() => {
                                        const isGameOver = calculateGameOver()
                                        if (isGameOver) {
                                            props.onModeChange(GameMode.OVER)
                                            return
                                        }
                                        handleTurnChange()
                                    }, 500)
                                }} />
                            )
                        })}
                    </div>
                ))}
            </div>

            <div className={styles.myPlayerContainer}>
                {currentEntity.batteground.grid.map((column, colummId) => (
                    <div key={colummId} className={styles.gridRow}>
                        {column.map((row, rowId) => (
                            <div key={"" + colummId + rowId} className={cx(styles.node, {
                                [styles.ship]: row === CellState.FLEET || row === CellState.HIT,
                            })} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}