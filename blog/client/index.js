const grpc = require('@grpc/grpc-js')
const { BlogServiceClient } = require('../proto/blog_grpc_pb');
const { Blog, BlogId } = require('../proto/blog_pb');
const { DATA, ERROR, END } = require('../../constants');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');


function createBlog(client) {
  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setAuthorId('Clement')
      .setTitle('Hello')
      .setContent('Hello world');

    client.createBlog(req, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.getId());
    });

  });
}

function readBlog(client, id) {

  return new Promise((resolve, reject) => {
    const req = new BlogId().setId(id);

    client.readBlog(req, (err, res) => {
      if (err) {
        reject(err);
      }

      console.log(`Blog was read: ${res}`);
      resolve();
    });
  });
}


function updateBlog(client, id) {
  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setId(id)
      .setAuthorId('not Clement')
      .setTitle('My First Blog (edited)')
      .setContent('Content of the first blog, with some awesome additions!');

    client.updateBlog(req, (err, _) => {
      if (err) {
        reject(err);
      }

      console.log('Blog was updated!');
      resolve();
    });
  });
}

function listBlogs(client) {
  return new Promise((resolve, reject) => {
    const req = new Empty();

    const call = client.listBlogs(req);

    call.on(DATA, (res) => {
      console.log(res);
    });

    call.on(ERROR, (err) => {
      reject(err);
    });

    call.on(END, () => {
      resolve();
    });
  });
}

function deleteBlog(client, id) {

  return new Promise((resolve, reject) => {
    const req = new BlogId().setId(id);

    client.deleteBlog(req, (err, _) => {
      if (err) {
        reject(err);
      }

      console.log(`Blog was deleted!`);
      resolve();
    });
  });
}



async function main() {
  const client = new BlogServiceClient('localhost:50051', grpc.credentials.createInsecure());

  const id = await createBlog(client);

  console.log(id);

  await readBlog(client, id);

  await updateBlog(client, id);

  //await readBlog(client, id);

  await listBlogs(client);
  await deleteBlog(client, id);

  client.close();
}

main();

