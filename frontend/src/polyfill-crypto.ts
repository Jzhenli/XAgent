// src/polyfill-crypto.ts
// 兼容非安全上下文(HTTP 访问)或旧内核 WebView 下 crypto.randomUUID 缺失的问题
// 本地 localhost 属于安全上下文所以不报错，平板经 HTTP 访问打包产物时 randomUUID 为 undefined
if (typeof window !== 'undefined') {
  const randomUUID = (): `${string}-${string}-${string}-${string}-${string}` => {
    // 优先使用 getRandomValues（非安全上下文下仍然可用，随机性优于 Math.random）
    if (typeof window.crypto?.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}` as `${string}-${string}-${string}-${string}-${string}`;
    }
    // 极端旧内核兜底：Math.random
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
  };

  if (!window.crypto) {
    // 极端旧内核：crypto 对象本身不存在
    (window as any).crypto = { randomUUID };
  } else if (!window.crypto.randomUUID) {
    try {
      Object.defineProperty(window.crypto, 'randomUUID', {
        value: randomUUID,
        writable: true,
        configurable: true,
      });
    } catch {
      // 赋值失败时忽略，避免影响启动
    }
  }
}
