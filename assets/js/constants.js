const SUPPORTED_LANGUAGES=[
  {code:"ru",locale:"ru",label:"Русский"},
  {code:"en",locale:"en",label:"English"},
  {code:"uk",locale:"uk",label:"Українська"},
  {code:"pl",locale:"pl",label:"Polski"},
  {code:"de",locale:"de",label:"Deutsch"},
  {code:"fr",locale:"fr",label:"Français"},
  {code:"es",locale:"es",label:"Español"},
  {code:"pt",locale:"pt",label:"Português"},
  {code:"it",locale:"it",label:"Italiano"},
  {code:"tr",locale:"tr",label:"Türkçe"},
  {code:"zh",locale:"zh-Hans",label:"中文"},
  {code:"ja",locale:"ja",label:"日本語"},
  {code:"ko",locale:"ko",label:"한국어"},
  {code:"ar",locale:"ar",label:"العربية"},
  {code:"hi",locale:"hi",label:"हिन्दी"},
  {code:"id",locale:"id",label:"Indonesia"}
];

const LANGUAGE_BY_CODE=SUPPORTED_LANGUAGES.reduce((acc,item)=>{acc[item.code]=item;return acc;},{});

function normalizeLangCode(code){
  const base=String(code||"ru").toLowerCase().split("-")[0];
  return LANGUAGE_BY_CODE[base]?base:"ru";
}

let savedLang="ru";
try{
  savedLang=localStorage.getItem("worldorwrong.lang")||localStorage.getItem("geoquest.lang")||"ru";
}catch(_){}
window.lang=normalizeLangCode(savedLang);

const tr=(uk,pl,de,fr,es,pt,it,tr,zh,ja,ko,ar,hi,id)=>({uk,pl,de,fr,es,pt,it,tr,zh,ja,ko,ar,hi,id});
const UI_TRANSLATIONS={
  "Solo Game":tr("Одиночна гра","Gra solo","Einzelspiel","Solo","Juego individual","Jogo solo","Gioco singolo","Tek oyunculu","单人游戏","ソロゲーム","솔로 게임","لعبة فردية","एकल खेल","Game solo"),
  "Find the country or guess the name":tr("Знайди країну або вгадай назву","Znajdz kraj albo zgadnij nazwe","Finde das Land oder rate den Namen","Trouve le pays ou devine son nom","Encuentra el pais o adivina el nombre","Encontre o pais ou adivinhe o nome","Trova il paese o indovina il nome","Ulkeyi bul veya adini tahmin et","寻找国家或猜名称","国を探すか名前を当てよう","나라를 찾거나 이름을 맞히세요","اعثر على الدولة أو خمن الاسم","देश खोजें या नाम का अनुमान लगाएं","Temukan negara atau tebak namanya"),
  "Globe Viewer":tr("Перегляд глобуса","Widok globu","Globus ansehen","Voir le globe","Ver globo","Ver globo","Vista globo","Kureyi gor","地球浏览","地球を見る","지구본 보기","عرض الكرة الأرضية","ग्लोब देखें","Lihat globe"),
  "All countries with labels":tr("Усі країни з підписами","Wszystkie kraje z etykietami","Alle Lander mit Beschriftungen","Tous les pays avec noms","Todos los paises con etiquetas","Todos os paises com rotulos","Tutti i paesi con etichette","Etiketli tum ulkeler","所有国家带标签","すべての国名を表示","모든 국가 이름 표시","كل الدول مع التسميات","सभी देशों के नाम","Semua negara dengan label"),
  "Online Duel":tr("Дуель онлайн","Pojedynek online","Online-Duell","Duel en ligne","Duelo en linea","Duelo online","Duello online","Cevrimici duel","在线对决","オンライン対戦","온라인 결투","مبارزة عبر الإنترنت","ऑनलाइन द्वंद्व","Duel online"),
  "One picks a country — the other finds it. Then switch!":tr("Один загадує країну, інший шукає. Потім міняєтесь!","Jeden wybiera kraj, drugi go szuka. Potem zmiana!","Einer wahlt ein Land, der andere sucht. Dann Wechsel!","L'un choisit un pays, l'autre le trouve. Puis on inverse !","Uno elige un pais y el otro lo encuentra. Luego cambian.","Um escolhe um pais, o outro encontra. Depois trocam!","Uno sceglie un paese, l'altro lo trova. Poi si cambia!","Biri ulke secer, digeri bulur. Sonra degisin!","一人选国家，另一人寻找，然后交换！","一人が国を選び、もう一人が探す。交代しよう！","한 명이 나라를 고르고 다른 명이 찾습니다. 그다음 교대!","واحد يختار دولة والآخر يجدها، ثم التبديل!","एक देश चुनता है, दूसरा ढूंढता है। फिर बदलें!","Satu memilih negara, yang lain mencarinya. Lalu bertukar!"),
  "Random Opponent":tr("Випадковий суперник","Losowy przeciwnik","Zufalliger Gegner","Adversaire aleatoire","Rival aleatorio","Oponente aleatorio","Avversario casuale","Rastgele rakip","随机对手","ランダム対戦相手","무작위 상대","خصم عشوائي","यादृच्छिक प्रतिद्वंद्वी","Lawan acak"),
  "Find a random opponent online":tr("Знайди випадкового гравця онлайн","Znajdz losowego gracza online","Finde einen zufalligen Spieler online","Trouve un joueur au hasard en ligne","Encuentra un jugador aleatorio en linea","Encontre um jogador aleatorio online","Trova un giocatore casuale online","Cevrimici rastgele oyuncu bul","在线匹配随机玩家","オンラインでランダムな相手を探す","온라인 무작위 플레이어 찾기","اعثر على لاعب عشوائي عبر الإنترنت","ऑनलाइन यादृच्छिक खिलाड़ी खोजें","Cari pemain acak online"),
  "Daily Challenge":tr("Щоденний виклик","Wyzwanie dnia","Tagliche Herausforderung","Defi quotidien","Desafio diario","Desafio diario","Sfida giornaliera","Gunluk meydan okuma","每日挑战","デイリーチャレンジ","일일 도전","تحدي يومي","दैनिक चुनौती","Tantangan harian"),
  "Same challenge for everyone":tr("Однаковий виклик для всіх","To samo wyzwanie dla wszystkich","Gleiche Aufgabe fur alle","Le meme defi pour tous","El mismo desafio para todos","O mesmo desafio para todos","Stessa sfida per tutti","Herkes icin ayni gorev","所有人同一挑战","全員同じチャレンジ","모두에게 같은 도전","نفس التحدي للجميع","सबके लिए एक ही चुनौती","Tantangan yang sama untuk semua"),
  "Leaderboard":tr("Лідери","Ranking","Bestenliste","Classement","Clasificacion","Classificacao","Classifica","Lider tablosu","排行榜","ランキング","리더보드","لوحة الصدارة","लीडरबोर्ड","Papan peringkat"),
  "Global ranking":tr("Глобальний рейтинг","Ranking globalny","Globale Rangliste","Classement mondial","Ranking global","Ranking global","Classifica globale","Kuresel siralama","全球排名","世界ランキング","전 세계 순위","ترتيب عالمي","वैश्विक रैंकिंग","Peringkat global"),
  "Profile":tr("Профіль","Profil","Profil","Profil","Perfil","Perfil","Profilo","Profil","个人资料","プロフィール","프로필","الملف الشخصي","प्रोफ़ाइल","Profil"),
  "Stats and progress":tr("Статистика і прогрес","Statystyki i postep","Statistiken und Fortschritt","Stats et progression","Estadisticas y progreso","Estatisticas e progresso","Statistiche e progressi","Istatistikler ve ilerleme","统计与进度","統計と進行状況","통계와 진행도","الإحصاءات والتقدم","आंकड़े और प्रगति","Statistik dan progres"),
  "Achievements":tr("Досягнення","Osiagniecia","Erfolge","Succes","Logros","Conquistas","Obiettivi","Basarimlar","成就","実績","업적","الإنجازات","उपलब्धियां","Pencapaian"),
  "Collect all badges":tr("Збери всі нагороди","Zbierz wszystkie odznaki","Sammle alle Abzeichen","Collectionne tous les badges","Colecciona todas las insignias","Colete todos os emblemas","Colleziona tutti i badge","Tum rozetleri topla","收集所有徽章","すべてのバッジを集めよう","모든 배지 모으기","اجمع كل الشارات","सभी बैज इकट्ठा करें","Kumpulkan semua lencana"),
  "Labels":tr("Назви","Nazwy","Namen","Noms","Nombres","Nomes","Nomi","Isimler","名称","名前","이름","الأسماء","नाम","Nama"),
  "Menu":tr("Меню","Menu","Menu","Menu","Menu","Menu","Menu","Menu","菜单","メニュー","메뉴","القائمة","मेनू","Menu"),
  "Sign in with Google":tr("Увійти через Google","Zaloguj przez Google","Mit Google anmelden","Connexion avec Google","Iniciar sesion con Google","Entrar com Google","Accedi con Google","Google ile giris yap","使用 Google 登录","Googleでログイン","Google로 로그인","تسجيل الدخول عبر Google","Google से साइन इन करें","Masuk dengan Google"),
  "Sign In":tr("Увійти","Zaloguj","Anmelden","Connexion","Entrar","Entrar","Accedi","Giris","登录","ログイン","로그인","تسجيل الدخول","साइन इन","Masuk"),
  "Sign Out":tr("Вийти","Wyloguj","Abmelden","Deconnexion","Salir","Sair","Esci","Cikis","退出登录","ログアウト","로그아웃","تسجيل الخروج","साइन आउट","Keluar"),
  "Cancel":tr("Скасувати","Anuluj","Abbrechen","Annuler","Cancelar","Cancelar","Annulla","Iptal","取消","キャンセル","취소","إلغاء","रद्द करें","Batal"),
  "Find the country":tr("Знайди країну","Znajdz kraj","Land finden","Trouve le pays","Encuentra el pais","Encontre o pais","Trova il paese","Ulkeyi bul","寻找国家","国を探す","나라 찾기","اعثر على الدولة","देश खोजें","Temukan negara"),
  "Guess the name":tr("Вгадай назву","Zgadnij nazwe","Namen erraten","Devine le nom","Adivina el nombre","Adivinhe o nome","Indovina il nome","Adi tahmin et","猜名称","名前を当てる","이름 맞히기","خمن الاسم","नाम का अनुमान लगाएं","Tebak nama"),
  "Guess the capital":tr("Вгадай столицю","Zgadnij stolice","Hauptstadt erraten","Devine la capitale","Adivina la capital","Adivinhe a capital","Indovina la capitale","Baskenti tahmin et","猜首都","首都を当てる","수도 맞히기","خمن العاصمة","राजधानी का अनुमान लगाएं","Tebak ibu kota"),
  "Guess the flag":tr("Вгадай прапор","Zgadnij flage","Flagge erraten","Devine le drapeau","Adivina la bandera","Adivinhe a bandeira","Indovina la bandiera","Bayragi tahmin et","猜国旗","国旗を当てる","국기 맞히기","خمن العلم","झंडे का अनुमान लगाएं","Tebak bendera"),
  "Landmarks":tr("Пам'ятки","Zabytki","Sehenswurdigkeiten","Monuments","Monumentos","Pontos turisticos","Monumenti","Simgeler","地标","ランドマーク","랜드마크","معالم","स्थलचिह्न","Markah tanah"),
  "Country leader":tr("Лідер країни","Przywodca kraju","Landesfuhrer","Dirigeant du pays","Lider del pais","Lider do pais","Leader del paese","Ulke lideri","国家领导人","国のリーダー","국가 지도자","قائد الدولة","देश का नेता","Pemimpin negara"),
  "Religion":tr("Релігія","Religia","Religion","Religion","Religion","Religiao","Religione","Din","宗教","宗教","종교","الدين","धर्म","Agama"),
  "World":tr("Увесь світ","Caly swiat","Welt","Monde","Mundo","Mundo","Mondo","Dunya","世界","世界","전 세계","العالم","विश्व","Dunia"),
  "Europe":tr("Європа","Europa","Europa","Europe","Europa","Europa","Europa","Avrupa","欧洲","ヨーロッパ","유럽","أوروبا","यूरोप","Eropa"),
  "Asia":tr("Азія","Azja","Asien","Asie","Asia","Asia","Asia","Asya","亚洲","アジア","아시아","آسيا","एशिया","Asia"),
  "Eurasia":tr("Євразія","Eurazja","Eurasien","Eurasie","Eurasia","Eurasia","Eurasia","Avrasya","欧亚大陆","ユーラシア","유라시아","أوراسيا","यूरेशिया","Eurasia"),
  "Americas":tr("Америка","Ameryki","Amerika","Ameriques","Americas","Americas","Americhe","Amerikalar","美洲","アメリカ大陸","아메리카","الأمريكتان","अमेरिका","Amerika"),
  "Africa":tr("Африка","Afryka","Afrika","Afrique","Africa","Africa","Africa","Afrika","非洲","アフリカ","아프리카","إفريقيا","अफ्रीका","Afrika"),
  "Oceania":tr("Океанія","Oceania","Ozeanien","Oceanie","Oceania","Oceania","Oceania","Okyanusya","大洋洲","オセアニア","오세아니아","أوقيانوسيا","ओशिनिया","Oseania"),
  "Solo game":tr("Одиночна гра","Gra solo","Einzelspiel","Solo","Juego individual","Jogo solo","Gioco singolo","Tek oyunculu","单人游戏","ソロゲーム","솔로 게임","لعبة فردية","एकल खेल","Game solo"),
  "Choose a mode":tr("Обери режим","Wybierz tryb","Modus wahlen","Choisir un mode","Elige un modo","Escolha um modo","Scegli una modalita","Mod sec","选择模式","モードを選択","모드 선택","اختر الوضع","मोड चुनें","Pilih mode"),
  "Mode":tr("Режим","Tryb","Modus","Mode","Modo","Modo","Modalita","Mod","模式","モード","모드","الوضع","मोड","Mode"),
  "Difficulty":tr("Складність","Poziom trudnosci","Schwierigkeit","Difficulte","Dificultad","Dificuldade","Difficolta","Zorluk","难度","難易度","난이도","الصعوبة","कठिनाई","Kesulitan"),
  "Choose a region":tr("Обери регіон","Wybierz region","Region wahlen","Choisir une region","Elige una region","Escolha uma regiao","Scegli una regione","Bolge sec","选择地区","地域を選択","지역 선택","اختر المنطقة","क्षेत्र चुनें","Pilih wilayah"),
  "Start game":tr("Почати гру","Zacznij gre","Spiel starten","Commencer","Iniciar juego","Comecar jogo","Inizia partita","Oyunu baslat","开始游戏","ゲーム開始","게임 시작","ابدأ اللعبة","खेल शुरू करें","Mulai game"),
  "Back":tr("Назад","Wstecz","Zuruck","Retour","Atras","Voltar","Indietro","Geri","返回","戻る","뒤로","رجوع","वापस","Kembali"),
  "Modes":tr("Режими","Tryby","Modi","Modes","Modos","Modos","Modalita","Modlar","模式","モード","모드","الأوضاع","मोड","Mode"),
  "Easy":tr("Легкий","Latwy","Leicht","Facile","Facil","Facil","Facile","Kolay","简单","かんたん","쉬움","سهل","आसान","Mudah"),
  "Medium":tr("Середній","Sredni","Mittel","Moyen","Medio","Medio","Medio","Orta","中等","ふつう","보통","متوسط","मध्यम","Sedang"),
  "Hard":tr("Складний","Trudny","Schwer","Difficile","Dificil","Dificil","Difficile","Zor","困难","むずかしい","어려움","صعب","कठिन","Sulit"),
  "questions":tr("питань","pytan","Fragen","questions","preguntas","perguntas","domande","soru","题","問","문제","أسئلة","प्रश्न","pertanyaan"),
  "countries":tr("країн","krajow","Lander","pays","paises","paises","paesi","ulke","国家","国","국가","دول","देश","negara"),
  "Player":tr("Гравець","Gracz","Spieler","Joueur","Jugador","Jogador","Giocatore","Oyuncu","玩家","プレイヤー","플레이어","لاعب","खिलाड़ी","Pemain"),
  "Opponent":tr("Суперник","Przeciwnik","Gegner","Adversaire","Rival","Oponente","Avversario","Rakip","对手","相手","상대","خصم","प्रतिद्वंद्वी","Lawan"),
  "Opponent found":tr("Суперника знайдено","Znaleziono przeciwnika","Gegner gefunden","Adversaire trouve","Rival encontrado","Oponente encontrado","Avversario trovato","Rakip bulundu","找到对手","相手が見つかりました","상대를 찾았습니다","تم العثور على خصم","प्रतिद्वंद्वी मिला","Lawan ditemukan"),
  "Get ready! Match starts…":tr("Приготуйся! Матч починається…","Przygotuj sie! Mecz startuje…","Bereit machen! Match startet…","Prepare-toi ! Le match commence…","Preparate! La partida empieza…","Prepare-se! A partida comeca…","Preparati! La partita inizia…","Hazirlan! Mac basliyor…","准备好！比赛即将开始…","準備して！試合開始…","준비하세요! 경기가 시작됩니다…","استعد! تبدأ المباراة…","तैयार हो जाएं! मैच शुरू होता है…","Bersiap! Match dimulai…"),
  "Opponent locked in. Get ready!":tr("Суперник готовий. Приготуйся!","Przeciwnik gotowy. Przygotuj sie!","Gegner bereit. Mach dich fertig!","Adversaire pret. Prepare-toi !","Rival listo. Preparate!","Oponente pronto. Prepare-se!","Avversario pronto. Preparati!","Rakip hazir. Hazirlan!","对手已锁定。准备！","相手が決定。準備して！","상대 확정. 준비하세요!","تم تثبيت الخصم. استعد!","प्रतिद्वंद्वी तैयार। तैयार हो जाएं!","Lawan siap. Bersiap!"),
  "Searching for an opponent…":tr("Шукаємо суперника…","Szukamy przeciwnika…","Suche Gegner…","Recherche d'un adversaire…","Buscando rival…","Procurando oponente…","Cerco avversario…","Rakip araniyor…","正在寻找对手…","相手を検索中…","상대 검색 중…","جار البحث عن خصم…","प्रतिद्वंद्वी खोजा जा रहा है…","Mencari lawan…"),
  "Tap to choose a country":tr("Тапни, щоб загадати країну","Dotknij, aby wybrac kraj","Tippen, um ein Land zu wahlen","Touchez pour choisir un pays","Toca para elegir un pais","Toque para escolher um pais","Tocca per scegliere un paese","Ulke secmek icin dokun","点击选择国家","タップして国を選択","탭해서 나라 선택","اضغط لاختيار دولة","देश चुनने के लिए टैप करें","Ketuk untuk memilih negara"),
  "Answer: ":tr("Відповідь: ","Odpowiedz: ","Antwort: ","Reponse : ","Respuesta: ","Resposta: ","Risposta: ","Cevap: ","答案：","答え: ","정답: ","الإجابة: ","उत्तर: ","Jawaban: "),
  "Capital: ":tr("Столиця: ","Stolica: ","Hauptstadt: ","Capitale : ","Capital: ","Capital: ","Capitale: ","Baskent: ","首都：","首都: ","수도: ","العاصمة: ","राजधानी: ","Ibu kota: "),
  "Enter country name":tr("Введи назву країни","Wpisz nazwe kraju","Landesnamen eingeben","Entrez le nom du pays","Introduce el pais","Digite o nome do pais","Inserisci il nome del paese","Ulke adini gir","输入国家名称","国名を入力","국가 이름 입력","أدخل اسم الدولة","देश का नाम दर्ज करें","Masukkan nama negara"),
  "Enter the country name":tr("Введи назву країни","Wpisz nazwe kraju","Landesnamen eingeben","Entrez le nom du pays","Introduce el pais","Digite o nome do pais","Inserisci il nome del paese","Ulke adini gir","输入国家名称","国名を入力","국가 이름 입력","أدخل اسم الدولة","देश का नाम दर्ज करें","Masukkan nama negara"),
  "Enter country name…":tr("Введи назву країни…","Wpisz nazwe kraju…","Landesnamen eingeben…","Entrez le nom du pays…","Introduce el pais…","Digite o nome do pais…","Inserisci il nome del paese…","Ulke adini gir…","输入国家名称…","国名を入力…","국가 이름 입력…","أدخل اسم الدولة…","देश का नाम दर्ज करें…","Masukkan nama negara…"),
  "Enter this country capital":tr("Введи столицю цієї країни","Wpisz stolice tego kraju","Hauptstadt dieses Landes eingeben","Entrez la capitale de ce pays","Introduce la capital de este pais","Digite a capital deste pais","Inserisci la capitale di questo paese","Bu ulkenin baskentini gir","输入该国首都","この国の首都を入力","이 나라의 수도 입력","أدخل عاصمة هذه الدولة","इस देश की राजधानी दर्ज करें","Masukkan ibu kota negara ini"),
  "Enter capital…":tr("Введи столицю…","Wpisz stolice…","Hauptstadt eingeben…","Entrez la capitale…","Introduce la capital…","Digite a capital…","Inserisci la capitale…","Baskenti gir…","输入首都…","首都を入力…","수도 입력…","أدخل العاصمة…","राजधानी दर्ज करें…","Masukkan ibu kota…"),
  "Choose the correct country":tr("Обери правильну країну","Wybierz poprawny kraj","Wahle das richtige Land","Choisis le bon pays","Elige el pais correcto","Escolha o pais correto","Scegli il paese corretto","Dogru ulkeyi sec","选择正确国家","正しい国を選択","올바른 국가 선택","اختر الدولة الصحيحة","सही देश चुनें","Pilih negara yang benar"),
  "Choose the correct leader":tr("Обери правильного лідера","Wybierz poprawnego lidera","Wahle den richtigen Anfuhrer","Choisis le bon dirigeant","Elige el lider correcto","Escolha o lider correto","Scegli il leader corretto","Dogru lideri sec","选择正确领导人","正しいリーダーを選択","올바른 지도자 선택","اختر القائد الصحيح","सही नेता चुनें","Pilih pemimpin yang benar"),
  "Choose the correct religion":tr("Обери правильну релігію","Wybierz poprawna religie","Wahle die richtige Religion","Choisis la bonne religion","Elige la religion correcta","Escolha a religiao correta","Scegli la religione corretta","Dogru dini sec","选择正确宗教","正しい宗教を選択","올바른 종교 선택","اختر الدين الصحيح","सही धर्म चुनें","Pilih agama yang benar"),
  "FIND THE COUNTRY":tr("ЗНАЙДИ КРАЇНУ","ZNAJDZ KRAJ","FINDE DAS LAND","TROUVE LE PAYS","ENCUENTRA EL PAIS","ENCONTRE O PAIS","TROVA IL PAESE","ULKEYI BUL","寻找国家","国を探せ","나라를 찾으세요","اعثر على الدولة","देश खोजें","TEMUKAN NEGARA"),
  "WHAT COUNTRY IS THIS?":tr("ЩО ЦЕ ЗА КРАЇНА?","JAKI TO KRAJ?","WELCHES LAND IST DAS?","QUEL EST CE PAYS ?","QUE PAIS ES ESTE?","QUE PAIS E ESTE?","CHE PAESE E?","BU HANGI ULKE?","这是哪个国家？","これはどの国？","어느 나라일까요?","ما هذه الدولة؟","यह कौन सा देश है?","NEGARA APA INI?"),
  "WHAT IS THE CAPITAL?":tr("ЯКА СТОЛИЦЯ?","JAKA JEST STOLICA?","WAS IST DIE HAUPTSTADT?","QUELLE EST LA CAPITALE ?","CUAL ES LA CAPITAL?","QUAL E A CAPITAL?","QUAL E LA CAPITALE?","BASKENT NERESI?","首都是哪里？","首都はどこ？","수도는 어디인가요?","ما العاصمة؟","राजधानी क्या है?","APA IBU KOTANYA?"),
  "WHOSE FLAG IS THIS?":tr("ЧИЙ ЦЕ ПРАПОР?","CZYJA TO FLAGA?","WESSEN FLAGGE IST DAS?","A QUI EST CE DRAPEAU ?","DE QUIEN ES ESTA BANDERA?","DE QUEM E ESTA BANDEIRA?","DI CHI E QUESTA BANDIERA?","BU KIMIN BAYRAGI?","这是谁的国旗？","これはどの国旗？","누구의 국기인가요?","لمن هذا العلم؟","यह किसका झंडा है?","BENDERA SIAPA INI?"),
  "WHICH COUNTRY HAS THIS LANDMARK?":tr("У ЯКІЙ КРАЇНІ ЦЯ ПАМ'ЯТКА?","W JAKIM KRAJU JEST TEN ZABYTEK?","IN WELCHEM LAND IST DIESE SEHENSWURDIGKEIT?","DANS QUEL PAYS EST CE MONUMENT ?","EN QUE PAIS ESTA ESTE MONUMENTO?","EM QUE PAIS FICA ESTE MARCO?","IN QUALE PAESE SI TROVA QUESTO MONUMENTO?","BU SIMGE HANGI ULKEDE?","这个地标在哪个国家？","このランドマークはどの国？","이 랜드마크는 어느 나라에 있나요?","في أي دولة يوجد هذا المعلم؟","यह स्थलचिह्न किस देश में है?","MARKAH INI ADA DI NEGARA MANA?"),
  "WHO LEADS THIS COUNTRY?":tr("ХТО ОЧОЛЮЄ ЦЮ КРАЇНУ?","KTO RZADZI TYM KRAJEM?","WER FUHRT DIESES LAND?","QUI DIRIGE CE PAYS ?","QUIEN LIDERA ESTE PAIS?","QUEM LIDERA ESTE PAIS?","CHI GUIDA QUESTO PAESE?","BU ULKEYI KIM YONETIYOR?","谁领导这个国家？","この国のリーダーは誰？","이 나라의 지도자는 누구인가요?","من يقود هذه الدولة؟","इस देश का नेता कौन है?","SIAPA PEMIMPIN NEGARA INI?"),
  "MAIN RELIGION OF THIS COUNTRY?":tr("ГОЛОВНА РЕЛІГІЯ ЦІЄЇ КРАЇНИ?","GLOWNA RELIGIA TEGO KRAJU?","HAUPTRELIGION DIESES LANDES?","RELIGION PRINCIPALE DE CE PAYS ?","RELIGION PRINCIPAL DE ESTE PAIS?","RELIGIAO PRINCIPAL DESTE PAIS?","RELIGIONE PRINCIPALE DI QUESTO PAESE?","BU ULKENIN ANA DINI?","这个国家的主要宗教？","この国の主な宗教は？","이 나라의 주요 종교는?","ما الدين الرئيسي في هذه الدولة؟","इस देश का मुख्य धर्म?","AGAMA UTAMA NEGARA INI?"),
  "Not enough countries in this region!":tr("У цьому регіоні замало країн!","Za malo krajow w tym regionie!","Nicht genug Lander in dieser Region!","Pas assez de pays dans cette region !","No hay suficientes paises en esta region.","Nao ha paises suficientes nesta regiao!","Non ci sono abbastanza paesi in questa regione!","Bu bolgede yeterli ulke yok!","该地区国家数量不足！","この地域には国が足りません！","이 지역에는 국가가 부족합니다!","لا توجد دول كافية في هذه المنطقة!","इस क्षेत्र में पर्याप्त देश नहीं हैं!","Negara di wilayah ini belum cukup!")
};

const REGION_LABELS={
  world:{ru:"Весь мир",en:"World",uk:"Увесь світ",pl:"Caly swiat",de:"Welt",fr:"Monde",es:"Mundo",pt:"Mundo",it:"Mondo",tr:"Dunya",zh:"世界",ja:"世界",ko:"전 세계",ar:"العالم",hi:"विश्व",id:"Dunia"},
  europe:{ru:"Европа",en:"Europe",uk:"Європа",pl:"Europa",de:"Europa",fr:"Europe",es:"Europa",pt:"Europa",it:"Europa",tr:"Avrupa",zh:"欧洲",ja:"ヨーロッパ",ko:"유럽",ar:"أوروبا",hi:"यूरोप",id:"Eropa"},
  asia:{ru:"Азия",en:"Asia",uk:"Азія",pl:"Azja",de:"Asien",fr:"Asie",es:"Asia",pt:"Asia",it:"Asia",tr:"Asya",zh:"亚洲",ja:"アジア",ko:"아시아",ar:"آسيا",hi:"एशिया",id:"Asia"},
  eurasia:{ru:"Евразия",en:"Eurasia",uk:"Євразія",pl:"Eurazja",de:"Eurasien",fr:"Eurasie",es:"Eurasia",pt:"Eurasia",it:"Eurasia",tr:"Avrasya",zh:"欧亚大陆",ja:"ユーラシア",ko:"유라시아",ar:"أوراسيا",hi:"यूरेशिया",id:"Eurasia"},
  americas:{ru:"Америка",en:"Americas",uk:"Америка",pl:"Ameryki",de:"Amerika",fr:"Ameriques",es:"Americas",pt:"Americas",it:"Americhe",tr:"Amerikalar",zh:"美洲",ja:"アメリカ大陸",ko:"아메리카",ar:"الأمريكتان",hi:"अमेरिका",id:"Amerika"},
  africa:{ru:"Африка",en:"Africa",uk:"Африка",pl:"Afryka",de:"Afrika",fr:"Afrique",es:"Africa",pt:"Africa",it:"Africa",tr:"Afrika",zh:"非洲",ja:"アフリカ",ko:"아프리카",ar:"إفريقيا",hi:"अफ्रीका",id:"Afrika"},
  oceania:{ru:"Океания",en:"Oceania",uk:"Океанія",pl:"Oceania",de:"Ozeanien",fr:"Oceanie",es:"Oceania",pt:"Oceania",it:"Oceania",tr:"Okyanusya",zh:"大洋洲",ja:"オセアニア",ko:"오세아니아",ar:"أوقيانوسيا",hi:"ओशिनिया",id:"Oseania"}
};

const rtr=(en,uk,pl,de,fr,es,pt,it,tr,zh,ja,ko,ar,hi,id)=>({en,uk,pl,de,fr,es,pt,it,tr,zh,ja,ko,ar,hi,id});
const RELIGION_TRANSLATIONS={
  "Ислам":rtr("Islam","Іслам","Islam","Islam","Islam","Islam","Isla","Islam","Islam","伊斯兰教","イスラム教","이슬람교","الإسلام","इस्लाम","Islam"),
  "Христианство":rtr("Christianity","Християнство","Chrzescijanstwo","Christentum","Christianisme","Cristianismo","Cristianismo","Cristianesimo","Hristiyanlik","基督教","キリスト教","기독교","المسيحية","ईसाई धर्म","Kekristenan"),
  "Православие":rtr("Orthodoxy","Православ'я","Prawoslawie","Orthodoxie","Orthodoxie","Ortodoxia","Ortodoxia","Ortodossia","Ortodoksluk","东正教","正教会","정교회","الأرثوذكسية","ऑर्थोडॉक्स","Ortodoks"),
  "Буддизм":rtr("Buddhism","Буддизм","Buddyzm","Buddhismus","Bouddhisme","Budismo","Budismo","Buddhismo","Budizm","佛教","仏教","불교","البوذية","बौद्ध धर्म","Buddhisme"),
  "Индуизм":rtr("Hinduism","Індуїзм","Hinduizm","Hinduismus","Hindouisme","Hinduismo","Hinduismo","Induismo","Hinduizm","印度教","ヒンドゥー教","힌두교","الهندوسية","हिंदू धर्म","Hindu"),
  "Иудаизм":rtr("Judaism","Юдаїзм","Judaizm","Judentum","Judaisme","Judaismo","Judaismo","Ebraismo","Yahudilik","犹太教","ユダヤ教","유대교","اليهودية","यहूदी धर्म","Yudaisme"),
  "Католицизм":rtr("Catholicism","Католицизм","Katolicyzm","Katholizismus","Catholicisme","Catolicismo","Catolicismo","Cattolicesimo","Katoliklik","天主教","カトリック","가톨릭","الكاثوليكية","कैथोलिक धर्म","Katolik"),
  "Лютеранство":rtr("Lutheranism","Лютеранство","Luteranizm","Luthertum","Lutheranisme","Luteranismo","Luteranismo","Luteranesimo","Lutercilik","路德宗","ルター派","루터교","اللوثرية","लूथरन धर्म","Lutheran"),
  "Синтоизм":rtr("Shintoism","Синтоїзм","Shintoizm","Shintoismus","Shintoisme","Sintoismo","Xintoismo","Shintoismo","Sintoizm","神道教","神道","신토","الشنتوية","शिंतो","Shinto"),
  "Атеизм":rtr("Atheism","Атеїзм","Ateizm","Atheismus","Atheisme","Ateismo","Ateismo","Ateismo","Ateizm","无神论","無神論","무신론","الإلحاد","नास्तिकता","Ateisme")
};

window.SUPPORTED_LANGUAGES=SUPPORTED_LANGUAGES;
window.REGION_LABELS=REGION_LABELS;
window.getCurrentLangConfig=getCurrentLangConfig;
window.RELIGION_TRANSLATIONS=RELIGION_TRANSLATIONS;

function getCurrentLangConfig(){
  return LANGUAGE_BY_CODE[normalizeLangCode(window.lang)]||LANGUAGE_BY_CODE.ru;
}

function setBaseLang(code){
  window.lang=normalizeLangCode(code);
  try{localStorage.setItem("worldorwrong.lang",window.lang);}catch(_){}
  if(typeof document!=="undefined") document.documentElement.lang=getCurrentLangConfig().locale;
  if(typeof rebuildLocalizedAliases==="function") rebuildLocalizedAliases();
  return window.lang;
}

function nextLangCode(){
  const idx=SUPPORTED_LANGUAGES.findIndex(item=>item.code===normalizeLangCode(window.lang));
  return SUPPORTED_LANGUAGES[(idx+1)%SUPPORTED_LANGUAGES.length].code;
}

function languageDisplayLabel(code=window.lang){
  return (LANGUAGE_BY_CODE[normalizeLangCode(code)]||LANGUAGE_BY_CODE.ru).label;
}

function stripDecorativePrefix(text){
  const source=String(text||"");
  const match=source.match(/^([^A-Za-zА-Яа-яЁёІіЇїЄєҐґÀ-ž一-龯ぁ-んァ-ン가-힣ء-يअ-ह]+)(.+)$/u);
  return match?{prefix:match[1],body:match[2].trim()}:{prefix:"",body:source.trim()};
}

function translatePhrase(ru,en){
  const code=normalizeLangCode(window.lang);
  if(code==="ru") return ru;
  if(code==="en") return en||ru;
  const source=en||ru||"";
  const stripped=stripDecorativePrefix(source);
  const ruStripped=stripDecorativePrefix(ru||"");
  const record=
    UI_TRANSLATIONS[source]||
    UI_TRANSLATIONS[stripped.body]||
    UI_TRANSLATIONS[stripped.body.toUpperCase()]||
    UI_TRANSLATIONS[ru]||
    UI_TRANSLATIONS[ruStripped.body]||
    UI_TRANSLATIONS[ruStripped.body.toUpperCase()];
  return record?.[code] ? `${stripped.prefix}${record[code]}` : (en||ru);
}

window.setBaseLang=setBaseLang;
window.nextLangCode=nextLangCode;
window.languageDisplayLabel=languageDisplayLabel;
window.t=translatePhrase;
window.pickLocalized=function(value){
  if(!value) return "";
  const code=normalizeLangCode(window.lang);
  if(typeof value==="string") return value;
  if(value[code]) return value[code];
  return translatePhrase(value.ru,value.en);
};
window.getRegionLabel=function(region){
  const labels=REGION_LABELS[region]||{};
  return labels[normalizeLangCode(window.lang)]||labels.en||labels.ru||String(region||"");
};
window.localizedReligionName=function(religion){
  const code=normalizeLangCode(window.lang);
  if(code==="ru") return religion||"";
  const record=RELIGION_TRANSLATIONS[religion]||null;
  return record?.[code]||record?.en||religion||"";
};

window.COUNTRY_ALPHA2={
  4:"af",8:"al",12:"dz",20:"ad",24:"ao",32:"ar",36:"au",40:"at",31:"az",44:"bs",48:"bh",50:"bd",51:"am",52:"bb",56:"be",64:"bt",68:"bo",70:"ba",72:"bw",76:"br",84:"bz",96:"bn",100:"bg",104:"mm",108:"bi",112:"by",116:"kh",120:"cm",124:"ca",132:"cv",140:"cf",144:"lk",148:"td",152:"cl",156:"cn",170:"co",174:"km",178:"cg",180:"cd",188:"cr",191:"hr",192:"cu",196:"cy",203:"cz",204:"bj",208:"dk",214:"do",218:"ec",222:"sv",226:"gq",231:"et",232:"er",233:"ee",242:"fj",246:"fi",250:"fr",262:"dj",266:"ga",268:"ge",270:"gm",276:"de",288:"gh",300:"gr",320:"gt",324:"gn",328:"gy",332:"ht",340:"hn",348:"hu",352:"is",356:"in",360:"id",364:"ir",368:"iq",372:"ie",376:"il",380:"it",384:"ci",388:"jm",392:"jp",398:"kz",400:"jo",404:"ke",408:"kp",410:"kr",414:"kw",417:"kg",418:"la",422:"lb",426:"ls",428:"lv",430:"lr",434:"ly",440:"lt",442:"lu",450:"mg",454:"mw",458:"my",462:"mv",466:"ml",470:"mt",478:"mr",480:"mu",484:"mx",496:"mn",498:"md",499:"me",504:"ma",508:"mz",512:"om",516:"na",524:"np",528:"nl",554:"nz",558:"ni",562:"ne",566:"ng",578:"no",586:"pk",591:"pa",598:"pg",600:"py",604:"pe",608:"ph",616:"pl",620:"pt",624:"gw",626:"tl",634:"qa",642:"ro",643:"ru",646:"rw",682:"sa",686:"sn",688:"rs",690:"sc",694:"sl",702:"sg",703:"sk",704:"vn",705:"si",706:"so",710:"za",716:"zw",724:"es",728:"ss",729:"sd",740:"sr",748:"sz",752:"se",756:"ch",760:"sy",762:"tj",764:"th",768:"tg",780:"tt",784:"ae",788:"tn",792:"tr",795:"tm",800:"ug",804:"ua",807:"mk",818:"eg",826:"gb",834:"tz",840:"us",854:"bf",858:"uy",860:"uz",862:"ve",887:"ye",894:"zm"
};
Object.assign(window.COUNTRY_ALPHA2,{
  28:"ag",90:"sb",212:"dm",296:"ki",308:"gd",438:"li",492:"mc",520:"nr",548:"vu",
  583:"fm",584:"mh",585:"pw",659:"kn",662:"lc",670:"vc",674:"sm",678:"st",
  776:"to",796:"tc",798:"tv",882:"ws"
});

const COUNTRY_DISPLAY_NAMES={};
function getDisplayNames(code){
  const cfg=LANGUAGE_BY_CODE[normalizeLangCode(code)]||LANGUAGE_BY_CODE.en;
  if(!COUNTRY_DISPLAY_NAMES[cfg.code]){
    try{COUNTRY_DISPLAY_NAMES[cfg.code]=new Intl.DisplayNames([cfg.locale],{type:"region"});}catch(_){COUNTRY_DISPLAY_NAMES[cfg.code]=null;}
  }
  return COUNTRY_DISPLAY_NAMES[cfg.code];
}

function localizedCountryName(id,code=window.lang){
  const langCode=normalizeLangCode(code);
  const num=Number(id);
  if(langCode==="ru") return COUNTRIES[num]?.n||String(id);
  if(langCode==="en") return EN[num]||COUNTRIES[num]?.n||String(id);
  const alpha=window.COUNTRY_ALPHA2[num];
  const names=getDisplayNames(langCode);
  if(alpha&&names){
    try{
      const label=names.of(alpha.toUpperCase());
      if(label) return label;
    }catch(_){}
  }
  return EN[num]||COUNTRIES[num]?.n||String(id);
}

window.cName=function(id){return localizedCountryName(id);};
window.capName=function(id){if(!CAPITALS[id])return"?";return normalizeLangCode(window.lang)==="ru"?CAPITALS[id][0]:CAPITALS[id][1];};
window.localizedCountryName=localizedCountryName;
window.BIG_C=new Set([643,840,36,76,124,156,356]);
window.SMALL_C=new Set([56,196,442,705,703,191,372,376,51,470,492,438]);

window.COUNTRY_NAME_TO_ID={};
function normalizeAnswer(value){
  return String(value||"")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[’'`]/g,"")
    .replace(/\s+/g," ");
}
window.normalizeAnswer=normalizeAnswer;

function registerCountryAlias(id,name){
  const key=normalizeAnswer(name);
  if(!key) return;
  window.COUNTRY_NAME_TO_ID[key]=Number(id);
  if(window.ALIASES&&COUNTRIES[id]?.n) window.ALIASES[key]=COUNTRIES[id].n;
}

function rebuildLocalizedAliases(){
  if(!window.COUNTRIES) return;
  window.COUNTRY_NAME_TO_ID={};
  Object.keys(COUNTRIES).forEach(id=>{
    registerCountryAlias(id,COUNTRIES[id]?.n);
    registerCountryAlias(id,EN[id]);
    SUPPORTED_LANGUAGES.forEach(item=>registerCountryAlias(id,localizedCountryName(id,item.code)));
  });
  if(window.MANUAL_ALIASES){
    Object.entries(window.MANUAL_ALIASES).forEach(([alias,id])=>registerCountryAlias(id,alias));
  }
}
window.rebuildLocalizedAliases=rebuildLocalizedAliases;
window.resolveCountryInput=function(value){
  const key=normalizeAnswer(value);
  return window.COUNTRY_NAME_TO_ID[key]||null;
};
window.countryInputMatches=function(value,id){
  return Number(window.resolveCountryInput(value))===Number(id);
};

setBaseLang(window.lang);
rebuildLocalizedAliases();
