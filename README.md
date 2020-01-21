# Remote-Control Toolkit

Remote-Control Server with protobuf.js .

## Protocal

```bash
header
-------------------------------
  4B: PROTO_ID
  8B: BODY_LENGTH

body data
-------------------------------
  PROTOBUF
```

## Usage

```typescript
import RC from 'rc-toolkit';

const const options = {
  host: '127.0.0.1',
  port: 6969,
};



(async() => {
  const server = new RC({
    name: 'TCP:SERVER',
    type: 'server',
    ...options,
  });

  await server.run();

  const client = new RC({
    name: 'TCP:CLIENT',
    type: 'client',
    ...options,
  });

  await client.run();
  await client.send();
  await sleep(5 * 1000);
  await client.stop();
})();
```
