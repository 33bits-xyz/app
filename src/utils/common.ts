export const MAX_MESSAGE_LENGTH = 320;


export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
