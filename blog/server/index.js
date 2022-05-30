const grpc = require('@grpc/grpc-js')
const serviceImpl = require('./service_impl');
const {BlogServiceService} = require('../proto/blog_grpc_pb');
const {MongoClient} = require('mongodb');


const addr = 'localhost:50051';

const uri='mongodb://root:root@localhost:27017/';
const mongoClient=new MongoClient(uri,{useNewUrlParser:true});

global.collection= undefined;

async function cleanup(server) {
    console.log('Cleanup');
    if (server) {
        await mongoClient.close();
        server.forceShutdown();
    }
}


async function main() {
    const server = new grpc.Server();

    process.on('SIGINT', () => { console.log('Interrupted by signal'); cleanup(server); });


    await mongoClient.connect();

    const database=mongoClient.db('blogdb');
    collection=database.collection('blog');
    
    server.addService(BlogServiceService, serviceImpl);
    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, _) => {
        if (err) {
            console.log(err);
            return cleanup(server);
        }

        server.start();

    });

    console.log('Server running at:', addr);
}

main().catch(cleanup());