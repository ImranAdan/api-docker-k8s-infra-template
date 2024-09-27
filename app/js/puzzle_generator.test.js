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
    let result = hasWrittenToGrid(wordGrid, 'devil', row, column);


    // console.log(output);
    // console.log(result);
    expect(result.has(3)).toBe(true);
});

test('start position -devil-', () => {
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
    // wordGrid[47] = 'i';
    // wordGrid[48] = 'v';
    // wordGrid[49] = 'e';
    let result = hasWrittenToGrid(wordGrid, 'give', row, column);
    displayWordGrid(wordGrid, row, column);
    result = hasWrittenToGrid(wordGrid, 'devil', row, column);
    displayWordGrid(wordGrid, row, column);

    // expect(result.has(3)).toBe(true);
});

test.only('common letters in two words', () => {
    // let words = ['let', 'no', 'and', 'ant', 'devil', 'give', 'junky', 'clap', 'van', 'thing'];
    // let words = ['let', 'thing', 'devil', 'give'];
    // let words = ['let', 'thing', 'devil'];
    // let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    // let words = ['mant', 'ant'];
    let words = ['duplicates', 'pantomine', 'she', 'tone', 'duty', 'easy'];
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

        if (processedWord.size === 0) {
            // this is the first word
            writeToGridRow(wordGrid, row, column, 0, currentWord);
            processedWord.add(currentWord)
        }
        else {
            let writtenSuccess = hasWrittenToGrid(wordGrid, currentWord, row, column);
    
            if (writtenSuccess) {
                processedWord.add(currentWord);
                wordsSeen.clear();
            }

        }


        // }
        // console.log(startPosFromExisting)
        // // if this is the first word then start at first position
        // if (startPosFromExisting.size === 0 && processedWord.size === 0) {
        //     startPosFromExisting.add(0);
        // }
        
        // console.log(startPosFromExisting)

        // for (let start of startPosFromExisting) {

        //     // If currenWord was just written in horizontal or vertical then skip it
        //     // Otherwise, it will get written again in another direction if spaces available
        //     // and conditions are satisfied.
        //     if (processedWord.has(currentWord)) break;

        //     for (let p = 0; p < wordGrid.length; p++) {
        //         let currentGrid = wordGrid.slice();
        //         let currentRow = start % row;
        //         let currentColumn = Math.floor(p / column);

        //         // Can currentWord fit onto the grid horizontally?
        //         if (currentRow + currentWord.length <= row) {
        //             let writeWordToGrid = true;
        //             if (writeWordToGrid) {

        //                 for (let i = 0; i < currentWord.length; i++) {
        //                     wordGrid[start + i] = currentWord[i];
        //                 }
        //                 processedWord.add(currentWord);
        //                 // startPosFromExisting.clear();
        //                 wordFittedSoFar += 1;
        //                 wordsSeen.clear();
        //                 break;
        //             }

        //         }


        //     }
        // }
    
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

    displayWordGrid(wordGrid, row, column);

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

function canWriteColumn(wordGrid, row, column, startPos, currentWord) {
    let columnAbove = startPos - row;
    if (columnAbove < 0) columnAbove = startPos;
    let columnBelow = startPos + currentWord.length * column;

    // Overriding existing word?
    let notEmptyCell = 0;
    let existingChar = [];
    let leftChars = [];
    let rightChars = [];
    for (let i = 0; i < currentWord.length; i++) {
        leftChars.push(wordGrid[startPos + i * row -1]);
        rightChars.push(wordGrid[startPos + i * row +1]);
        if (wordGrid[startPos + i * row] !== '*') {
            existingChar.push(wordGrid[startPos + i]);
            notEmptyCell++;
        }
    }
    console.log('column.write -> ' + currentWord);
    console.log(leftChars);
    console.log(rightChars);
    console.log(existingChar);
    console.log(wordGrid[columnBelow]);
    if (notEmptyCell === currentWord.length) {
        console.log('Column write failed [' + currentWord +']' + ';overriding existing characters -> [' + existingChar.join('') + ']');
        return false;
    }

    // Adjacent neighbours are not empty
    for (let i = 0; i < leftChars.length; i++) {
        const lc1 = leftChars[i];
        const lc2 = leftChars[i+1];
        if (lc1 !== '*' && lc2 !== '*') {
            console.log('Column write failed. Consecutive neighbours are not empty [' + leftChars.join('') + '] current=[' + currentWord + ']');
            return false;
        }

        const rc1 = rightChars[i];
        const rc2 =rightChars[i +1];
        if (rc1 !== '*' && rc2 !== '*') {
            console.log('Column write failed. Consecutive neighbours are not empty [' + rightChars.join('') + '] current=[' + currentWord + ']');
            return false;
        }
    }

    if (wordGrid[columnBelow] !== undefined && wordGrid[columnBelow] !== '*') {
        console.log('Column write failed. Char row below is not empty -> [' + wordGrid[columnBelow] + ']');
        return false;

    }
    
    if (columnAbove === 0 && wordGrid[columnAbove] === currentWord[0]) return true;
    // start at overlapped char
    if (wordGrid[startPos] !== currentWord[0]) {
        return false;
    }
    
    if ((wordGrid[columnAbove] === '*' && wordGrid[columnBelow] === '*')) {
        return true;
    }

    if (wordGrid[startPos] === currentWord[0]) {
        return true;
    }
    console.log('column.above=' + columnAbove, 'column.below=' + columnBelow + ';char.above=' + wordGrid[columnAbove] + ';char.below=' + wordGrid[columnBelow]);
    return false;
}

function writeToGridRow(wordGrid, row, column, startPos, currentWord) {
    for (let i = 0; i < currentWord.length; i++) {
        wordGrid[startPos +i ] = currentWord[i];
    }
    console.log('Row written success [' + currentWord + ']');
}

function writeToGridColumn(wordGrid, row, column, startPos, currentWord) {
    for (let i = 0; i < currentWord.length; i++) {
        const nextRow = startPos + i * column;
        wordGrid[nextRow] = currentWord[i];
    }
    console.log('Column written success [' + currentWord + ']');
}


function canWriteRow(wordGrid, row, column, startPos, currentWord) {
    const left = startPos -1;
    const right = startPos + currentWord.length;
    // still on the same row
    const currRow = Math.floor(startPos /column);
    const rightCharRow = Math.floor(right /column);
    let leftCharRow = Math.floor(left /column);
    if (leftCharRow < 0) leftCharRow = 0;

    let notEmptyCell = 0;
    let existingChar = [];
    for (let i = 0; i < currentWord.length; i++) {
        if (wordGrid[startPos + i] !== '*') {
            existingChar.push(wordGrid[startPos + i]);
            notEmptyCell++;
        }
    }
    if (notEmptyCell === currentWord.length) {
        console.log('Row write failed +[' + currentWord +']' + ';overriding existing characters -> [' + existingChar.join('') + ']');
        return false;
    }

    // at edge then it's fine
    // console.log('currentWord:' + currentWord + ';leftRow:' + leftCharRow + ';rightRow' + rightCharRow + ';left.char=' + wordGrid[left] + ';right.char=' + wordGrid[right]);
    // if (wordGrid[leftCharRow] === undefined && wordGrid[rightCharRow] === undefined) return true;

    if ((wordGrid[startPos] !== currentWord[0] && wordGrid[startPos] !== '*')) {
        console.log('Row write failed ['+currentWord + '];grid.char=' + wordGrid[startPos] + ';word.char=' + currentWord[0]);
        return false;
    }

    if (currRow === leftCharRow && currRow === rightCharRow && (wordGrid[left] === '*' || wordGrid[left] === undefined) && wordGrid[right] === '*') {
        return true;
    }
    return false;
}

function hasWrittenToGrid(wordGrid, currentWord, row, column) {
   
    for (let i = 0; i < wordGrid.length; i++) {

        // start offset when overlapped char is not the 1st char
        for (let j = 0; j < currentWord.length; j++) {
            if (currentWord[j] === wordGrid[i]) {
                let charRow = Math.floor(i / column);
                let charColumn = i % row;
                console.log(currentWord + ':' + currentWord[j] + ',i:' + i + ',j:' + j + ';' + '[' + charRow + ',' + charColumn + ']');

                // horizontal - need to check if we are still in the same row
                if (canWriteRow(wordGrid, row, column, i - j, currentWord)) {
                    console.log('row.before=' + charRow + ';row.after=' + Math.floor((i - j) / column));
                    const startPos = i - j;
                    writeToGridRow(wordGrid, row, column, i - j, currentWord);
                    return true;

                }
                // vertical
                if (canWriteColumn(wordGrid, row, column, i - j * column, currentWord)) {
                    writeToGridColumn(wordGrid, row, column, i - j * column, currentWord);
                    return true;
                }
            }
        }
    }

    return false
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
function displayWordGrid(wordGrid, row, colulmn) {
    let output = "";
    for (let i = 0; i < wordGrid.length; i++) {
        output+= wordGrid[i];
        if (i % row === (row -1)) {
            output += '\n';
        }
    }
    console.log(output);
}

test('write to grid column ', () => {
    const row = 5;
    const column = 5;
    let currentWord = '';
    let wordGrid = Array(row*column).fill('*');
    writeToGridRow(wordGrid, 0, 0, 0, 'ant');
    displayWordGrid(wordGrid, row, column);

    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 0, 'ant');
    displayWordGrid(wordGrid, row, column);

    wordGrid = Array(row*column).fill('*');
    currentWord = 'anthology';
    if (canWriteColumn(wordGrid, row, column, 0, currentWord)) {
        writeToGridColumn(wordGrid, row, column, 0, currentWord);
    }
    displayWordGrid(wordGrid, row, column);

    wordGrid = Array(row*column).fill('*');
    currentWord = 'let';
    writeToGridRow(wordGrid, row, column, 0, currentWord);
    currentWord = 'thing';
    if (canWriteColumn(wordGrid, row, column, 2, currentWord)) {
        writeToGridColumn(wordGrid, row, column, 2, currentWord);
    }
    displayWordGrid(wordGrid, row, column);

    // Cant write to existing adjacent column
    wordGrid = Array(row * column).fill('*');
    writeToGridRow(wordGrid, row, column, 0, 'meat');
    writeToGridColumn(wordGrid, row, column, 2, 'arm');

    if (canWriteColumn(wordGrid, row, column, 3, 'test')) {
        writeToGridColumn(wordGrid, row, column, 3, 'test')
    }
    displayWordGrid(wordGrid, row, column);
    expect(wordGrid[8]).toBe('*');
});

test.only('can write column', () => {
    const row = 5;
    const column = 5;

    let wordGrid = Array(row*column).fill('*');
    wordGrid[5] = 'a';
    displayWordGrid(wordGrid, row, column);
    let result = canWriteColumn(wordGrid, row, column, 5, 'ant');
    expect(result).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[0] = 'a';
    displayWordGrid(wordGrid, row, column);
    result = canWriteColumn(wordGrid, row, column, 0, 'ant');
    expect(result).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[0] = 'x';
    wordGrid[5] = 'a';
    result = canWriteColumn(wordGrid, row, column, 5, 'ant');
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[5] = 'a';
    wordGrid[20] = 'x';
    result = canWriteColumn(wordGrid, row, column, 5, 'ant');
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(false);

    wordGrid = Array(row*column).fill('*');
    wordGrid[5] = 'a';
    wordGrid[20] = 'x';
    displayWordGrid(wordGrid, row, column);
    result = canWriteColumn(wordGrid, row, column, 5, 'an');
    expect(result).toBe(true);
    
    // Cant override existing word
    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 0, 'ant');
    result = canWriteColumn(wordGrid, row, column, 5, 'nut');
    if (result) {
        writeToGridColumn(wordGrid, row, column, 5, 'nut');
    }
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(false);

});

test('can write row', () => {
    const row = 5;
    const column = 5;

    let wordGrid = Array(row*column).fill('*');

    let leftChar = canWriteRow(wordGrid, row, column, 0, 'ant');
    expect(leftChar).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[1] = 'n';
    leftChar = canWriteRow(wordGrid, row, column, 0, 'and');
    expect(leftChar).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[0] = 'a';
    wordGrid[1] = 'n';
    leftChar = canWriteRow(wordGrid, row, column, 1, 'and');
    expect(leftChar).toBe(false);

    // right
    wordGrid = Array(row*column).fill('*');
    wordGrid[4] = 't';
    leftChar = canWriteRow(wordGrid, row, column, 0, 'and');
    expect(leftChar).toBe(true);

    wordGrid = Array(row*column).fill('*');
    wordGrid[4] = 't';
    leftChar = canWriteRow(wordGrid, row, column, 0, 'andy');
    expect(leftChar).toBe(false);

    wordGrid = Array(row*column).fill('*');
    writeToGridRow(wordGrid, row, column, 0, 'and');
    let hasWritten = canWriteRow(wordGrid, row, column, 0, 'ant');
    expect(hasWritten).toBe(false);
});

test('wordsToGrid', () => {
    let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    let row = 5;
    let column = 5;
    // let result = wordsToGrid(words, 5, 5);
    let wordGrid = Array(row*column).fill('*');
    let currentWord = '';
    let startPos = hasWrittenToGrid(wordGrid, currentWord, row, column);
    wordGrid[0] = 'a';
    wordGrid[1] = 'n';
    wordGrid[2] = 't';
    startPos = hasWrittenToGrid(wordGrid, 'at', row, column);
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
