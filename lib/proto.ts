import protoRoot from '../proto/proto.js';

export const encode = (handler, payload) => {
  const Message = protoRoot.lookup(handler);

  const errMsg = Message.verify(payload);

  if (errMsg) {
    throw new Error(errMsg);
  }

  const message = Message.create(payload);
  const buffer = Message.encode(message).finish();

  return buffer;
};

export const decode = (handler, buffer) => {
  const Message = protoRoot.lookup(handler);
  const message = Message.decode(buffer);
  return Message.toObject(message);
};
