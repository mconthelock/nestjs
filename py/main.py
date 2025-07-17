import os
import sys
from file_modifiers import modify_module_file, modify_service_file, modify_controller_file, modify_dto_files
from entity_generator import create_entity_file
from utils import snake_to_pascal, camel_to_pascal # เพิ่ม camel_to_pascal สำหรับ main

def main():
    """
    ฟังก์ชันหลักสำหรับดำเนินการแก้ไขไฟล์
    """
    print("--- NestJS TypeORM Resource Configurator ---")
    print("โปรดตรวจสอบให้แน่ใจว่าคุณได้สร้าง resource ด้วย Nest CLI แล้ว (เช่น 'nest g resource users')")

    resource_location = input("ป้อนที่ตั้งของ resource (เช่น src/users): ").strip()
    if not resource_location:
        print("ที่ตั้ง resource ไม่สามารถว่างเปล่าได้")
        sys.exit(1)

    # ตรวจสอบว่า resource_location มี 'src/' นำหน้าหรือไม่ ถ้าไม่มีให้เพิ่ม
    if not resource_location.startswith('src/'):
        resource_location = os.path.join('src', resource_location)

    # แยกชื่อ resource จาก path
    resource_name_kebab = os.path.basename(resource_location)

    # แปลง kebab-case resource name เป็น PascalCase สำหรับชื่อ Entity
    # ตัวอย่าง: 'is-mo' -> 'IsMo'
    entity_name_pascal = snake_to_pascal(resource_name_kebab.replace('-', '_'))

    print(f"\nกำลังดำเนินการสำหรับ resource: {resource_name_kebab}")
    print(f"ชื่อ Entity ที่คาดการณ์: {entity_name_pascal}")

    # กำหนด path ของไฟล์ต่างๆ
    module_path = os.path.join(resource_location, f'{resource_name_kebab}.module.ts')
    service_path = os.path.join(resource_location, f'{resource_name_kebab}.service.ts')
    controller_path = os.path.join(resource_location, f'{resource_name_kebab}.controller.ts')
    dto_dir = os.path.join(resource_location, 'dto')
    entity_dir = os.path.join(resource_location, 'entities')

    # กำหนด path สำหรับโฟลเดอร์ SQL
    sql_folder_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sql')

    # ถ้า folder ของ resource มี folder sql ให้ใช้ path นั้น
    # ตัวอย่าง: src/webform/isform/is-mo/sql
    resource_specific_sql_folder = os.path.join(resource_location, 'sql')
    if os.path.exists(resource_specific_sql_folder):
        sql_folder_path = resource_specific_sql_folder
        print(f"  - พบโฟลเดอร์ SQL เฉพาะ resource ที่: {sql_folder_path}")
    else:
        print(f"  - ไม่พบโฟลเดอร์ SQL เฉพาะ resource กำลังตรวจสอบโฟลเดอร์ 'sql' ที่ root: {sql_folder_path}")


    # 1. สร้างโฟลเดอร์ entities ถ้ายังไม่มี
    print(f"\n1. กำลังตรวจสอบและสร้างโฟลเดอร์ entities: {entity_dir}")
    os.makedirs(entity_dir, exist_ok=True)
    print(f"  - โฟลเดอร์ {entity_dir} พร้อมใช้งานแล้ว")

    # 2. สร้างไฟล์ entity
    print(f"\n2. กำลังสร้างหรือตรวจสอบไฟล์ entity...")
    create_entity_file(entity_dir, entity_name_pascal, resource_name_kebab, sql_folder_path)

    # 3. แก้ไขไฟล์ module
    print(f"\n3. กำลังแก้ไขไฟล์ module: {module_path}")
    modify_module_file(module_path, entity_name_pascal, resource_name_kebab)

    # 4. แก้ไขไฟล์ service
    print(f"\n4. กำลังแก้ไขไฟล์ service: {service_path}")
    modify_service_file(service_path, entity_name_pascal, resource_name_kebab)

    # 5. แก้ไขไฟล์ controller
    print(f"\n5. กำแก้ไขไฟล์ controller: {controller_path}")
    modify_controller_file(controller_path, entity_name_pascal, resource_name_kebab)

    # 6. แก้ไขไฟล์ DTOs
    print(f"\n6. กำลังแก้ไขไฟล์ DTOs ในโฟลเดอร์: {dto_dir}")
    modify_dto_files(dto_dir, entity_name_pascal)

    print("\n--- การปรับแต่ง resource เสร็จสมบูรณ์แล้ว! ---")
    print("คุณอาจต้องตรวจสอบและปรับแต่งไฟล์ entity (.entity.ts) เพิ่มเติมตามโครงสร้างฐานข้อมูล Oracle ของคุณ")
    print("รวมถึงการกำหนด Primary Key, Foreign Key และความสัมพันธ์ที่ซับซ้อน")
    print("สคริปต์นี้จะพยายามระบุคอลัมน์ Primary Key ที่ชื่อ 'ID' หรือคอลัมน์ที่ระบุใน PRIMARY KEY constraint โดยอัตโนมัติ")

if __name__ == "__main__":
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    main()
