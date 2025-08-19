export function numberToAlphabetRevision(revision: number): string {
    if (revision <= 0) return '';
    let result = '';
    let num = revision;
    while (num > 0) {
        num--; // Adjust for 0-indexing
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26);
    }
    return result;
}