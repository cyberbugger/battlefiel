import { GameProps } from "./Game"
import { CellState, GameMode } from "../../typings"
import React from "react"
import cx from 'classnames';

const styles = require("./Game.module.css")

const PREDEFINED_COLORS = ["#faad14", "#52c41a"]

export const Live = (props: GameProps) => {
    const handleTurnChange = () => props.onTurnChange(1 - props.turn)

    const calculateGameOver = (): boolean => props.entities.some((e) => {
        let allFleetsTargeted = true
        e.batteground.grid.forEach((column, _) => {
            column.forEach((cellState, _) => {
                if (cellState === CellState.FLEET) {
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

    const handleCellClick = (columnId: number, rowId: number) => {
        const cellState = grid[columnId][rowId]

        switch (cellState) {
            case CellState.HIT:
            case CellState.MISS:
                return
            case CellState.FLEET:
                opponentEntity.batteground.setCellState(columnId, rowId, CellState.HIT)
                break
            default:
                opponentEntity.batteground.setCellState(columnId, rowId, CellState.MISS)
                break
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
    }

    return (
        <>
            <p>Turn for <strong>{currentEntity.player.name}</strong></p>
            <div style={{ border: `2px solid ${PREDEFINED_COLORS[opponent]}`, padding: "15px" }}>
                {grid.map((column, columnId) => (
                    <div key={columnId} className={styles.gridRow}>
                        {column.map((cellState, rowId) => (
                            <div key={columnId + rowId} className={cx(styles.node, {
                                [styles.miss]: cellState === CellState.MISS,
                                [styles.hit]: cellState === CellState.HIT,
                            })} onClick={() => handleCellClick(columnId, rowId)} />
                        ))}
                    </div>
                ))}
            </div>

            <div className={styles.myPlayerContainer}>
                <p>My battleground status</p>
                {currentEntity.batteground.grid.map((column, columnId) => (
                    <div key={columnId} className={styles.gridRow}>
                        {column.map((row, rowId) => (
                            <div key={"" + columnId + rowId} className={cx(styles.node, {
                                [styles.ship]: row === CellState.FLEET,
                                [styles.hit]: row === CellState.HIT,
                                [styles.miss]: row === CellState.MISS,
                            })} />
                        ))}
                    </div>
                ))}
            </div>

            <div className={styles.indicators}>
                <div className={cx(styles.node, styles.ship)} /> Fleet position
                <div className={cx(styles.node, styles.hit)} /> Correct hit
                <div className={cx(styles.node, styles.miss)} /> Missed hit
            </div>
        </>
    )
}