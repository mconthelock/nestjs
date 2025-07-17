# py/entity_generator.py

import os
import re
from utils import map_sql_type_to_typescript_type # Import ฟังก์ชันจาก utils

def parse_sql_create_table(sql_content):
    """
    วิเคราะห์ SQL CREATE TABLE statement เพื่อดึงคอลัมน์ออกมา
    รองรับ SQL ของ Oracle
    """
    columns = []

    # ลบคอมเมนต์แบบบรรทัดเดียว (--)
    sql_content = re.sub(r'--.*$', '', sql_content, flags=re.MULTILINE)

    # ลบคอมเมนต์แบบหลายบรรทัด (/* ... */)
    sql_content = re.sub(r'/\*[\s\S]*?\*/', '', sql_content)

    # ค้นหาชื่อตาราง
    table_name_match = re.search(r'CREATE TABLE\s+(?:[\w."]+\.)?(\w+)\s*\(', sql_content, re.IGNORECASE)
    table_name = table_name_match.group(1) if table_name_match else None # เปลี่ยนเป็น None หากไม่พบ

    # ใช้ regex เพื่อจับคู่แต่ละคอลัมน์
    # ปรับปรุง regex ให้รองรับชนิดข้อมูล Oracle และ constraint เช่น (255), (10,2)
    # และคำว่า "DEFAULT", "NULL", "NOT NULL", "ENABLE", "DISABLE", "CONSTRAINT", "PRIMARY KEY"
    column_pattern = re.compile(
        r'^\s*(\w+)\s+(\w+(?:\s*\(\s*\d+\s*(?:,\s*\d+\s*)?\))?)([^,;]*)(?:,|$)',
        re.MULTILINE | re.IGNORECASE
    )

    lines = sql_content.split('\n')
    in_columns_section = False
    for line in lines:
        line = line.strip()
        if re.match(r'CREATE TABLE\s+\w+\s*\(', line, re.IGNORECASE):
            in_columns_section = True
            continue
        if in_columns_section:
            if line.startswith(')'): # จบส่วนของคอลัมน์
                break

            column_match = column_pattern.match(line)
            if column_match:
                col_name = column_match.group(1).upper() # ชื่อคอลัมน์ใน Oracle มักจะเป็นตัวพิมพ์ใหญ่
                col_type_sql = column_match.group(2)
                constraints = column_match.group(3)

                nullable = True
                if re.search(r'NOT NULL', constraints, re.IGNORECASE):
                    nullable = False

                # ตรวจสอบ PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT ไม่ต้องนำมาสร้างใน @Column() โดยตรง
                if re.search(r'PRIMARY KEY|FOREIGN KEY|UNIQUE|CONSTRAINT|CHECK|DEFAULT', line, re.IGNORECASE):
                    continue # ข้ามบรรทัดที่เป็น constraint หรือ default value

                ts_type = map_sql_type_to_typescript_type(col_type_sql)

                # กำหนด type property ใน ColumnOptions
                column_options = f"{{ type: '{col_type_sql.lower()}'"
                if not nullable:
                    column_options += ", nullable: false"
                else:
                    column_options += ", nullable: true" # เพิ่ม nullable: true ชัดเจน

                # เพิ่ม length/precision/scale ถ้ามี
                type_specifier_match = re.search(r'\(([^)]+)\)', col_type_sql)
                if type_specifier_match:
                    specs = [s.strip() for s in type_specifier_match.group(1).split(',')]
                    if 'varchar' in col_type_sql.lower() or 'char' in col_type_sql.lower():
                        if len(specs) > 0:
                            column_options += f", length: {specs[0]}"
                    elif 'number' in col_type_sql.lower():
                        if len(specs) > 0:
                            column_options += f", precision: {specs[0]}"
                        if len(specs) > 1:
                            column_options += f", scale: {specs[1]}"

                column_options += " }"

                columns.append({
                    'name': col_name,
                    'type_ts': ts_type,
                    'type_sql': col_type_sql.lower(), # เก็บ SQL type เดิมไว้ใน options
                    'nullable': nullable,
                    'column_options': column_options
                })
    return columns, table_name

def create_entity_file(entity_dir, entity_name_pascal, entity_name_kebab, sql_folder_path):
    """
    สร้างไฟล์ entity .entity.ts พร้อมโครงสร้างพื้นฐานของ TypeORM entity
    โดยอ่านโครงสร้างคอลัมน์จากไฟล์ SQL ที่เกี่ยวข้อง
    """
    entity_file_path = os.path.join(entity_dir, f'{entity_name_kebab}.entity.ts')
    sql_file_name = f'{entity_name_kebab}.sql'
    sql_file_path = os.path.join(sql_folder_path, sql_file_name)

    if not os.path.exists(entity_file_path):
        entity_columns_code = ""
        entity_imports = ["Entity", "Column"]
        primary_column_added = False # ตรวจสอบว่าเพิ่ม PrimaryGeneratedColumn ไปแล้วหรือยัง
        table_name = entity_name_kebab.upper() # ชื่อตารางเริ่มต้น

        if os.path.exists(sql_file_path):
            print(f"  - พบไฟล์ SQL: {sql_file_path} กำลังอ่านโครงสร้างคอลัมน์...")
            try:
                with open(sql_file_path, 'r', encoding='utf-8') as f:
                    sql_content = f.read()

                parsed_columns, table_name_from_sql = parse_sql_create_table(sql_content)
                if table_name_from_sql:
                    table_name = table_name_from_sql.upper() # ใช้ชื่อตารางจาก SQL ถ้ามี

                # เพิ่ม @PrimaryGeneratedColumn หรือ @PrimaryColumn
                # (สมมติว่า Primary key คือ 'ID' หรือ 'id' หรือมีการระบุใน SQL)
                primary_key_found_in_sql = False
                for col in parsed_columns:
                    # ตรวจสอบว่าคอลัมน์นี้ถูกระบุเป็น PRIMARY KEY ใน SQL statement หรือไม่
                    # นี่เป็นการตรวจสอบแบบง่ายๆ อาจต้องปรับปรุงให้แม่นยำขึ้นสำหรับ SQL ที่ซับซ้อน
                    if re.search(r'PRIMARY KEY\s*\(\s*' + re.escape(col['name']) + r'\s*\)', sql_content, re.IGNORECASE) or \
                       (col['name'].upper() == 'ID' and re.search(r'PRIMARY KEY', sql_content, re.IGNORECASE) and not re.search(r'PRIMARY KEY\s*\(', sql_content, re.IGNORECASE)):

                        if "PrimaryColumn" not in entity_imports:
                            entity_imports.append("PrimaryColumn")
                        entity_columns_code += f"""
  @PrimaryColumn({col['column_options']})
  {col['name'].lower()}: {col['type_ts']};
"""
                        primary_column_added = True
                        primary_key_found_in_sql = True
                        break # เจอ primary key แล้ว ออกจาก loop

                if not primary_key_found_in_sql: # ถ้าไม่พบ Primary Key ที่ระบุใน SQL
                    if "PrimaryGeneratedColumn" not in entity_imports:
                        entity_imports.append("PrimaryGeneratedColumn")
                    entity_columns_code += f"""
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น
"""
                    primary_column_added = True


                for col in parsed_columns:
                    # ข้ามคอลัมน์ที่เป็น Primary Key ที่เพิ่มไปแล้ว
                    if primary_column_added and (col['name'].upper() == 'ID' or \
                       re.search(r'PRIMARY KEY\s*\(\s*' + re.escape(col['name']) + r'\s*\)', sql_content, re.IGNORECASE)):
                        continue

                    entity_columns_code += f"""
  @Column()
  {col['name'].upper()}: {col['type_ts']};
"""
                # ลบ PrimaryGeneratedColumn ถ้ามี PrimaryColumn (ป้องกันการ import ซ้ำซ้อน)
                if "PrimaryColumn" in entity_imports and "PrimaryGeneratedColumn" in entity_imports:
                    entity_imports.remove("PrimaryGeneratedColumn")


            except Exception as e:
                print(f"  - ข้อผิดพลาดในการอ่านหรือวิเคราะห์ไฟล์ SQL {sql_file_path}: {e}")
                print("  - จะสร้างไฟล์ entity ด้วยโครงสร้างเริ่มต้นแทน")
                entity_imports = ["Entity", "PrimaryGeneratedColumn", "Column"]
                entity_columns_code = f"""
  @PrimaryGeneratedColumn()
  id: number;

  @Column({{ type: 'varchar2', length: 255, nullable: false }})
  name: string;
"""
                table_name = entity_name_kebab.upper() # ชื่อตารางเริ่มต้น

        else:
            print(f"  - ไม่พบไฟล์ SQL: {sql_file_path} จะสร้างไฟล์ entity ด้วยโครงสร้างเริ่มต้น")
            entity_imports = ["Entity", "PrimaryGeneratedColumn", "Column"]
            entity_columns_code = f"""
  @PrimaryGeneratedColumn()
  id: number;

  @Column({{ type: 'varchar2', length: 255, nullable: false }})
  name: string;
"""
            table_name = entity_name_kebab.upper() # ชื่อตารางเริ่มต้น

        imports_str = ", ".join(sorted(list(set(entity_imports)))) # ใช้ set เพื่อให้ไม่ซ้ำและเรียงลำดับ

        content = f"""import {{ {imports_str} }} from 'typeorm';

@Entity('{table_name}')
export class {entity_name_pascal} {{{entity_columns_code}
  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}}
"""
        try:
            with open(entity_file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - สร้างไฟล์ entity: {entity_file_path} เรียบร้อยแล้ว")
        except Exception as e:
            print(f"เกิดข้อผิดพลาดในการสร้างไฟล์ entity {entity_file_path}: {e}")
    else:
        print(f"  - ไฟล์ entity: {entity_file_path} มีอยู่แล้ว ไม่ต้องสร้างใหม่")
