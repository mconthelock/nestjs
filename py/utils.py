# utils.py

import re

def snake_to_pascal(snake_str):
    """
    แปลงสตริง snake_case ให้เป็น PascalCase
    เช่น 'user_profile' -> 'UserProfile'
    """
    return ''.join(word.capitalize() for word in snake_str.split('_'))

def camel_to_pascal(camel_str):
    """
    แปลงสตริง camelCase ให้เป็น PascalCase
    เช่น 'userProfile' -> 'UserProfile'
    """
    return camel_str[0].upper() + camel_str[1:]

def pascal_to_kebab(pascal_str):
    """
    แปลงสตริง PascalCase ให้เป็น kebab-case
    เช่น 'UserProfile' -> 'user-profile'
    """
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', pascal_str)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

def map_sql_type_to_typescript_type(sql_type):
    """
    แมปชนิดข้อมูล SQL (Oracle) ไปยังชนิดข้อมูล TypeScript
    """
    sql_type = sql_type.lower()
    if 'number' in sql_type or 'int' in sql_type or 'float' in sql_type or 'double' in sql_type or 'decimal' in sql_type:
        return 'number'
    elif 'varchar' in sql_type or 'char' in sql_type or 'clob' in sql_type or 'text' in sql_type:
        return 'string'
    elif 'date' in sql_type or 'timestamp' in sql_type:
        return 'Date'
    elif 'boolean' in sql_type: # Oracle มักใช้ NUMBER(1) หรือ CHAR(1) สำหรับ boolean
        return 'boolean'
    elif 'blob' in sql_type:
        return 'Buffer' # หรือ string/other based on how you handle BLOBs
    return 'any' # ค่าเริ่มต้นหากไม่รู้จัก
