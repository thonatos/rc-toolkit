import { sleep } from 'mz-modules';
import RC from '../index';

jest.setTimeout(10 * 1000 * 60);

describe('index.test.ts', () => {

  const options = {
    host: '127.0.0.1',
    port: 6969,
  };

  let server;

  beforeAll(async () => {
    server = new RC({
      name: 'TCP:SERVER',
      type: 'server',
      ...options,
    });

    await server.run();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('connect to server', async () => {
    const client = new RC({
      name: 'TCP:CLIENT',
      type: 'client',
      ...options,
    });

    await client.run();
    await client.send();
    await sleep(5 * 1000);
    await client.stop();
  });
});
