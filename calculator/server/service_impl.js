const {SumResponse} = require('../proto/sum_pb');
const {PrimeResponse} = require('../proto/primes_pb');
const {AvgResponse} = require('../proto/avg_pb');
const {MaxResponse} = require('../proto/max_pb');
const {SqrtResponse} = require('../proto/sqrt_pb');
const grpc= require('@grpc/grpc-js');

exports.sum = (call, callback) => {
    const response = new SumResponse();
    response.setResult(call.request.getFirstNumber() + call.request.getSecondNumber());
    callback(null, response);
}

exports.primes = (call, _) => {
    const response = new PrimeResponse();
    
    let number= call.request.getNumber();
    let divisor=2;

    while (number > 1) {
        while (number % divisor === 0) {
            response.setResult(divisor);
            call.write(response);
            number /= divisor;
        }
        divisor++;
    }
    
    call.end();
}


exports.sqrt = (call, callback) => {
    const response = new SqrtResponse();
    const number=call.request.getNumber();

    if (number < 0) {
        callback({code: grpc.status.INVALID_ARGUMENT, details: 'number must be non-negative'});
    }

    response.setResult(Math.sqrt(number));

    callback(null, response);
}


exports.avg = (call, callback) => {
   let count = 0.0;
   let total = 0.0;

   call.on('data', (req) => {
        total += req.getNumber();
        ++count;
   });

   call.on('end', () => {
        const response = new AvgResponse();
        response.setResult(total / count);
        callback(null, response);
   });

}


exports.max = (call, _) => {
    

    let max = 0;

    call.on('data', (request) => {
        console.log('received:' + request);

        const number= request.getNumber();

        if (number > max) {
            const response = new MaxResponse();
            response.setResult(number);
            call.write(response);
            max = number;
            console.log('sent:' + response);
        }
        
        
    });

    call.on('end', () => {
        call.end();
    });
}