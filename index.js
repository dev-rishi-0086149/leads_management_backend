const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

// const corsOptions = {
//   origin: ["http://localhost:5173/"], // Allow these domains
//   methods: ["GET", "POST"], // Allow specific HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
// };
// cors(corsOptions);

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(express.static('public'))

// parse application/json
app.use(bodyParser.json());

const leadsRoutes = require("./routes/leads");
const authRoutes = require("./routes/authentication");

app.use("/leads", leadsRoutes);
app.use("/auth", authRoutes);

app.listen(3000);
