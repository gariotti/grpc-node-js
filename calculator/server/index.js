const grpc = require('@grpc/grpc-js')
const serviceImpl = require('./service_impl');
const {CalculatorServiceService} = require('../proto/calculator_grpc_pb');


const addr = 'localhost:50051';

function cleanup(server) {
    console.log('Cleanup');
    if (server) {
        server.forceShutdown();
    }
}


function main() {
    const server = new grpc.Server();

    process.on('SIGINT', () => { console.log('Interrupted by signal'); cleanup(server); });

    server.addService(CalculatorServiceService, serviceImpl);
    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, _) => {
        if (err) {
            console.log(err);
            return cleanup(server);
        }

        server.start();

    });

    console.log('Server running at:', addr);
}

main();