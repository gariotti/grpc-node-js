const grpc = require('@grpc/grpc-js')
const { CalculatorServiceClient } = require('../proto/calculator_grpc_pb');
const { SumRequest } = require('../proto/sum_pb');
const { PrimeRequest } = require('../proto/primes_pb');
const { AvgRequest } = require('../proto/avg_pb');
const { MaxRequest } = require('../proto/max_pb');
const { SqrtRequest } = require('../proto/sqrt_pb');


function doSum(client) {
    const request = new SumRequest();
    request.setFirstNumber(1);
    request.setSecondNumber(2);
    client.sum(request, (err, response) => {
        if (err) {
            return console.log(err);
        } else {
            return console.log(response.getResult());
        }

    });
}


function doSqrt(client, number) {
    const request = new SqrtRequest();
    request.setNumber(number);

    client.sqrt(request, (err, response) => {
        if (err) {
            return console.log(err);

        } else {
            return console.log(response.getResult());
        }
    });
}


function doAvg(client) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const call = client.avg((err, res) => {
        if (err) {
            return console.log(err);
        } else {
            return console.log(response.getResult());
        }
    });

    numbers.map((number) => {

        return new AvgRequest().setNumber(number);

    }).forEach((req) => call.write(req));

    call.end();

}

function doMax(client) {
    const numbers = [41, 23, 356, 466, 58, 6666, 77, 8, 7779, 4410];
    const call = client.max();
    call.on('data', (response) => {
        console.log(response.getResult());
    });

    numbers.map((name) => {
        return new MaxRequest().setNumber(name);
    }).forEach((request) => {
        call.write(request);
    });

    call.end();

}

function doPrimes(client) {
    const request = new PrimeRequest();
    request.setNumber(21);
    const call = client.primes(request);
    call.on('data', (response) => {
        console.log(response.getResult());
    }
    );
    call.end();
}

function main() {
    const client = new CalculatorServiceClient('localhost:50051', grpc.credentials.createInsecure());
    //doSum(client);
    //doPrimes(client);
    //doAvg(client);
    //doMax(client);
    //doSqrt(client,25);
    doSqrt(client, -3);
    client.close();
}

main();

