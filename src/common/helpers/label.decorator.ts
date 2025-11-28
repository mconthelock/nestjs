import 'reflect-metadata';
/**
 * Convert labael string to custom label decorator in DTO
 * @param label string
 * @returns CustomLabelDecorator
 */
export const Label = (name: string) => {
  return Reflect.metadata('custom:label', name);
};
