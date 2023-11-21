# 33bits React application

## Introduction

33bits is a Farcaster-based application, which uses the zero knowledge proofs to provide a way for anonymous casting. Proofs are
basically Proof-of-Inclusion in Merkle tree.

## Working with zero-knowledge proofs

Current version uses Noir DSL for writing ZK circuits.

```
bash-3.2$ nargo --version
nargo 0.17.0 (git version hash: 86704bad3af19dd03634cbec0d697ff8159ed683, is dirty: false)
```

To compile circuits locally, first install nargo ([docs](https://noir-lang.org/)), then run the following command:

```
cd circuits/
nargo compile
```

## Start locally

First, install the environment variables

```
cp .env.template .env
```

Next, install NodeJS dependencies and run the application

```
yarn
yarn dev
```