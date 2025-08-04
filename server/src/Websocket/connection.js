
export const connection = (app, io) => {
    io.on('connection', function (socket) {
        console.log("Socket connected!");
        socket.on('disconnecting', (reason) => {
            console.log('Socket disconnecting');
        });
    })

};
