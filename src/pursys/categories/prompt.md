# Role

You are an Expert Backend Engineer specializing in NestJS, TypeORM, and Oracle Database. Your task is to plan and implement a scalable Warehouse Product Management Backend.

# Existing Files Context

I have already manually created some foundational files. You MUST read, analyze, and use these existing files as your base before generating new code or making modifications:

- src/common/Entities/pursys/table/CATEGORIES.entity.ts
- src/common/Entities/pursys/table/CATEGORY_ATTRIBUTES.entity.ts
- src/common/Entities/pursys/table/PRODUCTS.entity.ts
- src/pursys/products/products.service.ts
- src/pursys/categories/categories.service.ts
  _Note for Agent: Use your file-reading capabilities to deeply understand these files first before proceeding._

# System Context & Constraints

- **Framework:** NestJS (TypeScript)
- **Database:** Oracle (via TypeORM)
- **Authentication:** NONE (Public APIs for all endpoints)
- **Primary Keys:** MUST use Auto-incrementing integers (`@PrimaryGeneratedColumn('increment')` returning `number`), DO NOT use UUIDs.
- **Key Pattern:** EAV (Entity-Attribute-Value) with JSON for dynamic product attributes, Strategy Pattern (Function Registry) for dynamic validation, and Pessimistic Locking for inventory concurrency.

# Core Modules & Database Specifications

## 1. Categories Module (Tree Structure)

- **Entity `Category`:** Use TypeORM `@Tree('adjacency-list')`. Fields: `id` (number), `name`, `parent`, `children`, `attributes` (OneToMany).
- **Entity `CategoryAttribute`:** Defines the schema for products in a category. Fields:
    - `id` (number), `name` (string), `isRequired` (boolean/number)
    - `dataType`: String/Enum ('text', 'number', 'option')
    - `optionSource`: String/Enum ('none', 'fixed', 'function')
    - `fixedOptions`: Simple-array or JSON string (Array of strings, used if source is FIXED)
    - `functionName`: String (Used if source is FUNCTION)
- **Logic:** Must have a service method to retrieve all inherited attributes from a category and its ancestors.

## 2. Option Registry Module (Strategy Pattern)

- **Service `OptionRegistryService`:** Acts as a central hub.
- **Logic:** Use a TypeScript `Map<string, (value: any) => Promise<boolean>>` to allow different modules to register validation functions during `OnModuleInit`. Include `register()` and `execute()` methods.

## 3. Products Module (Dynamic Attributes)

- **Entity `Product`:** Fields: `id` (number), `sku` (unique string), `name`, `description` (CLOB/Text), `price` (number), `costPrice` (number), `categoryId` (ManyToOne), `extraAttributes` (JSON/CLOB default `{}`), Soft Delete timestamps.
- **Logic (Creation/Update):** - Fetch inherited category attributes.
    - Validate the incoming `extraAttributes` JSON payload against the schema.
    - If `optionSource` is `fixed`, validate against `fixedOptions` array.
    - If `optionSource` is `function`, call `OptionRegistryService.execute(functionName, value)` to validate.
    - Save the product if all validations pass. Ensure parameter types for `id` are `number`.

# Task Instructions

1. **Phase 1: Review & Plan.** Read the existing files listed in the "Existing Files Context" section. Provide a brief, step-by-step implementation plan outlining how you will integrate the new features into the existing code, what new files need to be created, and module dependencies. Wait for my approval before coding.
2. **Phase 2: Execution.** Update the existing files and create any missing files according to the approved plan.
    - **Crucial Rule:** DO NOT modify or remove existing basic fields, imports, or core logic in the provided files unless strictly necessary to integrate the new features. Keep the existing structure intact.
    - Ensure parameter validation (`class-validator` and `ParseIntPipe` for IDs) and error handling are robust.
