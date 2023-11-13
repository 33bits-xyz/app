export function stringToHexArray(input: string): string[] {
  // Convert the string to a hexadecimal string
  let hexString = '';
  for (let i = 0; i < input.length; i++) {
      const hex = input.charCodeAt(i).toString(16);
      hexString += hex.padStart(2, '0'); // Ensure two characters for each byte
  }

  const totalLength = 60 * 16; // 16 elements of 60 characters
  hexString = hexString.padEnd(totalLength, '0');

  // Split the hexadecimal string into chunks of 60 characters (30 bytes)
  const chunkSize = 60;
  const hexArray: string[] = [];
  for (let i = 0; i < hexString.length; i += chunkSize) {
      hexArray.push('0x' + hexString.substring(i, Math.min(i + chunkSize, hexString.length)));
  }

  return hexArray;
}

