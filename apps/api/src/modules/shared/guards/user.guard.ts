import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, { args }: any) => {
  // Request.args contains the request and response.
  const [request] = args;
  if (request.user) {
    return data ? request.user[data] : request.user;
  }
  return undefined;
});
