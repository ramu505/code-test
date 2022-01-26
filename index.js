const { links } = require("express/lib/response");
const http = require("http");
const app = require("./app");

const { API_PORT } = process.env;

const server = http.createServer(app);//making complete logic available on server

server.listen(API_PORT, () => {
    console.log('server running on port', API_PORT);
})//for starting the server