const grpc = require('@grpc/grpc-js')
const {GreetServiceClient} = require('../proto/greet_grpc_pb');
const {GreetRequest} = require('../proto/greet_pb');


function doGreet(client) {
    const request = new GreetRequest();
    request.setFirstName('Gustavo');
    client.greet(request, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response.getResult());
    });
}

function doGreetManyTimes(client) {
    const request = new GreetRequest();
    request.setFirstName('Gustavo');
    const call= client.greetManyTimes(request);
    call.on('data', (response) => {
        console.log(response.getResult());
    }
    );

    call.end();

}

function doGreetEveryone(client) {
    const names= ['Gustavo', 'Martin', 'Ivan', 'Bruno', 'Hernan', 'Franco', 'Nahuel'];
    const call = client.greetEveryone();
    call.on('data', (response) => {
        console.log(response.getResult());
    });

    names.map((name) => {
        return new GreetRequest().setFirstName(name);
    }).forEach((request) => {
        call.write(request);
    });
    
    call.end();
    
}


function doLongGreet(client) {

    const names= ['Gustavo', 'Martin', 'Ivan', 'Bruno', 'Hernan', 'Franco', 'Nahuel'];
    const call = client.longGreet((err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(response.getResult());
    });
    
    names.map((name) => {
        return new GreetRequest().setFirstName(name);
    }).forEach((req) => {
        call.write(req);
    });

    call.end();
    
}


function main() {
    const client = new GreetServiceClient('localhost:50051', grpc.credentials.createInsecure());    
    //doGreet(client);
    //doGreetManyTimes(client);
    //doLongGreet(client);
    doGreetEveryone(client);
    client.close();
}

main();

