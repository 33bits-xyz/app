enum SignedKeyState {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
}

  
interface SignedKeyRequestResponse {
    deeplinkUrl: string;
    key: string;
    requestFid: number;
    state: SignedKeyState;
    token: string;
    userFid: undefined | number;
}

interface SignedKeyRequest {
  key: string;
  requestFid: number;
  deadline: number;
  signature: string;
}


interface Channel {
  cast_count_30d: string;
  channel: {
    description: string;
    id: string;
    name: string;
  }
}