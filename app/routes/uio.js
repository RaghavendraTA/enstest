module.exports = function(io) {

    io.use(function(socket, next) {
        if (socket.request.headers.cookie) {
            //Validate Cookies
            return next();
        }
        next(new Error('Authentication error'));
    });

    var people = io.of('/usoc').on('connection', function(socket) {

        //on - Test Receive to the Server
        socket.on('Test', function(data) {
            console.log("Received Data : ");
            console.log(data);
        });

        //Add New 'Socket on' Functions
    });
};
