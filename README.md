# 33bits React application

33bits is a Farcaster-based application, which uses the zero knowledge proofs to provide a way for anonymous casting.

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

## Why not use storage proofs?

First version of the application was made to work with storage proofs. We've used [noir-trie-proofs](https://github.com/aragonzkresearch/noir-trie-proofs), a library made by Aragon and Noir with the support of Nouns DAO. Unfortunatelly, the implementation resulted in almost 2m gates,
which means that proofs can't be generated in browser due to the RAM limitations.

## Why use MiMC hash instead of EDDSA public key?

The main reason for that is user experience - generating proofs for EDDSA operations such as public key derivation, would take longer
then verifiying MiMC hash function.

Another reason is security. Since signer's public key is not a "real" public key, then it can't be used for signing messages.
So even if private key is stolen, attacker still can't use it to cast messages on user's behalf.

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