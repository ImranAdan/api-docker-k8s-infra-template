const aho = require('./puzzle_generator.js');

test('find words from text', () => {

    let wordSearch = new WordSearch('abct');
    expect(wordSearch.find('and')).toBe(false);
    expect(wordSearch.find('cat')).toBe(true);
    expect(wordSearch.find('bat')).toBe(true);
    expect(wordSearch.find('act')).toBe(true);

});

test('random guess grid', () => {

    // let guessWords = ['and', 'ant'];
    // // const arr = Array.from('and').from('ant');
    // let charPool = 'adntxyz';
    // const flatWords = [... new Set(guessWords.join(''))];
    // const charPoolArr = Array.from(charPool);
    // let s1 = new Set(guessWords.join(''));
    // let s2 = new Set(Array.from(charPool));
    // // s1.union(s2);
    // console.log(typeof (s1));
    // console.log(s1.has('t'));

    // const evens = new Set([2, 4, 6, 8]);
    // const squares = new Set([1, 4, 9]);
    // console.log(new Set([...s1, ...s2])); // Set(6) { 2, 4, 6, 8, 1, 9 }

});

test('start positions', () => {
    let wordGrid = Array(5*5).fill('*');
    let row = 5;
    let column = 5;
    wordGrid[5] = 'g';
    wordGrid[6] = 'i';
    wordGrid[7] = 'v';
    wordGrid[8] = 'e';
    let result = hasOverlappedChars(wordGrid, 'devil', row, column);

    let output = "";
    for (let i = 0; i < wordGrid.length; i++) {
        output+= wordGrid[i];
        if (i % row === (row -1)) {
            output += '\n';
        }
    }
    // console.log(output);
    // console.log(result);
    expect(result.has(3)).toBe(true);
});

test.only('start position -devil-', () => {
    let wordGrid = Array(11*11).fill('*');
    let row = 11;
    let column = 11;
    wordGrid[0] = 'l';
    wordGrid[1] = 'e';
    wordGrid[2] = 't';
    wordGrid[13] = 'h';
    wordGrid[24] = 'i';
    wordGrid[35] = 'n';
    wordGrid[46] = 'g';
    wordGrid[47] = 'i';
    wordGrid[48] = 'v';
    wordGrid[49] = 'e';
    let result = hasOverlappedChars(wordGrid, 'devil', row, column);

    let output = "";
    for (let i = 0; i < wordGrid.length; i++) {
        output+= wordGrid[i];
        if (i % row === (row -1)) {
            output += '\n';
        }
    }
    console.log(output);
    console.log(result);
    // expect(result.has(3)).toBe(true);
});

test.only('common letters in two words', () => {
    // let words = ['let', 'no', 'and', 'ant', 'devil', 'give', 'junky', 'clap', 'van', 'thing'];
    let words = ['let', 'thing', 'devil', 'give'];
    // let words = ['let', 'thing', 'devil'];
    // let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    // let words = ['mant', 'ant'];
    // let words = ['duplicates', 'pantomine', 'she', 'tone', 'duty', 'easy'];
    // console.log(depMap);
    // depMap.forEach((v, k) => {
    //     console.log(v);
    // });
    const result = processToGrid(words, 11, 11);
    console.log(result); // test is good but write horizontally is broken
});

test('words dependent graph', () => {
    let expected = [{word: 'and', startPos: 0, rotation: 'h'}, {word: 'ant', startPos: 0, rotation: 'v'}];
    let words = ['let', 'no', 'and', 'ant', 'devil', 'give', 'junky', 'clap', 'van', 'thing'];
    // let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    // let words = ['mant', 'ant'];
    // let words = ['let', 'and', 'thing', 'give'];
    let depMap = wordsDependencyMap(words, 5, 5);
    // console.log(depMap);
    // depMap.forEach((v, k) => {
    //     console.log(v);
    // });
    const result = processToGrid(words, depMap);
    console.log(result);

});

function wordsDependencyMap(words) {

    let depMap = new Map();

    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            for (let k = 0; k < words[i].length; k++) {
                // if (words[i].charAt(k) == words[j].charAt(0)) {
                if (words[j].indexOf(words[i].charAt(k)) !== -1) {
                    let key = depMap.get(words[i]);
                    if (key) {
                        const value = key.hasDep;
                        value.add({offset: k, word: words[j]});
                    }
                    else {
                        depMap.set(words[i], {hasDep: new Set([...[{offset: k, word: words[j]}]])});
                    }
                    break;
                }
            }
            for (let k = 0; k < words[j].length; k++) {
                // if (words[j].charAt(k) == words[i].charAt(0)) {
                if (words[i].indexOf(words[j].charAt(k)) !== -1) {
                    let key = depMap.get(words[j]);
                    if (key) {
                        
                        const value = key.hasDep;
                        value.add({offset: k, word: words[i]});
                    }
                    else {
                        depMap.set(words[j], {hasDep: new Set([...[{offset: k, word: words[i]}]])});
                    }
                    break;
                }
            }
        }
    }

    return depMap
}
function processToGrid(words, row, column) {
    let arr = [];
    let processedWord = new Set();

    let wordGrid = Array(row*column).fill('*');
    let wordFittedSoFar = 0;
    let wordsToAdd = [words[0]];
    console.log(wordsToAdd);
    // a set containing words seen
    let wordsSeen = new Set(); 
    while (wordsToAdd.length > 0) {
        // console.log(wordsToAdd);
        // for (const currentWord of wordsToAdd) {
        const currentWord = wordsToAdd.shift();
        const currWordsSeen = new Set(wordsSeen);
        const newWordsSeen = wordsSeen.add(currentWord);
        // console.log(newWordsSeen);
        // console.log(currWordsSeen);
        // console.log(wordsToAdd);
        const setEquals = newWordsSeen.size === currWordsSeen.size && [...newWordsSeen].every(value => currWordsSeen.has(value));
        if (setEquals) break;

        console.log(processedWord);
        console.log(currentWord);
        if (processedWord.has(currentWord)) {
            continue;
        }

        let startPosFromExisting = hasOverlappedChars(wordGrid, currentWord, row, column);

        console.log(startPosFromExisting)
        // if this is the first word then start at first position
        if (startPosFromExisting.size === 0 && processedWord.size === 0) {
            startPosFromExisting.add(0);
        }
        
        console.log(startPosFromExisting)

        for (let start of startPosFromExisting) {

            // If currenWord was just written in horizontal or vertical then skip it
            // Otherwise, it will get written again in another direction if spaces available
            // and conditions are satisfied.
            if (processedWord.has(currentWord)) break;

            for (let p = 0; p < wordGrid.length; p++) {
                let currentGrid = wordGrid.slice();
                let currentRow = start % row;
                let currentColumn = Math.floor(p / column);

                // Can currentWord fit onto the grid horizontally?
                if (currentRow + currentWord.length <= row) {
                    let writeWordToGrid = true;

                    // check before writing currentWord to the grid
                    for (let i = 0; i < currentWord.length; i++) {

                        // Fail if start position is:
                        // - not within the grid
                        // - the start char is next to another char of another word
                        if (start - 1 >= 0 && currentGrid[start - 1] !== '*') {
                            writeWordToGrid = false;
                            break;
                        }

                        // Fail if end postion next to another char
                        if (wordGrid[start + currentWord.length] !== '*') {
                            // console.log('Failed. End char next to another char: ' + currentWord + ':' + start+ ':'+ wordGrid[start + currentWord.length]);
                            writeWordToGrid = false;
                            break;
                        }

                        // Dont fail if end char is an overlapped char
                        // console.log(currentWord + ':' + currentWord[currentWord.length -1] + ':' + wordGrid[start + currentWord.length -1]);
                        if (wordGrid[start + currentWord.length -1] === currentWord[currentWord.length -1] && wordGrid[start] === '*') {
                            continue;
                        }
                        
                        
                        // console.log(currentWord + ' [ ' + i + ':' + (start + i -  column) + ']' + wordGrid[start + i-  column]);
                        // // Fail if next char down is not empty excep the first char
                        if (i !== 0 && wordGrid[start + i - column] !== undefined && wordGrid[start + i - column] !== '*') {
                            writeWordToGrid = false;
                            break;
                        }
                        
                        // Don't fail the check if the first character is an overlappep char
                        if (currentGrid[start + i] === currentWord[i]) {
                            continue;
                        }

                        if (currentGrid[start + i] !== '*'
                            // || wordGrid[start + i * column] !== '*'
                            // || wordGrid[start - i * column] !== '*'
                        ) {
                            writeWordToGrid = false;
                            break;
                        }
                    }
                    if (writeWordToGrid) {

                        for (let i = 0; i < currentWord.length; i++) {
                            wordGrid[start + i] = currentWord[i];
                        }
                        processedWord.add(currentWord);
                        // startPosFromExisting.clear();
                        wordFittedSoFar += 1;
                        wordsSeen.clear();
                        break;
                    }

                }

                if (currentColumn + currentWord.length <= column) {
                    let writeWordToGrid = true;

                    // can this word be written on the grid?
                    for (let i = 0; i < currentWord.length; i++) {
                        
                        // Don't fail the check ifi the first character is an overlappep char
                        if (currentGrid[start + i * column] === currentWord[i]) continue;

                        
                        // Fail if first char is adjacent to any other chars
                        if (currentGrid[start - i * column ] !== undefined && currentGrid[start - i * column ] !== '*'
                            || currentGrid[start + i * column +1] !== '*'
                        ) {
                            writeWordToGrid = false;
                            break;
                        }
                        
                        // console.log(currentWord + ':current.[' + start + ']' + ' [' + i + ':' + (start -1) + ']' + wordGrid[start + i * column -1]);
                        // console.log(currentWord + '.start' + start + ' [' + currentGrid[start + i * column -1] +']');
                        // TODO: to check for adjacent chars before writting to the grid
                        // if ( i!==0 &&
                        //     ((currentGrid[start + i * column -1] !== '*') || (currentGrid[start + i * column + 1]))) {

                        // }
                        if (i !== 0 && currentGrid[start + i * column -1] !== '*') {
                            writeWordToGrid = false;
                            break;
                        }

                        if (currentGrid[start + i * column] !== '*') {
                            writeWordToGrid = false;
                            break;
                        }
                    }

                    if (writeWordToGrid) {

                        for (let i = 0; i < currentWord.length; i++) {
                            wordGrid[start + i * column] = currentWord[i];
                        }
                        processedWord.add(currentWord);
                        wordFittedSoFar += 1;
                        wordsSeen.clear();
                        // startPosFromExisting.clear();
                        break;
                    }
                }
            }
        }
    
        // does current word has any overlapped words?
        for (let c of currentWord) {
            
            for (let w of words) {
                if (!processedWord.has(w) && w.indexOf(c) !== -1 && wordsToAdd.indexOf(w) === -1) {
                    wordsToAdd.push(w);
                }
            }
        }
        // can get into an infinite loop when add a new word to processWord fail 
        // but will continue to be added again in next loop
        // Solution is to check that given a processedWord when adding a new word to process fail 
        // and dont hcange then we have reached the limit iee cannot fit anymore word into the grid

    }

    let output = "";
    for (let i = 0; i < wordGrid.length; i++) {
        output+= wordGrid[i];
        if (i % row === (row -1)) {
            output += '\n';
        }
    }
    console.log(output);

    return arr;
}

function wordsToGrid(words, row, column) {
    let result = [];
    let wordsToAdd = [words[0]];

    let wordGrid = Array(row*column).fill('*');

    while (wordsToAdd.length > 0) {
        // start position of current word
        let startPos = new Set();
    }

    return result;
}

function hasOverlappedChars(wordGrid, currentWord, row, column) {
    let startFromExistingWord = new Set();
   
    for (let i = 0; i < wordGrid.length; i++) {

        // start offset when overlapped char is not the 1st char
        for (let j = 0; j < currentWord.length; j++) {
            if (currentWord[j] === wordGrid[i]) {
                let charRow = Math.floor(i / column);
                let charColumn = i % row;
                console.log(currentWord + ':' + currentWord[j] + ',i:' + i +',j:' + j + ';' + '[' + charRow + ',' + charColumn + ']');

                // horizontal - need to check if we are still in the same row
                if (charRow === Math.floor((i -j) /column) && (wordGrid[i -j] === currentWord[0] && wordGrid[i -j] === '*')) {
                    console.log('row.before=' + charRow + ';row.after=' + Math.floor((i -j) /column));
                    startFromExistingWord.add(i - j);
                }
                // vertical
                let newcolumn = i - j* column;
                if (newcolumn >= 0) {
                    console.log('column to add: ' + newcolumn);
                    startFromExistingWord.add(newcolumn);
                    console.log('col.current=' + charColumn + ';col.new=' + Math.floor((i -j) /column));
                    
                }
            }
        }
    }

    return startFromExistingWord;
}

function emptyCells(wordGrid, emptyCellContent) {
    let emptyCells = new Set();

    for (let i = 0; i < wordGrid.length; i++) {
        if (wordGrid[i] === emptyCellContent) {
            emptyCells.add(i);
        }
    }

    return emptyCells;
}

test('wordsToGrid', () => {
    let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    let row = 5;
    let column = 5;
    // let result = wordsToGrid(words, 5, 5);
    let wordGrid = Array(row*column).fill('*');
    let currentWord = '';
    let startPos = hasOverlappedChars(wordGrid, currentWord, row, column);
    wordGrid[0] = 'a';
    wordGrid[1] = 'n';
    wordGrid[2] = 't';
    startPos = hasOverlappedChars(wordGrid, 'at', row, column);
    console.log(startPos);
    expect(startPos.size).toBe(2);
    expect(startPos.has(0)).toBe(true);
    expect(startPos.has(1)).toBe(true);
});

class WordSearch {
    constructor(text) {
        this.wordMap = new Map();
        for (let i = 0; i < text.length; i++) {
            this.wordMap.set(text[i], 1);
        }
    }

    find(word) {
        
        for (let i = 0; i< word.length; i++) {
            if (!this.wordMap.has(word[i])) return false;
        }
        return true;
    }
}
