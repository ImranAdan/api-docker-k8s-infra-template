
class TrieNode {
    constructor() {
        this.children = new Map();
        this.failureLink = null;
        this.outputs = new Set();
    }

    hasChild(key) {
        return this.children.has(key);
    }

    getChild(key) {
        return this.children.get(key);
    }

    setChild(key, node) {
        this.children.set(key, node);
    }

    addOutput(output) {
        this.outputs.add(output);
    }

    copyOutputs(node) {
        for (const o of node.outputs) {
            this.outputs.add(o);
        }

    }
}

class AhoCorasick {
    constructor() { // patterns = words
        this.root = new TrieNode();
    }

    // words = an array of word
    insert(words) {
        // Step 1 - build trie
        let node = this.root;
        for (const word of words) {
            for (let i = 0; i < word.length; i++) {
                let c = word[i];
                if (!node.hasChild(c)) {
                    node.setChild(c, new TrieNode());
                }
                node = node.getChild(c);
            }
            node.outputs.add(word);
            node = this.root;
        }
        // Step 2 - failure link
        this.root.failureLink = this.root; // point failure link to the root

        // ...comments
        const queue = [];

        // all children of root has failure link points to the root
        for (const [_, child] of this.root.children) {
            child.failureLink = this.root;
            queue.push(child);
        }

        while (queue.length !== 0) {
            node = queue.shift();
            for (const [key, child] of node.children) {
                queue.push(child);
                let n = node.failureLink;
                while (!n[key] && n != this.root) {
                    n = n.failureLink;
                }
                child.failureLink = n[key] ?? this.root;
                child.copyOutputs(child.failureLink);
            }
        }

    }

    search(text) {
        const found = [];
        let state = this.root;
        let i = 0;
        while (i < text.length) {
            const c = text[i];
            if (state.hasChild(c)) {
                state = state.getChild(c);
                i++;
                if (state.outputs.size > 0) {
                    state.outputs.forEach(val => {
                        found.push({
                            'pos': i - val.length,
                            'val': val,
                        });
                    });
                }

            }
            else if (state === this.root) {
                i++;
            }
            else {
                state = state.failureLink;
            }
        }
        return found;
    }
}

class WordSearch {
    constructor(words) {
        this.words = words;
    }
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
    const left = startPos - 1;
    const right = startPos + currentWord.length;
    const currRow = Math.floor(startPos / column);
    let rightCharRow = Math.floor(right / column);
    let leftCharRow = Math.floor(left / column);

    let aboveChars = [];
    let belowChars = [];
    for (let i = 0; i < currentWord.length; i++) {
        if (wordGrid[startPos - row + i] === undefined) {
            aboveChars.push('*');
        } else {

            aboveChars.push(wordGrid[startPos - row + i]);
        }
        if (wordGrid[startPos + row + i] === undefined) {
            belowChars.push('*');
        } else {

            belowChars.push(wordGrid[startPos + row + i]);
        }
    }

    console.log(aboveChars);
    console.log(belowChars);

    for (let i = 0; i < currentWord.length; i++) {
        if ((aboveChars[i] !== '*' && aboveChars[i + 1] === '*') || (aboveChars[i] === '*' && aboveChars[i + 1] !== '*') || (aboveChars[i] === '*' && aboveChars[i + 1] === '*')) {
            // console.log('above:' + aboveChars[i] + ':' + aboveChars[i +1]);
        }
        else if (aboveChars[i] !== '*' && aboveChars[i + 1] !== '*') {
            console.log('Write row failed. [' + currentWord + '] neighbours not empty. row.above -> [' + aboveChars.join('') + ']');
            return false;
        }
        
        if ((belowChars[i] !== '*' && belowChars[i + 1] === '*') || (belowChars[i] === '*' && belowChars[i + 1] !== '*') || (belowChars[i] === '*' && belowChars[i + 1] === '*')) {
            // console.log('below:' + belowChars[i] + ':' + belowChars[i +1]);
        }
        else if (belowChars[i] !== '*' && belowChars[i + 1] !== '*') {
            console.log('Write row failed. [' + currentWord + '] neighbours not empty. row.below ->[' + belowChars.join('') + ']' + 'below:' + belowChars[i] + ':' + belowChars[i +1]);
            return false;
        }
    }

    // is staring postition at the endge?
    if (startPos % column === 0) {
        leftCharRow = Math.floor(startPos / (column - 1));
    } else {
        leftCharRow = Math.floor(startPos / column);
    }

    // console.log('startPos=' + startPos +';rightCharRow=' + ((startPos + currentWord.length) % (row)));
    // is ending position at the endge?
    if ((startPos + currentWord.length) % row === 0) {
        rightCharRow = currRow;
        console.log('rightCharRow=' + rightCharRow);
    }

    // Overriding existing chars?
    let existingChar = [];
    for (let i = 0; i < currentWord.length; i++) {
        existingChar.push(wordGrid[startPos + i]);
    }
    for (let i = 0; i < existingChar.length; i++) {
        if (existingChar[i] !== '*' && existingChar[i] !== currentWord[i]) {
            console.log('Row write failed . Overriding existing characters -> [' + existingChar.join('') + '] current=[' + currentWord + ']');
            return false;
        }
    }

    if ((wordGrid[startPos] !== currentWord[0] && wordGrid[startPos] !== '*')) {
        console.log('Row write failed [' + currentWord + '];grid.char=' + wordGrid[startPos] + ';word.char=' + currentWord[0]);
        return false;
    }

    // console.log('currRow=' + currRow + ';leftCharRow='+leftCharRow +';rightCharRow='+rightCharRow+';wordGrid[left]='+wordGrid[left]+';wordGrid[right]='+wordGrid[right] + ';currentWord='+currentWord);

    // if all chars on same road and char to left or right of current word are both empty.
    if (currRow === leftCharRow &&
        currRow === rightCharRow &&
        (wordGrid[left] === '*' || wordGrid[left] === undefined || wordGrid[left] === currentWord[0]) &&
        wordGrid[right] === '*' || wordGrid[right]=== undefined) {
        return true;
    }

    return false;
}

function canWriteColumn(wordGrid, row, column, startPos, currentWord) {
    let columnAbove = startPos - row;
    if (columnAbove < 0) columnAbove = startPos;
    let columnBelow = startPos + currentWord.length * column;

    // Overriding existing word?
    let existingChar = [];
    let leftChars = [];
    let rightChars = [];
    for (let i = 0; i < currentWord.length; i++) {
        leftChars.push(wordGrid[startPos + i * row -1]);
        rightChars.push(wordGrid[startPos + i * row +1]);
        existingChar.push(wordGrid[startPos + i * row]);
    }
    // console.log('column.write -> ' + currentWord);
    // console.log(leftChars);
    // console.log(rightChars);
    // console.log(existingChar);
    // console.log(wordGrid[columnBelow]);
    // Overriding existing chars
    for (let i = 0; i < existingChar.length; i++) {
        if (existingChar[i] !== '*' && existingChar[i] !== currentWord[i]) {
            console.log('Column write failed. Overriding existing characters -> [' + existingChar.join('') + '] current=[' + currentWord + ']');
            return false;
        }
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
    // // start at overlapped char
    // if (wordGrid[startPos] !== currentWord[0]) {
    //     return false;
    // }
    
    console.log('[' + currentWord + '];char.above=' + wordGrid[columnAbove] + ';char.below=' + wordGrid[columnBelow]);
    if ((wordGrid[columnAbove] === '*' && wordGrid[columnBelow] === '*')) {
        console.log("can write column");
        return true;
    }

    if (wordGrid[startPos] === currentWord[0] && (wordGrid[columnAbove] === '*' || wordGrid[columnAbove] === currentWord[0])) {
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
// TODO - need reviewing. Do we stil need this?
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
    let processedWord = new Set();
    console.log('row:'+ row);

    let wordGrid = Array(row*column).fill('*');
    let wordsToAdd = [words[0]];
    console.log(wordsToAdd);
    // a set containing words seen
    let wordsSeen = new Set(); 
    while (wordsToAdd.length > 0) {
        // console.log(wordsToAdd);
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

        // does current word has any overlapped words?
        for (let c of currentWord) {
            
            for (let w of words) {
                if (!processedWord.has(w) && w.indexOf(c) !== -1 && wordsToAdd.indexOf(w) === -1) {
                    wordsToAdd.push(w);
                }
            }
        }
    }

    displayWordGrid(wordGrid, row, column);

    return wordGrid;
}

exports.displayWordGrid = displayWordGrid;
exports.writeToGridRow = writeToGridRow;
exports.writeToGridColumn = writeToGridColumn;
exports.canWriteRow = canWriteRow;
exports.canWriteColumn = canWriteColumn;
exports.hasWrittenToGrid = hasWrittenToGrid;
exports.processToGrid = processToGrid;