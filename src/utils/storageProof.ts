import { ethers } from 'ethers';


// Constants similar to the Rust version
const MAX_TRIE_NODE_LENGTH = 532;
const MAX_STORAGE_VALUE_LENGTH = 32;

export function uint8ArrayToHexArray(buffer: Uint8Array): string[] {
  return Array.from(buffer, byte => '0x' + byte.toString(16).padStart(2, '0'));
}

// TrieProof class mirroring the equivalent Rust struct
class TrieProof {
  key: Uint8Array;
  proof: Uint8Array;
  depth: number;
  value: Uint8Array;

  constructor(key: Uint8Array, proof: Uint8Array, depth: number, value: Uint8Array) {
    this.key = key;
    this.proof = proof;
    this.depth = depth;
    this.value = value;
  }

  // Function to format the TrieProof as a TOML string
  toTomlString(proofName: string): string {
    return `[${proofName}]
key = [${uint8ArrayToHexArray(this.key)}]
proof = [${uint8ArrayToHexArray(this.proof)}]
depth = ${ethers.BigNumber.from(this.depth).toHexString()}
value = [${uint8ArrayToHexArray(this.value)}]`;
  }
}

// Function to fetch and preprocess storage proof
export async function fetchStorageProof(
  provider: ethers.providers.JsonRpcProvider,
  blockNumber: ethers.BigNumber,
  address: string,
  key: string,
  maxDepth: number
): Promise<[Uint8Array, TrieProof]> {
  // Call eth_getProof
  const eip1186pr = await provider.send('eth_getProof', [address, [key], blockNumber.toHexString()]);

  // Get storage proof and storage root
  if (!eip1186pr.storageProof[0]) {
    throw new Error('No storage proof returned');
  }
  const storageProof = eip1186pr.storageProof[0];
  const storageRoot = ethers.utils.arrayify(eip1186pr.storageHash);

  // Preprocess storage proof
  const preprocProof = preprocessProof(
    storageProof.proof.map(ethers.utils.arrayify),
    ethers.utils.arrayify(key),
    ethers.utils.arrayify(storageProof.value),
    maxDepth,
    MAX_TRIE_NODE_LENGTH,
    MAX_STORAGE_VALUE_LENGTH
  );

  return [storageRoot, preprocProof];
}

// Function to preprocess trie proof
function preprocessProof(
  proof: Uint8Array[],
  key: Uint8Array,
  value: Uint8Array,
  maxDepth: number,
  maxNodeLen: number,
  maxValueLen: number
): TrieProof {
  // Calculate depth and pad proof
  let depth = proof.length;
  if (depth > maxDepth) {
    throw new Error(`The depth of this proof (${depth}) exceeds the maximum depth specified (${maxDepth})!`);
  }

  let paddedProof = proof
    .concat(new Array(maxDepth - depth).fill(new Uint8Array()))
    .map(node => {
      if (node.length > maxNodeLen) {
        throw new Error('Node length cannot exceed the given maximum.');
      }
      return Uint8Array.from([...node, ...new Uint8Array(maxNodeLen - node.length)]);
    })
    .reduce((acc, val) => Uint8Array.from([...acc, ...val]), new Uint8Array());

  // Left-pad the value
  let paddedValue = leftPad(value, maxValueLen);

  return new TrieProof(key, paddedProof, depth, paddedValue);
}

// Function to left-pad a byte array
export function leftPad(arr: Uint8Array, len: number): Uint8Array {
  if (arr.length > len) {
    throw new Error('The array exceeds its maximum expected dimensions.');
  }
  return Uint8Array.from([...new Uint8Array(len - arr.length), ...arr]);
}
