import { GameProps } from "./Game"
import { GameMode } from "../../typings"
import React, { useState } from "react"
import { Button, Row, Input } from "antd"

const styles = require("./Game.module.css")

type PlayerUpdateProps = {
    index: number
} & GameProps

export const Home = (props: GameProps) => {
    const enterGame = () => props.onModeChange(GameMode.PLACEMENT)

    return (
        <div className={styles.homeContainer}>
            <div className={styles.gameWelcome}>Welcome to Battlefield</div>

            {props.entities.map((_, i) => <PlayerUpdate key={i} index={i} {...props} />)}

            <Button type="primary" shape="round" size="large" onClick={enterGame}>Enter Game</Button>
        </div> 
    )
}

const PlayerUpdate = ({ entities, onEntitiesChange, index }: PlayerUpdateProps) => {
    const [name, setName] = useState(entities[index].player.name)

    return (
        <Row className={styles.playerNameRow}>
            <span>Player {index + 1} : </span>

            <Input value={name} onChange={ev => {
                setName(ev.target.value)
                entities[index].player.name = ev.target.value
                onEntitiesChange(entities)
            }} />
        </Row>
    )
}