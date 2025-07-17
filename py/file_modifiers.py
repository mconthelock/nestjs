# py/file_modifiers.py

import os
import re
from utils import pascal_to_kebab # Import ฟังก์ชันจาก utils

def modify_module_file(module_path, entity_name_pascal, entity_name_kebab):
    """
    แก้ไขไฟล์ .module.ts เพื่อเพิ่ม TypeOrmModule.forFeature และ import entity
    """
    try:
        with open(module_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # เพิ่ม import TypeOrmModule และ Entity
        import_typeorm = "import { TypeOrmModule } from '@nestjs/typeorm';"
        import_entity = f"import {{ {entity_name_pascal} }} from './entities/{entity_name_kebab}.entity';"

        if import_typeorm not in content:
            content = content.replace("import { Module } from '@nestjs/common';",
                                      f"import {{ Module }} from '@nestjs/common';\n{import_typeorm}")
        if import_entity not in content:
            # ค้นหาบรรทัดที่มี import { ... } from './entities/...' และแทรก import entity ใหม่
            match = re.search(r"import\s*{\s*[\w,\s]*\s*}\s*from\s*'\.\/entities\/(.*?)\.entity';", content)
            if match:
                existing_entity_import = match.group(0)
                # ตรวจสอบว่า entity_name_pascal มีอยู่ใน import แล้วหรือไม่
                if entity_name_pascal not in existing_entity_import:
                    # แยกชื่อ entity ที่มีอยู่แล้ว
                    existing_entities = re.findall(r'\{\s*(.*?)\s*\}', existing_entity_import)[0].split(',')
                    existing_entities = [e.strip() for e in existing_entities if e.strip()]
                    if entity_name_pascal not in existing_entities:
                        existing_entities.append(entity_name_pascal)
                        new_import_line = f"import {{ {', '.join(sorted(existing_entities))} }} from './entities/{match.group(1)}.entity';"
                        content = content.replace(existing_entity_import, new_import_line)
                    else:
                        print(f"  - Entity '{entity_name_pascal}' มีอยู่ใน {module_path} แล้ว ไม่ต้องเพิ่มซ้ำ")
                else:
                    print(f"  - Entity '{entity_name_pascal}' มีอยู่ใน {module_path} แล้ว ไม่ต้องเพิ่มซ้ำ")
            else:
                # ถ้าไม่มี import entity เดิม ให้เพิ่มบรรทัดใหม่
                content = content.replace(f"import {{ {entity_name_pascal}Service }} from './{entity_name_kebab}.service';",
                                          f"import {{ {entity_name_pascal}Service }} from './{entity_name_kebab}.service';\n{import_entity}")


        # เพิ่ม TypeOrmModule.forFeature ใน imports array
        # ใช้ regex เพื่อหา imports: [...] และแทรก TypeOrmModule.forFeature

        # หาตำแหน่งของ @Module({ ... })
        module_decorator_match = re.search(r'@Module\s*\(\{([\s\S]*?)\}\)', content)
        if module_decorator_match:
            module_config = module_decorator_match.group(1)

            # หา imports array
            imports_match = re.search(r'imports:\s*\[([\s\S]*?)\]', module_config)
            if imports_match:
                current_imports = imports_match.group(1)
                typeorm_feature_line = f"TypeOrmModule.forFeature([{entity_name_pascal}], 'amecConnection')"

                if typeorm_feature_line not in current_imports:
                    # ตรวจสอบว่ามี imports อื่นๆ อยู่แล้วหรือไม่
                    if current_imports.strip():
                        new_imports = f"imports: [\n    {current_imports.strip()},\n    {typeorm_feature_line}\n  ]"
                    else:
                        new_imports = f"imports: [\n    {typeorm_feature_line}\n  ]"

                    content = content.replace(imports_match.group(0), new_imports)
                else:
                    print(f"  - TypeOrmModule.forFeature([{entity_name_pascal}]) มีอยู่ใน {module_path} แล้ว ไม่ต้องเพิ่มซ้ำ")
            else:
                # ถ้าไม่มี imports array ให้เพิ่มเข้าไป
                new_imports_block = f"imports: [\n    TypeOrmModule.forFeature([{entity_name_pascal}], 'amecConnection')\n  ],"

                # แทรก new_imports_block ก่อน providers
                if "providers:" in module_config:
                    content = content.replace("providers:", f"{new_imports_block}\n  providers:")
                elif "controllers:" in module_config:
                    content = content.replace("controllers:", f"{new_imports_block}\n  controllers:")
                else:
                    # ถ้าไม่มีทั้ง providers และ controllers ให้เพิ่มเข้าไปใน @Module({})
                    content = content.replace(module_decorator_match.group(0),
                                              f"@Module({{\n  {new_imports_block}\n{module_config}\n}})")
        else:
            print(f"  - ไม่พบ @Module() decorator ใน {module_path}")
            return # ออกจากฟังก์ชันถ้าไม่พบ @Module()

        with open(module_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  - แก้ไข {module_path} เรียบร้อยแล้ว")

    except FileNotFoundError:
        print(f"ข้อผิดพลาด: ไม่พบไฟล์ {module_path}")
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการแก้ไขไฟล์ {module_path}: {e}")

def modify_service_file(service_path, entity_name_pascal, entity_name_kebab):
    """
    แก้ไขไฟล์ .service.ts เพื่อ inject Repository และเพิ่ม constructor
    """
    try:
        with open(service_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # เพิ่ม import Repository และ InjectRepository
        import_repository = "import { Repository } from 'typeorm';"
        import_inject_repository = "import { InjectRepository } from '@nestjs/typeorm';"
        import_entity = f"import {{ {entity_name_pascal} }} from './entities/{entity_name_kebab}.entity';"

        if import_repository not in content:
            content = f"{import_repository}\n{content}"
        if import_inject_repository not in content:
            content = f"{import_inject_repository}\n{content}"
        if import_entity not in content:
            content = f"{import_entity}\n{content}"

        # เพิ่ม @Injectable() เหนือ class
        if "@Injectable()" not in content:
            content = content.replace("export class", "@Injectable()\nexport class")

        # เพิ่ม constructor สำหรับ inject Repository
        # ค้นหา class <ServiceName> {
        class_declaration_match = re.search(r'export class (\w+)Service\s*{', content)
        if class_declaration_match:
            service_class_name = class_declaration_match.group(1)

            # ตรวจสอบว่ามี constructor อยู่แล้วหรือไม่
            if "constructor(" not in content:
                # ถ้าไม่มี constructor ให้เพิ่มเข้าไป
                constructor_to_add = f"""  constructor(
    @InjectRepository({entity_name_pascal}, 'amecConnection')
    private readonly {entity_name_kebab}Repository: Repository<{entity_name_pascal}>,
  ) {{}}"""
                content = content.replace(f"export class {service_class_name}Service {{",
                                          f"export class {service_class_name}Service {{\n{constructor_to_add}\n")
            else:
                # ถ้ามี constructor อยู่แล้ว ให้ตรวจสอบว่ามี Repository inject อยู่แล้วหรือไม่
                if f"private readonly {entity_name_kebab}Repository: Repository<{entity_name_pascal}>," not in content:
                    # แทรก parameter เข้าไปใน constructor เดิม
                    # ใช้ re.sub เพื่อแทรก parameter เข้าไปใน constructor ที่มีอยู่แล้ว
                    content = re.sub(r'(constructor\s*\()([\s\S]*?)(\)\s*\{)',
                                     rf'\1\2\n    @InjectRepository({entity_name_pascal})\n    private readonly {entity_name_kebab}Repository: Repository<{entity_name_pascal}>,\3',
                                     content, 1)
                else:
                    print(f"  - Repository สำหรับ {entity_name_pascal} มีอยู่ใน {service_path} แล้ว ไม่ต้องเพิ่มซ้ำ")

        # แก้ไขเมธอด create(), findAll(), findOne(), update(), remove() ให้ใช้ Repository
        # ใช้ regex ที่จับกลุ่มตัวแปร DTO และชนิด DTO เพื่อนำไปใช้ใน replacement string

        # แก้ไขเมธอด create
        create_pattern = r'create\((\w+Dto):\s*(Create\w+Dto)\)\s*\{\s*return\s*\'This action adds a new \w+\';\s*\}'
        create_replacement = r'create(\1: \2) {\n    return this.' + entity_name_kebab + r'Repository.save(\1);\n  }'
        content = re.sub(create_pattern, create_replacement, content)

        # แก้ไขเมธอด findAll
        findAll_pattern = r'findAll\(\)\s*\{\s*return\s*\'This action returns all \w+\';\s*\}'
        findAll_replacement = r'findAll() {\n    return this.' + entity_name_kebab + r'Repository.find();\n  }'
        content = re.sub(findAll_pattern, findAll_replacement, content)

        # แก้ไขเมธอด findOne
        findOne_pattern = r'findOne\(id:\s*number\)\s*\{\s*return\s*`This action returns a #${id} \w+`;\s*\}'
        findOne_replacement = r'findOne(id: number) {\n    return this.' + entity_name_kebab + r'Repository.findOneBy({ id });\n  }'
        content = re.sub(findOne_pattern, findOne_replacement, content)

        # แก้ไขเมธอด update
        update_pattern = r'update\(id:\s*number,\s*(\w+Dto):\s*(Update\w+Dto)\)\s*\{\s*return\s*`This action updates a #${id} \w+`;\s*\}'
        update_replacement = r'update(id: number, \1: \2) {\n    return this.' + entity_name_kebab + r'Repository.update(id, \1);\n  }'
        content = re.sub(update_pattern, update_replacement, content)

        # แก้ไขเมธอด remove
        remove_pattern = r'remove\(id:\s*number\)\s*\{\s*return\s*`This action removes a #${id} \w+`;\s*\}'
        remove_replacement = r'remove(id: number) {\n    return this.' + entity_name_kebab + r'Repository.delete(id);\n  }'
        content = re.sub(remove_pattern, remove_replacement, content)

        with open(service_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  - แก้ไข {service_path} เรียบร้อยแล้ว")

    except FileNotFoundError:
        print(f"ข้อผิดพลาด: ไม่พบไฟล์ {service_path}")
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการแก้ไขไฟล์ {service_path}: {e}")

def modify_controller_file(controller_path, entity_name_pascal, entity_name_kebab):
    """
    แก้ไขไฟล์ .controller.ts เพื่อปรับ service ให้ใช้ TypeORM
    """
    try:
        with open(controller_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # แก้ไข return value ของเมธอดต่างๆ
        # ปรับ regex ใน controller ให้สอดคล้องกับการเปลี่ยนชื่อ parameter ใน service
        content = re.sub(r'return this\.(\w+Service)\.create\(create\w+Dto\);',
                         r'return this.\1.create(createDto);', content)
        content = re.sub(r'return this\.(\w+Service)\.findAll\(\);',
                         r'return this.\1.findAll();', content)
        content = re.sub(r'return this\.(\w+Service)\.findOne\(\+id\);',
                         r'return this.\1.findOne(+id);', content)
        content = re.sub(r'return this\.(\w+Service)\.update\(\+id, update\w+Dto\);',
                         r'return this.\1.update(+id, updateDto);', content)
        content = re.sub(r'return this\.(\w+Service)\.remove\(\+id\);',
                         r'return this.\1.remove(+id);', content)

        with open(controller_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  - แก้ไข {controller_path} เรียบร้อยแล้ว")

    except FileNotFoundError:
        print(f"ข้อผิดพลาด: ไม่พบไฟล์ {controller_path}")
    except Exception as e:
        print(f"เกิดข้อผิดพลาดในการแก้ไขไฟล์ {controller_path}: {e}")

def modify_dto_files(dto_dir, entity_name_pascal):
    """
    แก้ไขไฟล์ DTO เพื่อ import PartialType และ MappedTypes/swagger
    """
    create_dto_path = os.path.join(dto_dir, f'create-{pascal_to_kebab(entity_name_pascal)}.dto.ts')
    update_dto_path = os.path.join(dto_dir, f'update-{pascal_to_kebab(entity_name_pascal)}.dto.ts')

    # แก้ไข create-*.dto.ts (ถ้ามี)
    if os.path.exists(create_dto_path):
        try:
            with open(create_dto_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # เพิ่ม import ApiProperty (ถ้าใช้ swagger)
            if "@nestjs/swagger" in content:
                if "ApiProperty" not in content:
                    content = content.replace("import { } from '@nestjs/swagger';",
                                              "import { ApiProperty } from '@nestjs/swagger';")

            with open(create_dto_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - แก้ไข {create_dto_path} เรียบร้อยแล้ว")
        except Exception as e:
            print(f"เกิดข้อผิดพลาดในการแก้ไขไฟล์ {create_dto_path}: {e}")

    # แก้ไข update-*.dto.ts
    if os.path.exists(update_dto_path):
        try:
            with open(update_dto_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # เพิ่ม import PartialType และ MappedTypes (ถ้ายังไม่มี)
            if "MappedTypes" in content: # NestJS 8+
                if "PartialType" not in content:
                    content = content.replace("import { } from '@nestjs/mapped-types';",
                                              "import { PartialType } from '@nestjs/mapped-types';")
            elif "@nestjs/swagger" in content: # NestJS 7- (หรือใช้ร่วมกับ swagger)
                 if "PartialType" not in content:
                    content = content.replace("import { } from '@nestjs/swagger';",
                                              "import { PartialType } from '@nestjs/swagger';")

            # แก้ไข class ให้ extends PartialType
            create_dto_class_name = f"Create{entity_name_pascal}Dto"
            if f"export class Update{entity_name_pascal}Dto extends PartialType({create_dto_class_name})" not in content:
                content = re.sub(r'export class Update(\w+)Dto extends PartialType\(Create\w+Dto\)\s*{}',
                                 rf'export class Update\1Dto extends PartialType({create_dto_class_name}) {{}}', content)
                content = re.sub(r'export class Update(\w+)Dto\s*{}',
                                 rf'export class Update\1Dto extends PartialType({create_dto_class_name}) {{}}', content)

            with open(update_dto_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - แก้ไข {update_dto_path} เรียบร้อยแล้ว")
        except Exception as e:
            print(f"เกิดข้อผิดพลาดในการแก้ไขไฟล์ {update_dto_path}: {e}")
