export function extractData(
  data: number[][]
): { timestamp: number, root: string, message: string } {
  console.log(Buffer.from(data[0]));
  // Extract timestamp
  const timestamp = parseInt(Buffer.from(data[0]).toString());

  // Extract Merkle tree root
  const root = '0x' + Buffer.from(data[1]).toString('hex');

  // Extract message
  const messageArrays = data.slice(2);
  // @ts-ignore
  const messageBytes = [].concat(...messageArrays);
  const message = messageBytes.map(byte => String.fromCharCode(byte)).join('').replace(/\0/g, '');

  return { timestamp, root, message };
}
