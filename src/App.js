import { useEffect, useState } from "react";
import Die from "./components/Die";
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

function App() {

	// State containing all the dice
	const [dice, setDice] = useState(allNewDice())
	// State that represents whether the user has won the game yet
	const [tenzies, setTenzies] = useState(false)
	const [rolls, setRolls] = useState(0)

	useEffect(() => {
		
		const allHeld = dice.every(die => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(die => die.value === firstValue)

		if (allHeld && allSameValue)
			setTenzies(true)

	}, [dice])

	// Creates the random starting dice
	function allNewDice() {
		const diceArray = []
		for (let i = 0; i < 10; i++) {
			
			const num = Math.ceil(Math.random() * 6)
			const die = {
				value: num, 
				isHeld: false, 
				id: nanoid()
			}
			
			diceArray.push(die)
		}

		return diceArray
	}

	// Rolls the dice 
	function rollDice() {
		if (!tenzies) {
			setRolls(prevRolls => prevRolls + 1)
			setDice(prevDice => {
				return prevDice.map(die => die.isHeld ? die : {...die, value: Math.ceil(Math.random() * 6)})
			})
		} else {
			setTenzies(false)
			setDice(allNewDice())
			setRolls(0)
		}
	}

	function holdDice(id) {
		setDice(prevDice => {
			return prevDice.map(die => die.id === id ? {...die, isHeld: !die.isHeld} : die)
		})
	}

	// Creates all of the dice components
	const diceElements = dice.map(die => {
		return <Die 
			key={die.id} 
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	})

  return (
    <main className="main">
			{tenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

			<div className="dice-container">
				{diceElements}
			</div>
			
			<div className="rolls">
				Number of Rolls: {rolls}
			</div>

			<button 
				className="roll-dice"
				onClick={rollDice}
			>
					{tenzies ? "New Game" : "Roll"}
				</button>
			
		</main>
  );
}

export default App;
