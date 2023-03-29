const fs = require("fs");
const options = {
    openapi: "3.0.0",
}

const swaggerAutogen = require('swagger-autogen')(options);


const bookExample = {
    code: "JK-45",
    title: "Harry Potter",
    author: "J.K. Rowling",
    stock: 1
}

const memberExample = {
    code: "M001",
    name: "John Doe"
}
const borrowExample = {
    id: "1",
    bookCode: "JK-45",
    memberCode: "M001",
    borrowedDate: "2021-01-01"
}
const returnExample = {
    bookCode: "JK-45",
    memberCode: "M001",
    returnedDate: "2021-01-04"
}
let toBeGenerated = {
    Book: bookExample,
    Books: [bookExample, bookExample],
    Member: memberExample,
    Members: [memberExample, memberExample],
    Borrow: borrowExample,
    Return: returnExample,
}
//copy to prevent reference
toBeGenerated.Member = structuredClone(toBeGenerated.Member)
toBeGenerated.Member.borrowed_books = [
    {
        "id": 11,
        "bookCode": "JK-45",
        "memberCode": "M001",
        "borrowedDate": "2021-01-01T00:00:00.000Z",
    }
]
toBeGenerated.Members = structuredClone(toBeGenerated.Members)
toBeGenerated.Members.forEach(book => {
    book.borrowedBooksCount = 0
})
let schemas = {
    Success: {
        code: 200,
        status: "OK",
        message: "Success"
    },
    Error: {
        code: "XXX",
        status: "XXX_ERROR",
        error: {
            message: "...",
        }
    },
    NotFoundError: {
        code: "404",
        status: "NOT_FOUND",
        error: {
            message: "Data not found!"
        }
    },
    InternalError: {
        code: "500",
        status: "INTERNAL_SERVER_ERROR",
        error: {
            name: "CatastrophicError",
            message: "Something went wrong"
        }
    }
}
Object.keys(toBeGenerated).forEach(key => {
    let value = toBeGenerated[key]
    schemas["Response" + key] = {
        code: 200,
        status: "OK",
        data: value
    }
})
Object.assign(schemas, toBeGenerated)
const doc = {
    info: {
        version: '',      // by default: '1.0.0'
        title: '',        // by default: 'REST API'
        description: '',  // by default: ''
    },
    host: '',      // by default: 'localhost:3000'
    basePath: '/',  // by default: '/'
    schemes: [],   // by default: ['http']
    consumes: [],  // by default: ['application/json']
    produces: [],  // by default: ['application/json']
    tags: [],
    definitions: {},          // by default: empty object (Swagger 2.0)
    components: {
        schemas: schemas
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = [];
//explore routes folder and get all files
const routes = fs.readdirSync('./routes');
routes.forEach((route) => {
    if (route.endsWith('.js')) {
        endpointsFiles.push(`./routes/${route}`);
    }
});

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);