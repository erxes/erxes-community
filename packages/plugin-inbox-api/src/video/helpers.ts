import { debugError } from '@packages/core/src/debuggers';

export const routeErrorHandling = (fn, callback?: any) => {
  return async (req, res, next): Promise<any> => {
    try {
      await fn(req, res, next);
    } catch (e) {
      if (callback) {
        return callback(res, e, next);
      }

      debugError(e.message);

      return next(e);
    }
  };
};
