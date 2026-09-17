import { getCurrentWindow } from "@tauri-apps/api/window";
import { getDayName, getTodayLessons, loadSchedules } from "./schedule";
import { notify } from "./notifications";
import { createScheduler } from "./scheduler";

const scheduler = createScheduler(() => getTodayLessons());

function registerWindowBehavior(): void {
  const appWindow = getCurrentWindow();
  appWindow.onCloseRequested(({ preventDefault }) => {
    preventDefault();
    appWindow.hide();
  });
}

const dayNameElement = document.querySelector<HTMLElement>("#day-name");
const scheduleListElement = document.querySelector<HTMLElement>("#schedule-list");
const notificationButton = document.querySelector<HTMLButtonElement>("#notification-test");
const statusElement = document.querySelector<HTMLElement>("#status");

function renderSchedule(): void {
  if (!dayNameElement || !scheduleListElement) return;

  const today = new Date();
  const lessons = getTodayLessons(today);
  dayNameElement.textContent = getDayName(today.getDay() === 0 ? 7 : today.getDay());

  const table = document.createElement("table");
  table.className = "schedule-table";
  table.innerHTML = "<thead><tr><th scope=\"col\">Ժամը</th><th scope=\"col\">Դաս</th></tr></thead>";

  const body = document.createElement("tbody");
  for (const lesson of lessons) {
    const row = document.createElement("tr");
    const time = document.createElement("td");
    const subject = document.createElement("td");
    time.textContent = `${lesson.start}–${lesson.end}`;
    subject.textContent = lesson.lesson;
    row.append(time, subject);
    body.append(row);
  }

  table.append(body);
  scheduleListElement.replaceChildren(table);
}

function showScheduleError(error: unknown): void {
  console.error(error);
  if (dayNameElement) dayNameElement.textContent = "Դասացուցակ";
  if (scheduleListElement) {
    scheduleListElement.textContent = "Չհաջողվեց բեռնել դասացուցակը։";
  }
}

async function testNotification(): Promise<void> {
  if (statusElement) statusElement.textContent = "Ծանուցումը ուղարկվում է…";
  try {
    await notify("Դասացուցակ", "1 րոպեից սկսվում է «Մաթեմատիկա» դասը։");
    if (statusElement) statusElement.textContent = "Ծանուցումը ուղարկվեց։";
  } catch (error) {
    console.error(error);
    if (statusElement) statusElement.textContent = "Չհաջողվեց ուղարկել ծանուցումը։";
  }
}

registerWindowBehavior();

void loadSchedules()
  .then(() => {
    renderSchedule();
    scheduler.start();
  })
  .catch(showScheduleError);
notificationButton?.addEventListener("click", () => void testNotification());
