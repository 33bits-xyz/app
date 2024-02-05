use dep::std;




// This circuit verifies a following statement:
// - Farcster ID (`fid`) is less than 10_000
// - `public_key_preimage` is a preimage of the `public_key`
fn main(
  fid: Field,
  timestamp: pub u64,
  public_key_preimage: Field,
  public_key: Field,
  // Merkle membership proof
  note_root: pub Field,
  index: Field,
  note_hash_path: [Field; 16],
  // Message
  message: pub [Field; 16],
  // Reply cast id
  reply: pub [Field; 4]
) -> pub ([Field; 16], u64, [Field; 4]) {
  let expected_public_key = std::hash::mimc_bn254([public_key_preimage]);

  assert(expected_public_key == public_key);

  // assert(public_key == expected_public_key);
  let commitment = std::hash::mimc_bn254([fid, public_key]);

  // Check that the input note commitment is in the root
  let new_root = compute_root_from_leaf(commitment, index, note_hash_path);
  assert(new_root == note_root);

  (message, timestamp, reply)
}


// Returns the root of the tree from the provided leaf and its hashpath, using mimc hash
fn compute_root_from_leaf(leaf : Field, index : Field, hash_path: [Field; 16]) -> Field {
    let n = hash_path.len();
    let index_bits = index.to_le_bits(n as u32);
    let mut current = leaf;
    for i in 0..n {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };

        current = std::hash::mimc_bn254([hash_left, hash_right]);
    };
    current
}