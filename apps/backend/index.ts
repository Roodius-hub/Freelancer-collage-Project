import server from "./server";
import "./src/chatSocket/socket";

const PORT = process.env.PORT || 3001;


server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})