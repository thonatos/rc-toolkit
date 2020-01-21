import net from 'net';
import debug, { Debugger } from 'debug';
import { encode, decode } from './proto';

import {
  PROTO_CMD,
} from './config';

export default class Base {
  options: IOptions;
  debugger: Debugger;
  instance: any;
  server: net.Server | undefined;
  socket: net.Socket | undefined;

  constructor(options) {
    const { name } = options;
    this.options = options;
    this.debugger = debug(name);
  }

  log(...args) {
    console.log(args);
  }

  pack(handler, payload) {
    const code = Buffer.from(`${handler.code}`);
    const buff = encode(handler.package, payload);
    return Buffer.concat([ code, buff ]);
  }

  unpack(data: Buffer) {
    const code = data.slice(0, 4);
    const payload = data.slice(4);
    const handler = this.getHandler(code.toString());

    if (!handler) {
      throw new Error('not handler');
    }

    return decode(handler.package, payload);
  }

  getHandler(code: string) {
    return Object.values(PROTO_CMD).find(cmd => cmd.code === Number(code.toString()));
  }

  async run() {
    const { type } = this.options;
    this.debugger(type);

    if (type === 'server') {
      const server = await this.runServer();
      return server;
    }

    if (type === 'client') {
      const socket = await this.runClient();
      this.addListener(socket);
      return socket;
    }
  }

  async stop() {
    const { type } = this.options;
    if (type === 'server') {
      this.debugger('stop:server', this.socket && true, this.server && true);
      this.socket && this.socket.destroy();
      this.server && this.server.close();
      return;
    }

    if (type === 'client') {
      this.debugger('stop:client', this.socket && true);
      this.socket && this.socket.destroy();
    }
  }

  addListener(socket: net.Socket) {
    socket.on('data', data => {
      this.debugger('socket:data');
      if (data.toString().endsWith('exit')) {
        socket.destroy();
      } else {
        const message = this.unpack(data);
        this.debugger(message);
      }
    });

    socket.on('close', () => {
      this.debugger('socket:close');
    });

    socket.on('error', err => {
      this.debugger('socket:error', err);
    });
  }

  async runClient(): Promise<net.Socket> {
    const { port, host } = this.options;
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      socket.connect(port, host, () => {
        this.socket = socket;
        this.debugger(`client:connect ${host}:${port}`);
        resolve(socket);
      });
    });
  }

  async runServer(): Promise<net.Server> {
    const { port, host } = this.options;

    return new Promise((resolve, reject) => {
      const server = net.createServer(socket => {
        this.socket = socket;
        this.debugger('server:createServer');
        this.addListener(socket);
      });

      server.listen(port, host, () => {
        this.server = server;
        this.debugger(`server:listening on ${host}:${port}`);
        resolve(server);
      });
    });
  }

  async send() {
    if (!this.socket) {
      return;
    }

    this.debugger('send');

    const user = this.pack(PROTO_CMD.IMPL_UESR, { name: 'Suyi', age: 11 });
    this.debugger(user);
    this.socket.write(user);
    // this.socket.write();

    // const msg = this.pack(PROTO_CMD.IMPL_MSG, { code: 1001, content: 'custom message' });
    // this.debugger(msg);
    // this.socket.write(msg);
  }
}

interface IOptions {
  port: number;
  host: string;
  name: string;
  type: string;
  logLever?: number;
}
