import { app } from "./src/app";
import http from "http";

const server = http.createServer(app);

export default server;