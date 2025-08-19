export const normalizeSqlAliases = (sql: string): any => {
  const aliasMap = {};
  if (!/^\s*select\b/i.test(sql)) return sql;
  if (!/\bjoin\b/i.test(sql)) return sql;

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stripQuotes = (s) => {
    if (!s) return s;
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
    return s;
  };

  let idx = 1;

  sql = sql.replace(
    /\b(from|join)\s+("?[A-Za-z0-9_.]+"?)\s+(?:as\s+)?("?[A-Za-z0-9_]+"?)/gi,
    (m, clause, table, alias) => {
      const oldAliasRaw = stripQuotes(alias);
      const newAlias = `T${idx++}`;
      aliasMap[oldAliasRaw] = newAlias;
      return `${clause} ${table} ${newAlias}`;
    },
  );

  for (const oldAliasRaw in aliasMap) {
    const newAlias = aliasMap[oldAliasRaw];
    const esc = escapeRegExp(oldAliasRaw);
    const re = new RegExp(`(^|[^\\w"])"?${esc}"?(?=\\.)`, 'gi');
    sql = sql.replace(re, (match, pre) => `${pre}${newAlias}`);
  }

  const selMatch = sql.match(/^\s*select\s+([\s\S]*?)\s+from\s/iu);
  if (selMatch) {
    const selectList = selMatch[1];
    let newSelectList = selectList;
    const colRe =
      /("?T\d+"?)\s*\.\s*"?([A-Za-z0-9_]+)"?\s*(?:as\s+|)?("?([A-Za-z0-9_]+)"?)?(?=\s*(,|$))/gi;

    newSelectList = newSelectList.replace(
      colRe,
      (match, tAlias, col /* <= group 2 */, aliasWithQuote, alias) => {
        if (alias && /^[a-f0-9]{29}$/i.test(alias)) {
          const aliasToken = String(tAlias).replace(/"/g, '');
          return `${tAlias}."${col}" AS "${aliasToken}${col}"`;
        } else {
          return `${tAlias}."${col}" AS "${alias}"`;
        }
      },
    );
    sql = sql.replace(selectList, newSelectList);
  }
  return sql;
};

export function extractSubqueries(sql) {
  const subqueries = [];
  const regex = /\((\s*select[\s\S]+?)\)/gi;
  let match;
  while ((match = regex.exec(sql)) !== null) {
    subqueries.push({
      full: match[0],
      inner: match[1],
    });
  }
  return subqueries;
}
