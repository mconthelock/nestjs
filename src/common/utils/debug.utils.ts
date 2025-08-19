export function logQuery(query: { getQueryAndParameters: () => [string, any[]] }) {
    const [sql, params] = query.getQueryAndParameters();
    console.log('SQL:', sql);
    console.log('Params:', params);
}