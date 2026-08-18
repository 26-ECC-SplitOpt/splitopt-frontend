const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 일정 목록에서 사용하는 짧은 날짜 표기. 예: "08.02 (토)"
export function formatScheduleDate(iso) {
  const date = new Date(iso);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}.${dd} (${WEEKDAYS[date.getDay()]})`;
}

// 일정 상세에서 사용하는 날짜 표기. 예: "2026.08.02(목)"
export function formatScheduleDateTime(iso) {
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}(${WEEKDAYS[date.getDay()]})`;
}

// datetime-local이 아닌 date input에 채울 "YYYY-MM-DD" 문자열로 변환한다.
export function toLocalDateInput(iso) {
  if (!iso) return '';

  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// time input에 채울 "HH:MM" 문자열로 변환한다.
export function toLocalTimeInput(iso) {
  if (!iso) return '';

  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}
