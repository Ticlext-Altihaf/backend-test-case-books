const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const env = require("./env");

const app = express();


const port = process.env.PORT || 8000;

app.use(helmet());
app.use(compression());
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static(path.join(__dirname, "public")));
/* Start Logging */
const log_path = env.log_path || path.join(__dirname, "logs");

// if log path not exist, log_path folder will be created
if (!fs.existsSync(log_path)) {
   fs.mkdirSync(log_path, { recursive: true });
}

// Log all error requests status
app.use(
   morgan("combined", {
      skip: (req, res) => {
         return res.statusCode < 400;
      },
      stream: fs.createWriteStream(path.join(log_path, "error.log"), {
         flags: "a",
      }),
   })
);

// Log all success request status
app.use(
   morgan("combined", {
      skip: (req, res) => {
         return res.statusCode > 400;
      },
      stream: fs.createWriteStream(path.join(log_path, "access.log"), {
         flags: "a",
      }),
   })
);
/* End Logging */

/* Dynamic CORS */
app.use(
   cors({
      origin: "*",
   })
);
/* End Dynamic CORS */


/* Start of Routing Modules */
require("./routes/member_route")(app);
require("./routes/book_route")(app);
require("./routes/borrow_route")(app);
/* End of Routing Modules */

/* Check database connection */

app.listen(port, "0.0.0.0", () => {
   console.log(`Server API listen on port ${port}`);
   console.log("http://localhost:" + port + "/swagger");
});

module.exports = app;
