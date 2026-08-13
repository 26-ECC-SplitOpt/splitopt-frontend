import {
  FoodIcon,
  CarIcon,
  HomeIcon,
  ActivityIcon,
  BagIcon,
  EtcIcon,
} from '../components/icons';

const CATEGORY_ICON_RULES = [
  { keywords: ['식비'], Icon: FoodIcon },
  { keywords: ['교통'], Icon: CarIcon },
  { keywords: ['숙박'], Icon: HomeIcon },
  { keywords: ['활동'], Icon: ActivityIcon },
  { keywords: ['쇼핑'], Icon: BagIcon },
];

export function getCategoryIcon(category = '') {
  const rule = CATEGORY_ICON_RULES.find((item) =>
    item.keywords.some((keyword) => category.includes(keyword)),
  );

  return rule ? rule.Icon : EtcIcon;
}
