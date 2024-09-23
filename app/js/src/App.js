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

	// Algorithm to fit a bunch of words into a grid (2 dimensional array)
	// - pick a random word
	//		place vertically or horizonally
	function wordsToGuessToGrid() {
		// let startingPos = 0;
		// const startingWord = wordsToGuess[Math.floor(Math.random() * (wordsToGuess.length - 1))];
		// console.log('starting word -> ' + startingWord);
		// fitWords();

		let words = ['and', 'ant', 'devil'];
		const deps = wordsDependencyMap(words);
		const gridArr = processToGrid(deps);
		console.log(gridArr);

		// let gridArr = [{word: 'and', startPos: 0, rotation: 'h'}, {word: 'ant', startPos: 0, rotation: 'v'}];
		const guessGrid = Array(row*column);

		for (let i in gridArr) {
			// console.log(gridArr[i]);
			const word = gridArr[i].word;
			const pos = gridArr[i].startPos;
			const rot = gridArr[i].rot;
			for (let w = 0; w < word.length; w++) {
				if (rot === 'h') {
					guessGrid[pos + w] = word[w];
				} else if (rot === 'v') {
					guessGrid[pos + (w * column)] = word[w];
				}
			}
		}

		return guessGrid;
	}

	// An algorithm to show how a bunch of words fit into a grid
	// startPos for dependent word = the start position of dependent word + the offset (the position of starting word)
	function fitWords() {
		let result = new Map();
		let startingPos = 0;
		let startRotation = 'h';
		const startingWord = wordsToGuess[Math.floor(Math.random() * (wordsToGuess.length - 1))];
		result.set( startingWord, {word: startingWord, startPos: startingPos, rotation: 'h', relyOn: ''});
		for (const word of wordsToGuess) {
			if (word === startingWord) continue;
			for (let i = 0; i < startingWord.length; i++) {
				if (word.charAt(0) === startingWord.charAt(i)) {
					let newRotation = startRotation === 'h' ? 'v' : 'h';
					startRotation = newRotation;
					result.set(word, {word: word, startPos: i, rotation: newRotation, relyOn: startingWord});
					break;
				}
			}
		}
		console.log(result);
		return result;
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
	
	const row = 5;
	const column = 5;
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
					<Board row={row} column={column} currentCount={currentCount} wordsToGuess={wordsToGuess} foundSoFar={charFoundSoFar} squares={history} choices={words} onPlay={handlePlay} />
				</div>

				<div>
					<ResetGame resetBoard={resetBoard} />
				</div>
				<div className="status">{status}</div>
			</div>
		</>
	);
}

function wordsDependencyMap(words) {

    let depMap = new Map();

    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            for (let k = 0; k < words[i].length; k++) {
                if (words[i].charAt(k) == words[j].charAt(0)) {
                    let key = depMap.get(words[i]);
                    if (key) {
                        const value = key.hasDep;
                        value.add({offset: k, word: words[j]});
                    }
                    else {
                        depMap.set(words[i], {hasDep: new Set([...[{offset: k, word: words[j]}]])});
                    }
                }
            }
            for (let k = 0; k < words[j].length; k++) {
                if (words[j].charAt(k) == words[i].charAt(0)) {
                    let key = depMap.get(words[j]);
                    if (key) {
                        
                        const value = key.hasDep;
                        value.add({offset: k, word: words[i]});
                    }
                    else {
                        depMap.set(words[j], {hasDep: new Set([...[{offset: k, word: words[i]}]])});
                    }
                }
            }

        }
    }
    return depMap
}

function processToGrid(depMap) {
    let arr = [];
    let processedWord = new Set();

    let startPos = 0;
    let iniRot = 'h';

    depMap.forEach((v, k) => {
        if (!processedWord.has(k)) {
            arr.push({word: k, startPos: startPos, rot: iniRot})
            processedWord.add(k);
        }
        // process dependents if there is any
        for (let d of v.hasDep) {
            console.log(d.word);
            if (!processedWord.has(d.word)) {
                arr.push({word: d.word, startPos: startPos + d.offset, rot: iniRot==='h' ? 'v' : 'h'});
                processedWord.add(d.word);
            }
        }
    });
    console.log(arr);
    return arr;
}