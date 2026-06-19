// pdf-stamp.helper.ts

export class Optiongetdata {
  static getStampName(vapvno: string, fullname: string): string {
    const name = String(fullname || '').trim();
    if (!name) { return ''; }

    const parts = name.split(/\s+/);

    if (String(vapvno || '').toUpperCase().startsWith('J')) {
      return parts.length >= 2 ? parts[1] : parts[0];
    }

    return parts[0];
  }

  static getStampDate(value: any): string {
    if (!value) { return ''; }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) { return ''; }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(',', '');
  }
}