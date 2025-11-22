export async function applyDynamicFilters(qb, filters: any, alias: string) {
  if (!filters) return;

  for (const key of Object.keys(filters)) {
    const value = filters[key];
    // Case 1: Nested Relation (e.g., "timeline": { ... })
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Assumption: The alias for the relation is the same as the key (standard TypeORM practice)
      await applyDynamicFilters(qb, value, key);
    }
    // Case 2: Actual Condition (e.g., "INQ_STATUS": ">20")
    else {
      const paramName = `${alias}_${key}_${Math.random().toString(36).substring(7)}`;
      const { sql, params } = await parseCondition(
        alias,
        key,
        value,
        paramName,
      );
      if (sql) {
        qb.andWhere(sql, params);
      }
    }
  }
}

// Helper to translate strings like "> 20 && < 30" into SQL
export async function parseCondition(
  alias: string,
  field: string,
  val: string,
  pName: string,
) {
  const column = `${alias}.${field}`;

  // Range check: "> 20 && < 30"
  if (val.includes('&&')) {
    const [part1, part2] = val.split('&&').map((s) => s.trim());
    const op1 = await extractOp(part1);
    const op2 = await extractOp(part2);

    return {
      sql: `${column} ${op1.op} :${pName}_1 AND ${column} ${op2.op} :${pName}_2`,
      params: { [`${pName}_1`]: op1.val, [`${pName}_2`]: op2.val },
    };
  }

  // LIKE check: "LIKE '445'"
  if (val.toUpperCase().includes('LIKE')) {
    const cleanVal = val
      .replace(/LIKE/i, '')
      .replace(/'/g, '')
      .trim()
      .toUpperCase();
    return {
      sql: `${column} LIKE :${pName}`,
      params: { [pName]: `%${cleanVal}%` }, // Auto-wrapping in % for convenience
    };
  }

  // Standard Operator check: "> 20" or "<= 2025-12-11"
  const opData = await extractOp(val);
  return {
    sql: `${column} ${opData.op} :${pName}`,
    params: { [pName]: opData.val },
  };
}

export async function extractOp(str: string) {
  const operators = ['>=', '<=', '>', '<', '='];
  const op = operators.find((o) => str.startsWith(o)) || '=';
  const val = str.replace(op, '').trim();
  return { op, val };
}
