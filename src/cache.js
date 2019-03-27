const cache = {};

const useMemo = async (name, fn) => {
    if (name in cache) return cache[name];
    const result = await fn();
    cache[name] = result;
    return result;
};

export default useMemo;
