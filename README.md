# ALGORITMA
[Algorithm Answer](test/algorithm.test.js) `./test/algorithm.test.js`

Kerjakan dengan menggunakan bahasa pemograman yg anda kuasai, buat folder terpisah untuk soal ini

1. Terdapat string "NEGIE1", silahkan reverse alphabet nya dengan angka tetap diakhir kata Hasil = "EIGEN1"

2. Diberikan contoh sebuah kalimat, silahkan cari kata terpanjang dari kalimat tersebut, jika ada kata dengan panjang yang sama silahkan ambil salah satu

Contoh:
```
const sentence = "Saya sangat senang mengerjakan soal algoritma"

longest(sentence) 
// mengerjakan: 11 character
```
3. Terdapat dua buah array yaitu array INPUT dan array QUERY, silahkan tentukan berapa kali kata dalam QUERY terdapat pada array INPUT

Contoh:
```
INPUT = ['xc', 'dz', 'bbb', 'dz']  
QUERY = ['bbb', 'ac', 'dz']  

OUTPUT = [1, 0, 2] karena kata 'bbb' terdapat 1 pada INPUT, kata 'ac' tidak ada pada INPUT, dan kata 'dz' terdapat 2 pada INPUT
```

4. Silahkan cari hasil dari pengurangan dari jumlah diagonal sebuah matrik NxN Contoh:

Contoh:
```
Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

diagonal pertama = 1 + 5 + 9 = 15 
diagonal kedua = 0 + 5 + 7 = 12 

maka hasilnya adalah 15 - 12 = 3
```

# Backend Test Case

## Running
```shell
npm install
npm run swagger-autogen
npm run start
```

## Entities

- Member
- Book

## Use Case

- Members can borrow books with conditions
   - [x]  Members may not borrow more than 2 books
   - [x]  Borrowed books are not borrowed by other members
   - [x]  Member is currently not being penalized
- Member returns the book with conditions
   - [x]  The returned book is a book that the member has borrowed
   - [x]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
   - [x]  Shows all existing books and quantities
   - [x]  Books that are being borrowed are not counted
- Member check
   - [x]  Shows all existing members
   - [x]  The number of books being borrowed by each member

## Requirements

- [x]  it should be use any framework, but prefered [NestJS](https://nestjs.com/) Framework Or [ExpressJS](https://expressjs.com/)
- [x]  it should be use Swagger as API Documentation
- [x]  it should be use Database (SQL/NoSQL)
- [x]  it should be open sourced on your github repo

## Extras

- [ ]  Implement [DDD Pattern]([https://khalilstemmler.com/articles/categories/domain-driven-design/](https://khalilstemmler.com/articles/categories/domain-driven-design/))
- [x]  Implement Unit Testing

## Notes
- Feel free to add some structure or plugins


------