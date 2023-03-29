const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
const should = chai.should();
const app = require("../app");
const BorrowedBook = require("../models/borrowed_book");
const Member = require("../models/member");
const Book = require("../models/book");
var bookMockData = [
    {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
    },
    {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 1
    },
    {
        code: "TW-11",
        title: "Twilight",
        author: "Stephenie Meyer",
        stock: 1
    },
    {
        code: "HOB-83",
        title: "The Hobbit, or There and Back Again",
        author: "J.R.R. Tolkien",
        stock: 1
    },
    {
        code: "NRN-7",
        title: "The Lion, the Witch and the Wardrobe",
        author: "C.S. Lewis",
        stock: 1
    },
];

var memberMockData = [
    {
        code: "M001",
        name: "Angga",
    },
    {
        code: "M002",
        name: "Ferry",
    },
    {
        code: "M003",
        name: "Putri",
    },
];

//add more
for (let i = 0; i < 15; i++) {
    memberMockData.push({
        code: `MG00${i}`,
        name: `Generated Member ${i}`,
    });
    bookMockData.push({
        code: `GEN-00${i}`,
        title: `Generated Book ${i}`,
        author: `Generated Author ${i}`,
        stock: i + 1,
    });
}

/**
 * - Members can borrow books with conditions
 *    - [ ]  Members may not borrow more than 2 books
 *    - [ ]  Borrowed books are not borrowed by other members
 *    - [ ]  Member is currently not being penalized
 * - Member returns the book with conditions
 *    - [ ]  The returned book is a book that the member has borrowed
 *    - [ ]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
 * - Check the book
 *    - [ ]  Shows all existing books and quantities
 *    - [ ]  Books that are being borrowed are not counted
 * - Member check
 *    - [ ]  Shows all existing members
 *    - [ ]  The number of books being borrowed by each member
 */
before(async () => {
    //sync
    await BorrowedBook.sync({force: true});
    await Member.sync({force: true});
    await Book.sync({force: true});
    //clear all
    await BorrowedBook.destroy({where: {}});
    await Member.destroy({where: {}});
    await Book.destroy({where: {}});
    //insert mock data
    await Member.bulkCreate(memberMockData);
    await Book.bulkCreate(bookMockData);


})
chai.use(chaiHttp);


describe("Sanity Check", () => {
    it("Should be true", () => {
        expect(true).to.be.true;
    });
    it("Database should be same", async () => {
        const members = await Member.findAll();
        const books = await Book.findAll();
        expect(members.length).to.equal(memberMockData.length);
        expect(books.length).to.equal(bookMockData.length);
    });

    it("Database should be the same as API response", async() => {
        const membersRes = await chai.request(app).get("/api/v1/members");
        const booksRes = await chai.request(app).get("/api/v1/books");
        expect(membersRes.body.data.length).to.equal(memberMockData.length);
        expect(booksRes.body.data.length).to.equal(bookMockData.length);
    });

})

describe("Borrow Book", () => {

    beforeEach(async () => {
        //sync local database
        const membersRes = await chai.request(app).get("/api/v1/members");
        const booksRes = await chai.request(app).get("/api/v1/books");

        bookMockData = booksRes.body.data;
        memberMockData = membersRes.body.data;
    })

    it("Member should not able to borrow more than 2 books", async () => {
        //get 3 books that have stock
        const borrowList = bookMockData.filter((book) => book.stock > 0).slice(0, 3);
        //borrow 3 books
        for (let i = 0; i < borrowList.length; i++) {
            const borrowRes = await chai
                .request(app)
                .post("/api/v1/borrow")
                .send({
                    memberCode: "M001",
                    bookCode: borrowList[i].code
                });
            //3rd book should be failed
            if (i !== 2) {
                borrowRes.should.have.status(200);
                borrowRes.body.should.be.a("object");
                borrowRes.body.status.should.equal("OK");
                borrowRes.body.data.should.be.a("object");
                borrowRes.body.data.should.have.property("memberCode").equal("M001");
                borrowRes.body.data.should.have.property("bookCode").equal(borrowList[i].code);
            } else {
                borrowRes.should.have.status(400);
                borrowRes.body.should.be.a("object");
                borrowRes.body.status.should.equal("BAD_REQUEST");
                borrowRes.body.error.should.be.a("object");
                borrowRes.body.error.should.be.a("object");
                borrowRes.body.error.should.have.property("message").equal("Member has borrowed more than 2 books!");
            }
        }

        //check book stock
        for (let i = 0; i < borrowList.length; i++) {
            const bookRes = await chai
                .request(app)
                .get("/api/v1/books/" + borrowList[i].code);
            bookRes.should.have.status(200);
            bookRes.body.should.be.a("object");
            bookRes.body.status.should.equal("OK");
            bookRes.body.data.should.be.a("object");
            bookRes.body.data.should.have.property("code").equal(borrowList[i].code);
            bookRes.body.data.should.have.property("title").equal(borrowList[i].title);
            bookRes.body.data.should.have.property("author").equal(borrowList[i].author);
            bookRes.body.data.should.have.property("stock").equal(borrowList[i].stock - (i === 2 ? 0 : 1))
        }
    });

    it("Borrowed books are not borrowed by other members", (done) => {
        const borrowedBook = bookMockData.filter((book) => book.stock === 0)[0];
        const randomMember = memberMockData.filter((member) => member.borrowedBooksCount < 2)[0];
        chai
            .request(app)
            .post("/api/v1/borrow")
            .send({
                memberCode: randomMember.code,
                bookCode: borrowedBook.code
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.status.should.equal("BAD_REQUEST");
                res.body.error.should.be.a("object");
                res.body.error.should.have.property("message").equal("Book is borrowed by other members!");
                done();
            });
    });

    it("All member is currently not being penalized", async () => {
        for (const member of memberMockData) {
            expect(member.penalty_expired).to.be.null;
        }
    });


    it("Member should not able to borrow book if being penalized", async () => {
        //get fresh subject
        const book = bookMockData.filter((book) => book.stock > 0)[0];
        const member = memberMockData.filter((member) => member.penalty_expired === null && member.borrowedBooksCount < 2)[0];

        //borrow first
        const borrowRes = await chai
            .request(app)
            .post("/api/v1/borrow")
            .send({
                memberCode: member.code,
                bookCode: book.code
            });
        borrowRes.should.have.status(200);
        borrowRes.body.should.be.a("object");
        borrowRes.body.status.should.equal("OK");

        //return late
        const returnRes = await chai
            .request(app)
            .post("/api/v1/return")
            .send({
                memberCode: member.code,
                bookCode: book.code,
                //current date + 7 days
                returnedDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            })
        returnRes.should.have.status(200);
        returnRes.body.should.be.a("object");
        returnRes.body.status.should.equal("OK");
        returnRes.body.message.should.include("penalized");


        //borrow again
        const anotherBook = bookMockData.filter((book) => book.stock > 0 && book.code !== borrowRes.body.data.bookCode)[0];
        const borrowRes2 = await chai
            .request(app)
            .post("/api/v1/borrow")
            .send({
                memberCode: member.code,
                bookCode: anotherBook.code
            });
        borrowRes2.should.have.status(400);
        borrowRes2.body.should.be.a("object");
        borrowRes2.body.status.should.equal("BAD_REQUEST");
        borrowRes2.body.error.should.be.a("object");
        borrowRes2.body.error.should.have.property("message").equal("Member is currently being penalized!");
    });



});