import { Server } from "socket.io";
import { socketPort } from "../../config";

export const socketRoutes = app => {

    const io = new Server(socketPort);
    io.on('connection', async function (socket) {
        app.post('/socketNotification', async function (req, res) {
            let endpoint = req.body.endPoint;
            let content = req.body.content;

            io.emit(endpoint, content);
            res.send({ status: 200, errorMessage: null });
        });
    })

}