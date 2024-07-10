export const validateFields = (fields: any) => {
    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return `${key.charAt(0).toUpperCase() + key.slice(1)} Required`;
      }
    }
    return null;
};