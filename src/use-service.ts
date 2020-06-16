import { useRef } from 'react';
import { useForceUpdate } from './use-force-update';

export function useService<T>(schema: new () => T): T {
  const ref = useRef<T>();
  const sync = useForceUpdate();
  if (!ref.current) {
    // Parse schema very very primitive
    const proto = schema.prototype;
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    const constructorFunctionBody = proto.constructor.toString();
    const compileTimeKeys = Object.keys(descriptors).filter(
      prop => prop !== 'constructor'
    );
    const runTimeKeysRegExp = RegExp('this\\.([a-z0-9_]+)', 'gi');
    const runTimeKeysRegExpMatch = constructorFunctionBody.matchAll(
      runTimeKeysRegExp
    );
    const runTimeKeys = [...runTimeKeysRegExpMatch].map(match => match[1]);
    const keys = [...new Set([...compileTimeKeys, ...runTimeKeys])];

    // Create a very very primitive connector
    const Connector = class extends (schema as any) {};
    keys.forEach(key => {
      Object.defineProperty(Connector.prototype, key, {
        get: function(this: any) {
          if (typeof this['_' + key] !== 'undefined') {
            return this['_' + key];
          }
          const source = this.__proto__.__proto__[key];
          if (typeof source === 'function') {
            return (this['_' + key] = (...args: any) => {
              const ret = source.apply(this, args);
              sync();
              return ret;
            });
          }
          throw new Error('Unsupported yet');
        },
        set: function(value) {
          this['_' + key] = value;
          sync();
        }
      });
    });

    ref.current = new Connector() as T;
  }
  return ref.current;
}
