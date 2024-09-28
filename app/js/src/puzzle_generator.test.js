const PuzzleGenerator = require('./puzzle_generator.js');

const displayWordGrid = PuzzleGenerator.displayWordGrid;
const writeToGridRow = PuzzleGenerator.writeToGridRow;
const writeToGridColumn = PuzzleGenerator.writeToGridColumn;
const canWriteRow = PuzzleGenerator.canWriteRow;
const canWriteColumn = PuzzleGenerator.canWriteColumn;
const hasWrittenToGrid = PuzzleGenerator.hasWrittenToGrid;
const processToGrid = PuzzleGenerator.processToGrid;

test('find words from text', () => {

    let wordSearch = new WordSearch('abct');
    expect(wordSearch.find('and')).toBe(false);
    expect(wordSearch.find('cat')).toBe(true);
    expect(wordSearch.find('bat')).toBe(true);
    expect(wordSearch.find('act')).toBe(true);

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
    // let words = ['let', 'no', 'and', 'ant', 'devil', 'give', 'junky', 'clap', 'van', 'thing', 'hive'];
    // let words = ['let', 'thing', 'devil', 'give'];
    let words = ['and', 'ant', 'devil', 'clap'];
    // let words = ['let', 'thing', 'devil'];
    // let words = ['and', 'dro', 'mutta', 'oa', 'azz', 'ant'];
    // let words = ['mant', 'ant'];
    // let words = ['duplicates', 'pantomine', 'she', 'tone', 'duty', 'easy'];
    // console.log(depMap);
    // depMap.forEach((v, k) => {
    //     console.log(v);
    // });
    const result = processToGrid(words, 5, 5);
});

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

test('can write column', () => {
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

    // Row above startPos is not empty
    wordGrid = Array(row * column).fill('*');
    wordGrid[0] = 'x';
    wordGrid[5] = 'a';
    result = canWriteColumn(wordGrid, row, column, 5, 'ant');
    if (result) {
        writeToGridColumn(wordGrid, row, column, 5, 'ant');
    }
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(false);

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
    displayWordGrid(wordGrid, row, column);
    expect(leftChar).toBe(false);

    wordGrid = Array(row*column).fill('*');
    writeToGridRow(wordGrid, row, column, 0, 'and');
    let hasWritten = canWriteRow(wordGrid, row, column, 0, 'ant');
    expect(hasWritten).toBe(false);

    // can't override existing word
    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 0, 'easy');
    let result = canWriteRow(wordGrid, row, column, 5, 'ant');
    if (result) {
        writeToGridRow(wordGrid, row, column, 5, 'ant');
    }
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(true);
    
    // cannot write when row below or above is not empty
    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 0, 'easy');
    writeToGridRow(wordGrid, row, column, 5, 'ant');

    result = canWriteRow(wordGrid, row, column, 10, 'sea');
    if (result) {

        writeToGridRow(wordGrid, row, column, 10, 'sea');
    }
    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(false);

    // canno write row when start not from edge
    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 2, 'thing');
    writeToGridRow(wordGrid, row, column, 16, 'and');
    result = canWriteRow(wordGrid, row, column, 11, 'giv');
    if (result) {
        writeToGridRow(wordGrid, row, column, 11, 'giv');
    }

    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(false);

    // test can write when neighbours not all empty
    wordGrid = Array(row*column).fill('*');
    writeToGridColumn(wordGrid, row, column, 2, 'thing');
    result = canWriteRow(wordGrid, row, column, 7, 'hiv');
    if (result) {
        writeToGridRow(wordGrid, row, column, 7, 'hiv');
    }

    displayWordGrid(wordGrid, row, column);
    expect(result).toBe(true);

    // cannot write word longer than grid
    wordGrid = Array(row*column).fill('*');
    result = canWriteRow(wordGrid, row, column, 0, 'anthology');
    expect(result).toBe(false);
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
