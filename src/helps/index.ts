/** nanoid 使用 A-Za-z0-9_- */
const step = '#';
export const joinSlotGroupId = (comId: string, slotName: string) => {
  return `${comId}${step}${slotName}`;
};

export const splitSlotGroupId = (slotGroupId: string) => {
  const [comId, slotName] = slotGroupId.split(step);
  return { comId, slotName };
};

export const isSlotGroupId = (slotGroupId: string) => {
  return !!slotGroupId.match('#');
};
