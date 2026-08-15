export default (dateInput: string) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  // Текущая дата и время
  const now = new Date();

  // Начало сегодняшнего дня (без времени) – локальное
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Начало дня сообщения – локальное
  const msgDayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Разница в днях (положительная = в прошлом)
  const diffDays = Math.floor(
    (Number(todayStart) - Number(msgDayStart)) / (1000 * 60 * 60 * 24)
  );

  // 1. Сегодня
  if (diffDays === 0) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // 2. В пределах последних 5 дней (1–5 дней назад)
  if (diffDays > 0 && diffDays <= 5) {
    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    // getDay(): 0=воскресенье, 1=понедельник ... 6=суббота
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return weekdays[dayIndex];
  }

  // 3. Раньше или в будущем → полная дата
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
