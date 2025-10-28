// prettier-ignore
const THAI_NUMBERS: string[] = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
// prettier-ignore
const THAI_UNITS: string[] = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
export async function convertNumberToBahtText(inputNumber: number | string) {
  const number = intVal(inputNumber);
  if (isNaN(number)) return 'ศูนย์บาทถ้วน';
  if (number === 0) return 'ศูนย์บาทถ้วน';
  const numStr = number.toFixed(2);
  const [integerStr, decimalStr] = numStr.split('.');
  const thaiIntegerText = await processInteger(integerStr);
  const thaiDecimalText = await processDecimal(decimalStr);

  //   thaiIntegerText;

  if (integerStr === '0' && thaiDecimalText) {
    return thaiDecimalText;
  } else if (integerStr !== '0' && !thaiDecimalText) {
    return thaiIntegerText + 'บาทถ้วน';
  } else {
    return thaiIntegerText + 'บาท' + thaiDecimalText;
  }
}

async function processInteger(integerStr: string) {
  if (integerStr === '0') return 'ศูนย์';
  let thaiText = '';
  const millionUnit = THAI_UNITS[6];
  const length = integerStr.length;

  // แบ่งสตริงตัวเลขทีละ 6 หลัก (หน่วยล้าน) จากด้านขวา
  const blocks: string[] = [];
  let tempInt = integerStr;
  while (tempInt.length > 0) {
    blocks.unshift(tempInt.length > 6 ? tempInt.slice(-6) : tempInt);
    tempInt = tempInt.length > 6 ? tempInt.slice(0, -6) : '';
  }

  // วนลูปประมวลผลทีละบล็อก (ทีละล้าน)
  for (const [index, block] of blocks.entries()) {
    const blockNum = parseInt(block, 10);
    if (blockNum > 0) {
      thaiText += await convertBlock(blockNum);
      if (index < blocks.length - 1) {
        thaiText += millionUnit;
      }
    }
  }
  return thaiText;
}

async function processDecimal(decimalStr: string) {
  const decimalNum = parseInt(decimalStr, 10);
  if (decimalNum === 0) {
    return '';
  }
  return (await convertBlock(decimalNum)) + 'สตางค์';
}

async function convertBlock(num: number) {
  let text = '';
  const sNum = String(num);
  const len = sNum.length;
  for (let i = 0; i < len; i++) {
    const digit = parseInt(sNum[i]);
    const unitIndex = len - 1 - i;
    if (digit === 0) continue;
    if (unitIndex === 1) {
      if (digit === 1)
        text += ''; // ไม่ต้องเติม 'หนึ่ง' (เช่น 10, 11)
      else if (digit === 2) text += 'ยี่';
      else text += THAI_NUMBERS[digit];
      text += THAI_UNITS[1]; // 'สิบ'
    } else if (unitIndex === 0) {
      // หลักหน่วย
      if (digit === 1 && len > 1)
        text += 'เอ็ด'; // 'เอ็ด' (เช่น 11, 21)
      else text += THAI_NUMBERS[digit];
    } else {
      // หลักอื่นๆ (ร้อย, พัน, หมื่น, แสน)
      text += THAI_NUMBERS[digit] + THAI_UNITS[unitIndex];
    }
  }
  return text;
}

export const intVal = function (i: number | string): number {
  return typeof i === 'string'
    ? parseFloat(i.replace(/[\$,]/g, ''))
    : typeof i === 'number'
      ? i
      : 0;
};

export const digitsNumber = function (n, digit) {
  if (!digit) digit = 0;
  n = intVal(n);
  n = n.toFixed(digit);
  var str = n.toString().split('.');
  var num1 = isNaN(str[0])
    ? 0
    : str[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  var num2 = str[1] === undefined ? '00' : str[1];
  return num1 + '.' + num2;
};
