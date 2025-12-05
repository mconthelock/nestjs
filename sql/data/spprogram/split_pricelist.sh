#!/bin/bash

FILE="pricelist.sql"
HEADER_LINES=29
TOTAL_INSERTS=18797
PER_FILE=$((TOTAL_INSERTS / 3))

# หาบรรทัดที่มี Insert into
grep -n "Insert into" "$FILE" > insert_lines.tmp

# แบ่งไฟล์ 1/3 แรก
head -n $HEADER_LINES "$FILE" > pricelist_part1.sql
awk -F: "NR<=6266 {print \$1}" insert_lines.tmp | while read line; do
    sed -n "${line}p" "$FILE" >> pricelist_part1.sql
done

# แบ่งไฟล์ 2/3 
head -n $HEADER_LINES "$FILE" > pricelist_part2.sql
awk -F: "NR>6266 && NR<=12532 {print \$1}" insert_lines.tmp | while read line; do
    sed -n "${line}p" "$FILE" >> pricelist_part2.sql
done

# แบ่งไฟล์ 3/3 ส่วนที่เหลือ
head -n $HEADER_LINES "$FILE" > pricelist_part3.sql
awk -F: "NR>12532 {print \$1}" insert_lines.tmp | while read line; do
    sed -n "${line}p" "$FILE" >> pricelist_part3.sql
done

rm insert_lines.tmp

echo "Split completed:"
wc -l pricelist_part*.sql
