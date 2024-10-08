import { useState } from 'react';

class WordSearch {
    constructor() {

    }

    find(text, word) {
		let wordMap = new Map();
        for (let i = 0; i < text.length; i++) {
			wordMap.set(text[i], 1);
        }
        
        for (let i = 0; i< word.length; i++) {
            if (!wordMap.has(word[i])) return false;
        }
        return true;
    }
}


function Square({ value, onSquareClick }) {
	return <button className='square' onClick={onSquareClick}>{value}</button>;
}

function ResetGame({ resetBoard }) {
	return <button onClick={resetBoard}>Reset Board</button>
}

function Board({ row, column, currentCount, wordsToGuess, foundSoFar, squares, choices, onPlay }) {

	function wordsToGuessToGrid() {
		const guessGrid = Array(4*4);
		guessGrid[0] = 'a';
		guessGrid[1] = 'n';
		guessGrid[2] = 'd';
		guessGrid[4] = 'n';
		guessGrid[8] = 't';
		return guessGrid;
	}

	const [targetGrid, setTargetGrid] = useState(wordsToGuessToGrid);


	function handleClick(i) {
		if (squares[i] !== '*') return;

		const nextSquares = squares.slice();
		nextSquares[i] = choices[i];
		updateCharFoundSoFar(i);

		onPlay(nextSquares);
	}

	function updateCharFoundSoFar(i) {
		if (currentCount + 1 <= foundSoFar.length) {
			foundSoFar[currentCount] = choices[i];
		}
	}

	return (
		<>
			<h1>Word-puzzle</h1>
			{

				Array(row).fill(null).map((a, n) => {
					return (
						<div className='board-row'>
							{
								Array(column).fill(null).map((b, m) => (
									<Square value={targetGrid[n * column + m]} style={{backgroundColor: "red"}}></Square>))
							}
						</div>)
				})
			}
			<hr></hr>
			{
				Array(row).fill(null).map((a, n) => {
					return (
						<div className='board-row'>
							{
								Array(column).fill(null).map((b, m) => (
									<Square value={squares[n * column + m]} onSquareClick={() => handleClick(n * column + m)}></Square>))
							}
						</div>)
				})
			}
			<hr></hr>
			{
				<div className="board-row">
					{
						foundSoFar.map((v, i) => {
							return <Square value={v} />
						})
					}
				</div>
			}
		</>
	);
}



export default function Game() {
	let status;
	
	const row = 4;
	const column = 4;
	const maxTurnPerGame = row * column - 2;
	const wordChoice = Array.from('abcdefghijklmnopqrstuvwxyz');
	const wordTarget = Array.from('and');
	const wordsToGuess = ['and', 'ant'];
	
	// Aho-Corasic
	let wordSearch = new WordSearch();

	const [currentCount, setCurrentCount] = useState(0);
	const [turnLeft, setTurnLeft] = useState(maxTurnPerGame);
	const [history, setHistory] = useState(Array(row * column).fill('*'));
	const [words, setWords] = useState(Array.from('abcdefghintxyzkpv'));
	const [charFoundSoFar, setCharFoundSoFar] = useState(Array(maxTurnPerGame).fill(null));
	const [wordsFoundSoFar, setWordFoundSoFar] = useState(0);
	const [wordsFound, setWordsFound] = useState([]);

	// Fast algorithm for shuffling an array. Perhaps move this into a utils.js
	function shuffle(array) {
		let currentIndex = array.length;
	  
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
	  
		  // Pick a remaining element...
		  let randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex--;
	  
		  // And swap it with the current element.
		  [array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
		}
	  }

	function handlePlay(nextSquares) {
		if (turnLeft === 0) {
			console.log('Finished');
			return;
		}


		setHistory(nextSquares);
		setCurrentCount(currentCount + 1);
		setTurnLeft(turnLeft - 1);

		// Found any word?
		hasFoundWord();
	}

	const foundAllWord = (wordsFoundSoFar == wordsToGuess.length);
	if (foundAllWord) {
		status = "You won";
	}
	else {
		status = "Game on";
	}
	

	function hasFoundWord() {
		console.log('....');
		const text = charFoundSoFar.join("");
		for (const word of wordsToGuess) {

			const result = wordSearch.find(text, word);
			if (result && wordsFound.indexOf(word) === -1) {
				const newWordFoundArr = wordsFound.push(word);
				setWordsFound([...wordsFound, word]);
				const currentWordFound = wordsFoundSoFar + 1;
				setWordFoundSoFar(currentWordFound);
				if (currentWordFound == wordsToGuess.length) {

					console.log('Found!');
					return true;
				}
			}
		}
		return false;
	}

	function setSolution() {
		setHistory(Array(row * column).fill(null).map((v, i) => {
			return wordChoice[Math.floor(Math.random() * wordChoice.length)];
		}));
	}

	function resetBoard() {
		// setSolution();
		shuffle(wordChoice);
		setWords(Array(row * column).fill(null).map((v, i) => {
			// return wordChoice[Math.floor(Math.random() * wordChoice.length)];
			v = wordChoice[i];
			return v;
		}));
		setCharFoundSoFar(Array(maxTurnPerGame).fill(null));
		setHistory(Array(row * column).fill('*'));
		setCurrentCount(0);
		setTurnLeft(maxTurnPerGame);
	}

	return (
		<>
			<div className='game'>

				<div className='game-board'>
					<Board row={row} column={column} currentCount={currentCount} target={wordsToGuess} foundSoFar={charFoundSoFar} squares={history} choices={words} onPlay={handlePlay} />
				</div>

				<div>
					<ResetGame resetBoard={resetBoard} />
				</div>
				<div className="status">{status}</div>
			</div>
		</>
	);
}

