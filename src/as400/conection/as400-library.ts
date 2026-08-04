export const AS400_DEBUG_LIBRARY = 'DBGDEV14';

export function getAs400Library(value = process.env.AS400_LIBRARY) {
    const library = (value || 'RTNLIBF').trim().toUpperCase();
    if (!/^[A-Z@$#][A-Z0-9_@$#]{0,9}$/.test(library)) {
        throw new Error(`Invalid AS400_LIBRARY: ${library}`);
    }
    return library;
}
