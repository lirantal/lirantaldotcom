---
title: Securing a Node.js + RethinkDB + TLS setup on Docker containers
description: Intro
date: '2017-08-10T15:38:52.872Z'
categories: []
keywords: []
tags: []
slug: securing-a-node-js-rethinkdb-tls-setup-on-docker-containers-84413d32dd39
pubDate: '2017-08-10T15:38:52.872Z'
image: ~/assets/images/blog/aa94d253ebca1fc4de411fe7cef17400.jpeg
---

![](/images/blog/1__C64ZrPVIob7heHW9At28Dw.jpeg)

### Intro

We use RethinkDB at work across different projects. It isn’t used for any sort of big-data applications, but rather as a NoSQL database, which spices things up with real-time updates, and relational tables support.

### Node.js Ecosystem

RethinkDB features an officially supported Node.js driver, as well as a community-maintained driver as well called **rethinkdbdash** which is promises-based, and provides connection pooling.

There is also a database migration tool called **rethinkdb-migrate** that aids in managing database changes such as schema changes, database seeding, tear up and tear down capabilities.

### RethinkDB Docker Setup

We’re going to use the official RethinkDB docker image from the docker hub and make use of **docker-compose.yml** to spin it up (later on you can add additional services to this setup).

A fair example for **docker-compose.yml**:

version: '2'

services:

  rethinkdb:  
    image: rethinkdb:latest  
    ports:  
      - "8181:8080"  
      - "48015:28015"  
    volumes:  
      - ./tls:/tls

### RethinkDB SSL Setup

The compose file mounts a local **tls** directory as a mapped volume inside the container. The **tls/** directory will contain our cert files, and the compose file is reflecting this.

### Certificates

To setup a secure connection we need to facilitate it using certificates so an initial technical step:

cd tls/

openssl genrsa -out key.pem 2048

openssl req -new -x509 -key key.pem -out cert.pem -days 3650 -subj '/CN=domain.com’

cp cert.pem ca.pem

Important notes:

*   The canonical name, which is the CN value is set to the domain to which the RethinkDB driver will connect to. Set here to domain.com as an example, **in your local development environment should probably be set to just localhost**.
*   Copying the cert to the certificate authority is actually an extra step required for slaves joining the cluster, so this isn’t mandatory.

### Start RethinkDB with SSL

Update the compose file to include a _command_ configuration that starts the RethinkDB process with all the required SSL configuration

command: \["rethinkdb", "--tls-min-protocol", "TLSv1", "--tls-ciphers", "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH:AES256-SHA", "--canonical-address", "domain.com", "--http-tls-key", "/tls/key.pem", "--http-tls-cert", "/tls/cert.pem", "--driver-tls-key", "/tls/key.pem", "--driver-tls-cert", "/tls/cert.pem", "--bind" ,"all"\]

Important notes:

*   The first command arguments — _tls-min-protocol_ and _— tls-ciphers_ are for working with older SSL versions (applicable to Mac OS setups)
*   Notice the _— canonical-address_ argument is also set to _domain.com_, and you might want to change that to localhost if you created the self-signed cert with a _CN=localhost_

You’ll notice there isn’t any cluster related configuration but you can add them as well if you need to so they can join the SSL connection: _— cluster-tls — cluster-tls-key /tls/key.pem — cluster-tls-cert /tls/cert.pem — cluster-tls-ca /tls/ca.pem_

### Node.js Driver Setup

The RethinkDB drivers support an _ssl_ optional object which either sets the certificate using the _ca_ property, or sets the _rejectUnauthorized_ property to accept or reject self-signed certificates when connecting.

A snippet for the ssl configuration to pass to the driver:

ssl: {  
  rejectUnauthorized: false  
  // ca: fs.readFileSync(\_\_dirname + '../tls/cert.pem').toString().trim()  
}

### RethinkDB Password Setup

Now that the connection is secured, it only makes sense to connect using a user/password which are not the default.

> Security Alert! RethinkDB ships with a default user and no password set which is insecure to say the least and was one of the main reasons for hundred of thousands of MongoDBs getting pwned on AWS a while back.

> PLEASE CHANGE THE DEFAULT USER ACCOUNT

To set it up, update the compose file to also include the _— initial-password_ argument so you can set the default _admin_ user’s password. For example:

command: \["rethinkdb", "--initial-password", "changeMe"\]

Of course you need to append this argument to the rest of the command line options in the above compose file.

> Preferably, don’t store the password on the Dockerfile but rather use an environment variable or another method that doesn’t expose secrets.

Now, update the Node.js driver settings to use a user and password to connect:

{  
  user: 'admin',  
  password: 'changeMe'  
}

Congratulations! You’re now eligible to “Ready for Production” stickers.

Don’t worry, I already mailed them to your address.