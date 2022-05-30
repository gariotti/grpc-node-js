const pb = require('../proto/greet_pb');

exports.greet = (call, callback) => {
    const response = new pb.GreetResponse();
    response.setResult('Hello ' + call.request.getFirstName());
    callback(null, response);
}

exports.greetManyTimes = (call, _) => {
    const response = new pb.GreetResponse();
    
    for (let i = 0; i < 10; i++) {
        const result = `Hello ${call.request.getFirstName()} ${i}`;
        response.setResult(result);
        call.write(response);
    }
    
    call.end();
}


exports.longGreet = (call, callback) => {
    const response = new pb.GreetResponse();

    let greet = '';
    
    call.on('data', (request) => {
        greet += 'Hello ' + request.getFirstName() + '\n';
    }); 
    
    call.on('end',() => {
        response.setResult(greet);
        callback(null, response);
    });
}

exports.greetEveryone = (call, _) => {
    
    call.on('data', (request) => {
        console.log('received:' + request);
        const response= new pb.GreetResponse();
        response.setResult('Hello ' + request.getFirstName());
        call.write(response);
        console.log('sent:' + response);
    });

    call.on('end', () => {
        call.end();
    });
}