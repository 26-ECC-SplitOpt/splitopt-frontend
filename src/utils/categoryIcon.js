import { FoodIcon, CarIcon, SparkleIcon } from '../components/icons';

const CATEGORY_ICON_RULES = [
  {
    keywords: ['식사', '카페', '점심', '저녁', '아침', '커피'],
    Icon: FoodIcon,
  },
  { keywords: ['교통', '택시', '버스', '기차', '주유'], Icon: CarIcon },
];

export function getCategoryIcon(category = '') {
  const rule = CATEGORY_ICON_RULES.find((item) =>
    item.keywords.some((keyword) => category.includes(keyword)),
  );

  return rule ? rule.Icon : SparkleIcon;
}
