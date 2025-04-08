import { EntitySchema } from 'typeorm';
import { Department } from './pdepartment.entity';

export const DepartmentSchema = new EntitySchema<Department>({
  name: 'Department',
  target: Department,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
});
