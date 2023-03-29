const expect = require('chai').expect;






describe('Algorithm', () => {
    it('Should reverse alphabet', () => {

        expect(reverseAlphabet('NEGIE1')).equal('EIGEN1');
        expect(reverseAlphabet('NEGIE2')).equal('EIGEN2');
        expect(reverseAlphabet('A1B2C3')).equal('C1B2A3');
        expect(reverseAlphabet('A1B2C3D4')).equal('D1C2B3A4');
    });

    it('Find longest word', () => {
        expect(findLongestWordLength("The quick brown fox jumped over the lazy dog")).equal("jumped".length);
        expect(findLongestWordLength("May the force be with you")).equal("force".length);
        expect(findLongestWordLength("Google do a barrel roll")).equal("Google".length);
        expect(findLongestWordLength("What is the average airspeed velocity of an unladen swallow")).equal("airspeed".length);
        expect(findLongestWordLength("What if we try a super-long word such as otorhinolaryngology")).equal("otorhinolaryngology".length);
    });

    it('Batch count query', () => {
        expect(countQuery(['xc', 'dz', 'bbb', 'dz'], ['bbb', 'ac', 'dz'])).deep.equal([1, 0, 2]);
        expect(countQuery(['aba', 'baba', 'aba', 'xzxb'], ['aba', 'xzxb', 'ab'])).deep.equal([2, 1, 0]);
        expect(countQuery(['def', 'de', 'fgh'], ['de', 'lmn', 'fgh'])).deep.equal([1, 0, 1]);
        expect(countQuery(['abcde', 'sdaklfj', 'asdjf', 'na', 'basdn', 'sdaklfj', 'asdjf', 'na', 'asdjf', 'na', 'basdn', 'sdaklfj', 'asdjf'], ['abcde', 'sdaklfj', 'asdjf', 'na', 'basdn'])).deep.equal([1, 3, 4, 3, 2]);
    });

    /**
     * Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:
     * Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
     *
     * diagonal pertama = 1 + 5 + 9 = 15
     * diagonal kedua = 0 + 5 + 7 = 12
     *
     * maka hasilnya adalah 15 - 12 = 3
     */

    it('Matrix Diagonal Subtraction', () => {
        expect(matrixDiagonalSubtraction([[1, 2, 0], [4, 5, 6], [7, 8, 9]])).equal(3);
        expect(matrixDiagonalSubtraction([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).equal(0);
    });
});

function matrixDiagonalSubtraction(matrix) {
    let diagonal1 = 0;
    let diagonal2 = 0;
    for (let i = 0; i < matrix.length; i++) {
        diagonal1 += matrix[i][i] || 0;
        diagonal2 += matrix[i][matrix.length - 1 - i] || 0;
    }
    return diagonal1 - diagonal2;
}


function countQuery(input, query) {
    let result = [];
    for (let i = 0; i < query.length; i++) {
        let count = 0;
        for (let j = 0; j < input.length; j++) {
            if (query[i] === input[j]) {
                count++;
            }
        }
        result.push(count);
    }
    return result;
}

function findLongestWordLength(str) {
    let words = str.split(' ');
    let longestWord = '';
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > longestWord.length) {
            longestWord = words[i];
        }
    }
    return longestWord.length;
}

//input: EIGEN1
//output: NEGIE1
function reverseAlphabet(str) {
    let strWithoutNumber = str.replace(/[0-9]/g, '');
    strWithoutNumber = strWithoutNumber.split('').reverse().join('');
    let result = '';
    let index = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i].match(/[0-9]/g)) {
            result += str[i];
        } else {
            result += strWithoutNumber[index];
            index++;
        }
    }
    return result;
}


