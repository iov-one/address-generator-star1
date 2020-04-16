# IOV Address Generator

[![Build Status](https://travis-ci.com/iov-one/address-generator.svg?branch=master)](https://travis-ci.com/iov-one/address-generator)

Generates addresses for the IOV blockchain.

## Prerequisites

1. [Git](https://git-scm.com/)
2. [Node.js](https://nodejs.org/)
3. [Yarn](https://yarnpkg.com/)

## Use hosted

The app is hosted at https://iov-one.github.io/address-generator/. Please note that various attacks
are possible against hosted passphrase generators and the safest way to generate a passphrase using
this tool is to download the source code and run it locally on a machine which is not connected to
the internet (see below).

## Use locally

1. `git clone https://github.com/iov-one/address-generator.git && cd address-generator`
2. `yarn install && yarn start`
3. Open http://localhost:3000/ in a modern browser (this step does not require an internet
   connection)

## License

This repository is licensed under the Apache License 2.0 (see NOTICE and LICENSE).
