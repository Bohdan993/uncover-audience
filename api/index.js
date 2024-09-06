const express = require("express");
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");

const app = express();

const keyCertPath = process.env.NODE_ENV === "development" ? path.resolve(__dirname, "../../localhost-key.pem") : null;
const certPath = process.env.NODE_ENV === "development" ? path.resolve(__dirname, "../../localhost.pem") : null;
const key = process.env.NODE_ENV === "development" ? fs.readFileSync(keyCertPath, "utf-8") : null;
const cert = process.env.NODE_ENV === "development" ? fs.readFileSync(certPath, "utf-8") : null;
const server = process.env.NODE_ENV === "development" ? https.createServer({key: key, cert: cert }, app) : null;

const trackingRoute = require("./routes/tracking");
const { handleError } = require("../middlewares/errorMiddlewares");

const PORT = process.env.PORT || 5000;
const corsOptions = {
    // origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_ADMIN],
    origin: "*",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};



app.set("trust proxy", 1);
app.set("x-powered-by", false);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use("/api/tracking", trackingRoute);
app.use(handleError);

async function start(){
    if(process.env.NODE_ENV === "development") {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } else {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    }
}


module.exports = {
    start
}

