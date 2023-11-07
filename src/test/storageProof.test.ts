import { ethers } from 'ethers';
import { Buffer } from "buffer"; 
import { fetchStorageProof, uint8ArrayToHexArray } from '../utils/storageProof.ts';



// Example usage:
// You need to replace 'your_rpc_url' with your actual Ethereum node RPC URL
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/025cc47d54d74cecb85620f068ca2c87');
const blockNumber = ethers.BigNumber.from('14194126');
const storageKey = '0xbbc70db1b6c7afd11e79c0fb0051300458f1a3acb8ee9789d9b6b26c61ad9bc7'; // Replace with actual storage key
const accountAddress = '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'; // Replace with actual account address
const maxDepth = 8; // Specify your maximum depth


fetchStorageProof(provider, blockNumber, accountAddress, storageKey, maxDepth)
  .then(([storageRoot, trieProof]) => {
    console.log(`storage_root=[${uint8ArrayToHexArray(Uint8Array.from(Buffer.from(storageRoot)))}]`);
    console.log(trieProof.toTomlString('storage_proof'));
  })
  .catch(error => {
    console.error('Error fetching storage proof:', error);
  });
