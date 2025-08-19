export function getSafeFields(fields: string[], allowed: string[]): string[] {
  return fields.filter((f) => allowed.includes(f));
}

export const mapAliasesToFields = (
  data: Record<string, any>[],
): Record<string, any>[] =>
  data.map((item) => {
    const mappedItem = Object.entries(item).reduce(
      (acc, [key, value]) => {
        const newKey = key.includes('_')
          ? key.substring(key.indexOf('_') + 1)
          : key;
        acc[newKey] = value;
        return acc;
      },
      {} as Record<string, any>,
    );
    return mappedItem;
  });

  /**
   * select fields หากใช้ find, findOne ไม่รองรับ query builder
   * @param fields 
   * @param fieldDefault 
   * @returns 
   * @note ตัวอย่างดูได้ที่ escs/user/user.service.ts
   * @example
   *private fieldDefault = {
        USR_ID: true,
        USR_NO: true,
        USR_NAME: true,
        USR_EMAIL: true,
        USR_REGISTDATE: true,
        USR_USERUPDATE: true,
        USR_DATEUPDATE: true,
        GRP_ID: true,
        USR_STATUS: true,
        SEC_ID: true,
        user: {
          SEMPNO: true,
          SNAME: true,
          SRECMAIL: true,
          SSECCODE: true,
          SSEC: true,
          SDEPCODE: true,
          SDEPT: true,
          SDIVCODE: true,
          SDIV: true,
          SPOSCODE: true,
          SPOSNAME: true,
          SPASSWORD1: true,
          CSTATUS: true,
          SEMPENCODE: true,
          MEMEML: true,
          STNAME: true,
        }
    };

    fields = ['USR_ID', 'USR_NO', 'SNAME'];

    const selected = getSelectNestedFields(fields, this.selectfields);
   */
export function getSelectNestedFields(fields: string[], fieldDefault: object): object
{
  let selected = {};
  if (fields && fields.length > 0) {
    for (const f in fieldDefault) {
      if (fields.includes(f)) {
        selected[f] = true;
      }
      if (typeof fieldDefault[f] === 'object') {
        for (const subf in fieldDefault[f]) {
          // subf ก็ยังเป็น string
          if (fields.includes(subf)) {
            if (!selected[f]) selected[f] = {}; // สร้าง object ถ้า f ยังไม่เคยสร้าง
            selected[f][subf] = true;
          }
        }
      }
    }
  } else {
    selected = this.selectfields;
  }
  return selected;
}

