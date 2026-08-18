export const CATEGORY_OPTIONS = [
  '식비',
  '교통',
  '숙박',
  '활동',
  '쇼핑',
  '기타',
];

// 화면에는 한글로 표시하지만, 백엔드 API는 영문 enum 값을 기대한다.
const CATEGORY_TO_ENUM = {
  식비: 'FOOD',
  교통: 'TRANSPORT',
  숙박: 'ACCOMMODATION',
  활동: 'ACTIVITY',
  쇼핑: 'SHOPPING',
  기타: 'ETC',
};

const ENUM_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_TO_ENUM).map(([label, code]) => [code, label]),
);

// 화면 표시용(한글) 카테고리를 API로 보낼 영문 enum 값으로 변환한다.
export function toApiCategory(label) {
  return CATEGORY_TO_ENUM[label] ?? label;
}

// API(영문 enum) 또는 예전 mock 데이터(한글)로 받은 카테고리를 화면 표시용
// 한글로 변환한다. 이미 한글이면 그대로 돌려준다.
export function toDisplayCategory(value) {
  return ENUM_TO_CATEGORY[value] ?? value;
}
