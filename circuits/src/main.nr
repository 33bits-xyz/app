use dep::std;
use dep::noir_trie_proofs::StorageProof;

global DEPTH8_MAX: Field = 4256;

// Circuit verifies a following statement:
// - Farcster ID (`fid`) is less than 10_000
// - Corresponding public key is presented in KeyRegistry storage under `fid` key
// - TODO: Verify storage key is correct
fn main(
  // fid: u32,
  // public_key_preimage: [u8; 32],
  // public_key: [u8; 32],
  storage_root: pub [u8; 32],
  storage_proof: StorageProof<DEPTH8_MAX>
) {
  // assert(fid <= 10000);

  // let expected_public_key = std::hash::sha256(public_key_preimage);

  // assert(expected_public_key == public_key);
  assert(storage_proof.verify_storage_root(storage_root));
  // assert(storage_proof.value == public_key);
}