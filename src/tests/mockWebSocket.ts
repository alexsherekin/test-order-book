export class MockWebSocket implements WebSocket {
  binaryType!: BinaryType;
  bufferedAmount!: number;
  extensions!: string;
  onclose!: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onerror!: ((this: WebSocket, ev: Event) => any) | null;
  onmessage!: ((this: WebSocket, ev: MessageEvent<any>) => any) | null;
  onopen!: ((this: WebSocket, ev: Event) => any) | null;
  protocol!: string;
  readyState!: number;
  url!: string;
  close(code?: number, reason?: string): void {
    throw new Error('Method not implemented.');
  }
  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
    throw new Error('Method not implemented.');
  }
  readonly CLOSED!: number;
  readonly CLOSING!: number;
  readonly CONNECTING!: number;
  readonly OPEN!: number;
  addEventListener<K extends 'close' | 'error' | 'message' | 'open'>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: any, listener: any, options?: any) {
    throw new Error('Method not implemented.');
  }
  removeEventListener<K extends 'close' | 'error' | 'message' | 'open'>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: any, listener: any, options?: any) {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }
}
