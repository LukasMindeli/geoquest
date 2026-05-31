# GeoQuest Refactor Plan

План для безопасного разбиения текущего монолитного `index.html` на отдельные файлы без изменения поведения сайта.

## Цель

Сохранить текущий Vercel static SPA deploy и поэтапно вынести:

- стили из inline `<style>`
- данные и конфигурацию из inline `<script>`
- игровую логику по отдельным JS-файлам
- UI-логику по отдельным JS-файлам

Итог: `index.html` становится тонкой оболочкой, а логика и стили живут в отдельных файлах.

## Жесткие ограничения

- Не менять поведение сайта в первом проходе.
- Не менять DOM `id`, `class`, текст маршрутов и Vercel rewrite.
- Не менять порядок загрузки внешних CDN-зависимостей без необходимости.
- Не переименовывать игровые режимы, ключи `localStorage`, Firebase-конфиг и сетевые адреса.
- Не переписывать все сразу на ES modules в первом проходе.

## Текущее устройство файла

### CSS

- `index.html:29` - `index.html:433`
- Внутри уже есть логические секции:
  - `LABELS`, `LOADING`, `MAIN MENU`, `SOLO SETUP`
  - `VIEWER TOOLBAR`, `HUD`, `FLASH`, `RESULT`
  - `MULTIPLAYER`, `MP GAME`, `MP RESULT`
  - `PROFILE`, `DAILY`, `ACHIEVEMENTS`, `LEADERBOARD`
  - `AUTH BAR`, `CHAT`, `MATCHMAKING`, `AUTH GATE MODAL`

### HTML-разметка

- основной UI-каркас начинается около `index.html:440`
- ключевые блоки:
  - `index.html:446` - auth gate
  - `index.html:457` - auth bar
  - `index.html:469` - chat panel
  - `index.html:482` - matchmaking
  - `index.html:507` - main menu
  - `index.html:550` - solo setup
  - `index.html:605` - solo HUD
  - `index.html:623` - multiplayer lobby
  - `index.html:662` - multiplayer game UI
  - `index.html:688` - multiplayer result
  - `index.html:704` - solo result
  - `index.html:744` - speed HUD
  - `index.html:772` - speed result
  - `index.html:796` - profile
  - `index.html:819` - daily
  - `index.html:846` - achievements
  - `index.html:856` - leaderboard

### JS

- внешние CDN-скрипты: `index.html:877` - `index.html:882`
- inline JS начинается на `index.html:883`
- крупные блоки:
  - `index.html:888` - Firebase init/auth
  - `index.html:1023` - chat
  - `index.html:1090` - matchmaking
  - `index.html:1162` - bot match
  - `index.html:1251` - `COUNTRIES`
  - `index.html:1320` - `LANDMARKS`
  - `index.html:1357` - `LEADERS`
  - `index.html:1411` - `RELIGIONS`
  - `index.html:1494` - `CAPITALS`
  - `index.html:1544` - language helpers
  - `index.html:1558` - Three.js globe setup
  - `index.html:1694` - labels
  - `index.html:1789` - screen state
  - `index.html:1819` - solo mode
  - `index.html:1929` - multiplayer state
  - `index.html:1944` - Peer init
  - `index.html:2015` - multiplayer game
  - `index.html:2319` - camera rotation
  - `index.html:2390` - question flow
  - `index.html:2508` - speed mode
  - `index.html:2629` - profile/localStorage
  - `index.html:2694` - achievements
  - `index.html:2734` - daily
  - `index.html:2842` - leaderboard
  - `index.html:2990` - language toggle

## Целевая структура

```text
/
  index.html
  sitemap.xml
  vercel.json
  assets/
    css/
      app.css
    js/
      app.js
      state.js
      constants.js
      data/
        countries.js
        content.js
      core/
        firebase.js
        chat.js
        matchmaking.js
        globe.js
        labels.js
        navigation.js
      modes/
        solo.js
        multiplayer.js
        speed.js
      features/
        profile.js
        achievements.js
        daily.js
        leaderboard.js
        language.js
        fireworks.js
      utils/
        dom.js
        format.js
```

## Принцип первого прохода

Первый проход должен быть не "красивым", а безопасным:

- оставляем глобальное состояние совместимым с текущим кодом
- сохраняем существующие имена функций, если они используются из HTML или других частей скрипта
- переносим код блоками, а не переписываем архитектуру
- сначала добиваемся равного поведения, потом уже чистим API и убираем глобалы

## Рекомендуемый порядок работ

### Шаг 1. Зафиксировать правила перевода строк

Перед большим переносом желательно добавить `.gitattributes`, чтобы не получать шумные diffs из-за `LF/CRLF`.

Рекомендация:

```gitattributes
*.html text eol=lf
*.xml text eol=lf
*.json text eol=lf
*.md text eol=lf
*.js text eol=lf
*.css text eol=lf
```

Это безопасный инфраструктурный шаг перед рефакторингом.

### Шаг 2. Вынести CSS в `assets/css/app.css`

Сделать первым именно CSS, потому что это почти не затрагивает игровую логику.

Порядок:

1. Создать `assets/css/app.css`.
2. Перенести содержимое `<style>` без переименования селекторов.
3. Подключить `<link rel="stylesheet" href="assets/css/app.css">`.
4. Удалить inline `<style>` только после проверки.

Проверка:

- главный экран выглядит так же
- HUD, overlay, profile, leaderboard и chat не "поехали"
- мобильная вёрстка не сломалась

### Шаг 3. Вынести чистые данные

Переносить без изменения структуры объектов:

- `COUNTRIES`
- `LANDMARKS`
- `LEADERS`
- `RELIGIONS`
- `ALL_RELIGIONS`
- `EN`
- `CAPITALS`
- `RLABELS`, `RLABELS_EN`

Файлы:

- `assets/js/data/countries.js`
- `assets/js/data/content.js`

Правило:

- на первом проходе экспорт не обязателен
- можно присваивать в `window.GeoQuestData` или в совместимый глобальный объект

### Шаг 4. Вынести константы и общее состояние

В отдельные файлы:

- `assets/js/constants.js`
- `assets/js/state.js`

Сюда входят:

- режимы
- тайминги
- общие `let`/`const`, от которых зависит несколько подсистем
- глобальные ссылки на score/state/hud-переменные

Важно:

- не дробить состояние слишком рано
- сначала собрать его в один понятный слой, затем оптимизировать

### Шаг 5. Вынести инфраструктурные модули

Сначала переносить код с минимальной связанностью:

- `firebase.js`
- `chat.js`
- `matchmaking.js`
- `navigation.js`
- `labels.js`

Основание:

- у этих блоков уже есть естественные границы по функциям
- они меньше завязаны на 3D-рендер, чем игровое ядро

### Шаг 6. Вынести ядро глобуса

Файл:

- `assets/js/core/globe.js`

Сюда входят:

- Three.js setup
- scene/camera/renderer
- построение мешей
- raycast/hover/click
- label projection
- animation loop
- rotate/camera helpers

Важно:

- `EARTH_TEX` пока оставить как есть в JS, не менять способ хранения в первом проходе
- не менять порядок инициализации `renderer`, `scene`, `camera`, `G`, `meshes`, `overlays`

### Шаг 7. Вынести solo mode

Файл:

- `assets/js/modes/solo.js`

Сюда входят:

- `startSolo`
- `clickA`
- `sGood`
- `sBad`
- `onTimeout`
- `endSolo`
- связанный HUD/question flow

Важно:

- не менять ключевые переменные вроде `soloMode`, `soloReg`, `qIdx`, `score`, `lives`, `streak`
- не менять текущие правила начисления очков

### Шаг 8. Вынести multiplayer

Файл:

- `assets/js/modes/multiplayer.js`

Сюда входят:

- Peer setup
- multiplayer state
- round flow
- selector/finder logic
- UI обновления multiplayer

Это один из самых рискованных блоков, поэтому переносить его только после CSS, data и globe.

### Шаг 9. Вынести speed mode

Файл:

- `assets/js/modes/speed.js`

Сюда входят:

- `startSpeed`
- `nextSpeedQ`
- speed answer/click handlers
- ring/timer/result logic

### Шаг 10. Вынести profile/features

Файлы:

- `assets/js/features/profile.js`
- `assets/js/features/achievements.js`
- `assets/js/features/daily.js`
- `assets/js/features/leaderboard.js`
- `assets/js/features/language.js`
- `assets/js/features/fireworks.js`

Сюда входят:

- `localStorage`-профиль
- daily streak
- achievements
- leaderboard
- переключение языка
- fireworks canvas

### Шаг 11. Собрать `app.js`

`assets/js/app.js` должен:

1. подключать или инициализировать данные
2. поднимать общее состояние
3. запускать Firebase/auth
4. инициализировать globe/UI
5. вешать обработчики
6. запускать стартовый экран

На этом шаге `index.html` уже можно сократить до:

- HTML-каркаса
- CDN-скриптов
- локальных `assets/js/*.js`

## Порядок подключения скриптов

Для первого прохода безопаснее использовать обычные `defer`-скрипты в строгом порядке, а не сразу переходить на `type="module"`.

Рекомендуемый порядок:

1. CDN scripts
2. `data/countries.js`
3. `data/content.js`
4. `constants.js`
5. `state.js`
6. `core/firebase.js`
7. `core/chat.js`
8. `core/matchmaking.js`
9. `core/navigation.js`
10. `core/globe.js`
11. `core/labels.js`
12. `modes/solo.js`
13. `modes/multiplayer.js`
14. `modes/speed.js`
15. `features/profile.js`
16. `features/achievements.js`
17. `features/daily.js`
18. `features/leaderboard.js`
19. `features/language.js`
20. `features/fireworks.js`
21. `app.js`

## Минимальные правила безопасности при переносе

- переносить код кусками и после каждого куска запускать локальную проверку
- не совмещать extraction и cleanup в одном коммите
- один commit = один тип переноса
- сначала копировать код в новый файл, потом подключать, потом удалять старый фрагмент
- если блок зависит от глобалов, временно оставить эти глобалы совместимыми

## Smoke-check после каждого этапа

После каждого шага проверять:

1. открывается главная страница
2. крутится глобус
3. hover/click по странам работает
4. запускается solo mode
5. таймер и HUD работают
6. запускается speed mode
7. открываются profile/daily/leaderboard
8. работает toggle языка
9. открываются auth/chat/matchmaking панели
10. нет ошибок в console

## Рекомендуемая последовательность коммитов

Пример безопасной серии:

1. `Add gitattributes for stable line endings`
2. `Extract inline styles to app.css`
3. `Extract static country and content data`
4. `Extract shared state and constants`
5. `Extract firebase chat and matchmaking helpers`
6. `Extract globe and label rendering`
7. `Extract solo mode logic`
8. `Extract multiplayer mode logic`
9. `Extract speed mode logic`
10. `Extract profile daily achievements leaderboard modules`
11. `Reduce index.html to shell and script includes`

## Что не делать в первом проходе

- не мигрировать сразу на bundler
- не заменять CDN на npm-пакеты
- не переписывать все на classes/framework
- не менять формат данных стран
- не объединять одновременно рефакторинг и редизайн
- не "оптимизировать" сетевую/Firebase логику до стабилизации структуры

## Следующий практический шаг

Самый безопасный следующий change-set:

1. добавить `.gitattributes`
2. вынести inline CSS в `assets/css/app.css`
3. локально проверить UI
4. только после этого переходить к JS extraction
