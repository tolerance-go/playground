import { UnitNumber } from '@/models/comsStyles';

export const joinUnitNumber = (count?: UnitNumber, defaultUnit?: string) => {
  const unit = count?.unit ?? defaultUnit;
  if (unit && count?.value) {
    return `${count.value}${unit}`;
  }

  return count?.value;
};
