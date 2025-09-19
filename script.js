const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const statsScreen = document.getElementById('stats-screen');
const leaderboardList = document.getElementById('leaderboard-list');

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const scoreDisplay = document.getElementById('score-display');
const nextPlayerBtn = document.getElementById('next-player');

const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

let username = '';
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let lockOptions = false; 
let userAnswers = []; 

let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');


const allQuestions = [
    // Kolay (1-10)
    {
        q: "Bir sosyal sorumluluk projesinde yaşlılara yardım etmek hangi temaya girer?",
        options: ["Teknoloji", "Eğitim", "Dayanışma", "Moda"],
        answer: "Dayanışma",
        properAnswer: "Yaşlılara yardım etmek dayanışma temalı sosyal sorumluluk projelerine örnektir.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Plastik poşet yerine bez çanta kullanmak hangi sosyal sorumluluk örneğidir?",
        options: ["Çevre duyarlılığı", "Sağlık hizmeti", "Spor etkinliği", "Reklam çalışması"],
        answer: "Çevre duyarlılığı",
        properAnswer: "Bez çanta kullanmak çevre duyarlılığı temalı bir sosyal sorumluluk örneğidir.",
        level: "kolay",
        topic: "Çevre"
    },
    {
        q: "Bir okulun köydeki çocuklara kitap bağışlaması hangi temaya girer?",
        options: ["Eğitim", "Moda", "Ticaret", "Eğlence"],
        answer: "Eğitim",
        properAnswer: "Kitap bağışı, eğitim temalı sosyal sorumluluk projesidir.",
        level: "kolay",
        topic: "Eğitim"
    },
    {
        q: "Sosyal sorumluluk projelerinin gönüllüler için sağladığı en büyük kazanç nedir?",
        options: ["Maddi gelir", "Yeni dostluklar ve deneyim", "Rekabet üstünlüğü", "Popülerlik"],
        answer: "Yeni dostluklar ve deneyim",
        properAnswer: "Gönüllüler, sosyal sorumluluk projelerinde yeni dostluklar kurar ve deneyim kazanır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Sokak hayvanlarına mama bırakmak hangi sosyal sorumluluk alanına girer?",
        options: ["Hayvan hakları", "Moda", "Reklam", "Eğlence"],
        answer: "Hayvan hakları",
        properAnswer: "Sokak hayvanlarına mama bırakmak hayvan hakları alanına girer.",
        level: "kolay",
        topic: "Haklar"
    },
    {
        q: "Öğrencilerin okulda çevre temizliği yapması hangi sosyal sorumluluk faaliyetidir?",
        options: ["Çöp toplama etkinliği", "Spor turnuvası", "Tiyatro oyunu", "Reklam filmi"],
        answer: "Çöp toplama etkinliği",
        properAnswer: "Çevre temizliği yapmak çöp toplama etkinliği kapsamında bir sosyal sorumluluk faaliyetidir.",
        level: "kolay",
        topic: "Çevre"
    },
    {
        q: "Sosyal sorumluluk projeleri neden toplum için önemlidir?",
        options: ["Kâr sağlar", "Toplumsal farkındalık oluşturur", "Sadece eğlence sunar", "Moda yaratır"],
        answer: "Toplumsal farkındalık oluşturur",
        properAnswer: "Sosyal sorumluluk projeleri toplumda farkındalık yaratır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Çocuklara ücretsiz aşı kampanyası düzenlemek hangi temaya girer?",
        options: ["Sağlık", "Moda", "Spor", "Teknoloji"],
        answer: "Sağlık",
        properAnswer: "Ücretsiz aşı kampanyası sağlık temalı bir sosyal sorumluluk projesidir.",
        level: "kolay",
        topic: "Sağlık"
    },
    {
        q: "Bir köy okuluna kırtasiye yardımında bulunmak hangi proje örneğidir?",
        options: ["Eğitim desteği", "Spor faaliyeti", "Reklam çalışması", "Moda akımı"],
        answer: "Eğitim desteği",
        properAnswer: "Kırtasiye yardımı eğitim desteği sağlayan bir sosyal sorumluluk projesidir.",
        level: "kolay",
        topic: "Eğitim"
    },
    {
        q: "Gönüllülük esasına dayalı projelerde temel amaç nedir?",
        options: ["Topluma katkı sağlamak", "Yalnızca para kazanmak", "Rekabet etmek", "Eğlence sunmak"],
        answer: "Topluma katkı sağlamak",
        properAnswer: "Gönüllülük esaslı projelerin temel amacı topluma katkı sağlamaktır.",
        level: "kolay",
        topic: "Genel"
    },

    // Orta (11-20)
    {
        q: "Çocuk işçiliğini önlemeye yönelik projeler hangi hakka vurgu yapar?",
        options: ["Çalışma hakkı", "Eğitim hakkı", "Mülkiyet hakkı", "Seyahat hakkı"],
        answer: "Eğitim hakkı",
        properAnswer: "Çocuk işçiliğini önlemeye yönelik projeler eğitim hakkına vurgu yapar.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "Bir sosyal sorumluluk projesinde “şeffaflık” neden önemlidir?",
        options: ["Rekabeti artırır", "Toplumun güvenini kazanır", "Eğlence sağlar", "Harcamaları gizler"],
        answer: "Toplumun güvenini kazanır",
        properAnswer: "Şeffaflık, sosyal sorumluluk projelerinde toplumun güvenini sağlar.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Üniversite öğrencilerinin köy okullarına gidip ders vermesi hangi temaya girer?",
        options: ["Eğitimde fırsat eşitliği", "Spor desteği", "Moda akımı", "Reklam kampanyası"],
        answer: "Eğitimde fırsat eşitliği",
        properAnswer: "Köy okullarına gidip ders vermek eğitimde fırsat eşitliği temalı bir projedir.",
        level: "orta",
        topic: "Eğitim"
    },
    {
        q: "Çevreye zarar veren fabrikalara karşı yapılan farkındalık kampanyası ne tür bir sosyal sorumluluk örneğidir?",
        options: ["Çevresel hak savunuculuğu", "Rekabeti artırma", "Eğlence organizasyonu", "Moda projesi"],
        answer: "Çevresel hak savunuculuğu",
        properAnswer: "Fabrikalara karşı yapılan kampanya çevresel hak savunuculuğu örneğidir.",
        level: "orta",
        topic: "Çevre"
    },
    {
        q: "Sosyal sorumluluk projelerinde “iş birliği”nin temel yararı nedir?",
        options: ["Projenin daha etkili olması", "Rekabeti artırması", "Popülerlik sağlaması", "Bireysel kazanç getirmesi"],
        answer: "Projenin daha etkili olması",
        properAnswer: "İş birliği projelerin daha etkili ve geniş kapsamlı olmasını sağlar.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Kadınların meslek edinmesini sağlayan projeler hangi temayı güçlendirir?",
        options: ["Toplumsal cinsiyet eşitliği", "Spor faaliyetleri", "Çevre duyarlılığı", "Rekabet ortamı"],
        answer: "Toplumsal cinsiyet eşitliği",
        properAnswer: "Kadınların meslek edinmesini sağlayan projeler toplumsal cinsiyet eşitliğini güçlendirir.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "“Toplum yararına çalışma programları” en çok hangi gruba fayda sağlar?",
        options: ["İşsiz bireylere", "Moda takipçilerine", "Sporculara", "Reklam şirketlerine"],
        answer: "İşsiz bireylere",
        properAnswer: "Toplum yararına çalışma programları işsiz bireylere fayda sağlar.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde en sık karşılaşılan sorunlardan biri nedir?",
        options: ["Kaynak eksikliği", "Aşırı destek", "Gereksiz reklam", "Fazla gönüllü"],
        answer: "Kaynak eksikliği",
        properAnswer: "Projelerde en sık karşılaşılan sorun kaynak eksikliğidir.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Hayvan haklarını savunan projelerde en önemli amaç nedir?",
        options: ["Hayvanların yaşam koşullarını iyileştirmek", "Reklam yapmak", "Eğlence sağlamak", "Ticaret yapmak"],
        answer: "Hayvanların yaşam koşullarını iyileştirmek",
        properAnswer: "Hayvan haklarını savunan projelerde amaç hayvanların yaşam koşullarını iyileştirmektir.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "Sosyal sorumluluk projeleri gençlere hangi beceriyi kazandırır?",
        options: ["Liderlik ve iletişim", "Rekabet duygusu", "Moda bilgisi", "Maddi kazanç"],
        answer: "Liderlik ve iletişim",
        properAnswer: "Projeler gençlere liderlik ve iletişim becerisi kazandırır.",
        level: "orta",
        topic: "Genel"
    },

    // Zor (21-30)
    {
        q: "Sosyal sorumluluk projelerinde “etki ölçümü” neden yapılır?",
        options: ["Projenin topluma sağladığı faydayı görmek", "Reklam gelirlerini artırmak", "Popülerliği ölçmek", "Katılımcı sayısını saymak"],
        answer: "Projenin topluma sağladığı faydayı görmek",
        properAnswer: "Etki ölçümü, projenin topluma sağladığı faydayı görmeyi sağlar.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal girişimcilik ile sosyal sorumluluk arasındaki fark nedir?",
        options: ["Sosyal girişimcilik sürdürülebilir iş modeliyle topluma fayda sağlar, sosyal sorumluluk daha çok gönüllü katkıdır", "Sosyal girişimcilik eğlence amaçlıdır, sosyal sorumluluk iş odaklıdır", "İkisi de tamamen aynıdır", "Sosyal girişimcilik sadece moda sektöründe görülür"],
        answer: "Sosyal girişimcilik sürdürülebilir iş modeliyle topluma fayda sağlar, sosyal sorumluluk daha çok gönüllü katkıdır",
        properAnswer: "Sosyal girişimcilik sürdürülebilir iş modeliyle topluma fayda sağlar; sosyal sorumluluk ise gönüllü katkıdır.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "“Kurumsal sosyal sorumluluk raporları”nın temel işlevi nedir?",
        options: ["Şirketin toplumsal etkilerini şeffaf biçimde paylaşmak", "Reklam yapmak", "Sadece kâr göstermek", "Moda trendlerini tanıtmak"],
        answer: "Şirketin toplumsal etkilerini şeffaf biçimde paylaşmak",
        properAnswer: "Kurumsal sosyal sorumluluk raporları şirketin toplumsal etkilerini şeffaf biçimde paylaşmasını sağlar.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Çocuk haklarıyla ilgili sosyal sorumluluk projeleri hangi uluslararası belgeye dayanır?",
        options: ["Birleşmiş Milletler Çocuk Hakları Sözleşmesi", "Magna Carta", "Lozan Antlaşması", "Sevr Antlaşması"],
        answer: "Birleşmiş Milletler Çocuk Hakları Sözleşmesi",
        properAnswer: "Çocuk haklarıyla ilgili projeler BM Çocuk Hakları Sözleşmesine dayanır.",
        level: "zor",
        topic: "Haklar"
    },
    {
        q: "Birleşmiş Milletler’in belirlediği 17 “Sürdürülebilir Kalkınma Hedefi”nin amacı nedir?",
        options: ["Yoksulluğu azaltmak ve gezegeni korumak", "Moda akımlarını yaymak", "Şirketlerin kârını artırmak", "Rekabeti teşvik etmek"],
        answer: "Yoksulluğu azaltmak ve gezegeni korumak",
        properAnswer: "BM'nin 17 sürdürülebilir kalkınma hedefinin amacı yoksulluğu azaltmak ve gezegeni korumaktır.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "“Toplumsal cinsiyet eşitliği” temalı projelerin uzun vadeli toplumsal katkısı nedir?",
        options: ["Kadın ve erkeklerin eşit fırsatlara sahip olması", "Yalnızca kadınların ön plana çıkması", "Rekabetin artması", "Moda sektörünün gelişmesi"],
        answer: "Kadın ve erkeklerin eşit fırsatlara sahip olması",
        properAnswer: "Toplumsal cinsiyet eşitliği projeleri, kadın ve erkeklerin eşit fırsatlara sahip olmasını sağlar.",
        level: "zor",
        topic: "Haklar"
    },
    {
        q: "“Yeşil ekonomi”yi destekleyen sosyal sorumluluk projeleri en çok hangi küresel soruna çözüm arar?",
        options: ["İklim değişikliği", "Rekabet eksikliği", "Moda yetersizliği", "Sağlık turizmi"],
        answer: "İklim değişikliği",
        properAnswer: "Yeşil ekonomi projeleri iklim değişikliği sorununa çözüm arar.",
        level: "zor",
        topic: "Çevre"
    },
    {
        q: "Bir sosyal sorumluluk projesinin başarısında “yerel halkın katılımı” neden önemlidir?",
        options: ["Projenin daha kalıcı olmasını sağlar", "Rekabeti artırır", "Harcamaları gizler", "Eğlence sunar"],
        answer: "Projenin daha kalıcı olmasını sağlar",
        properAnswer: "Yerel halkın katılımı, projenin daha kalıcı olmasını sağlar.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinin en temel amacı nedir?",
        options: ["Reklam yapmak", "Topluma fayda sağlamak", "Sadece eğlence düzenlemek", "Kar elde etmek"],
        answer: "Topluma fayda sağlamak",
        properAnswer: "Topluma fayda sağlamak, sosyal sorumluluk projelerinin en temel amacıdır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Aşağıdakilerden hangisi bir sosyal sorumluluk projesi örneğidir?",
        options: ["İhtiyaç sahiplerine gıda yardımı yapmak", "Arkadaşlarla piknik düzenlemek", "Spor salonuna üye olmak", "Alışveriş yapmak"],
        answer: "İhtiyaç sahiplerine gıda yardımı yapmak",
        properAnswer: "İhtiyaç sahiplerine gıda yardımı yapmak, sosyal sorumluluk projesine örnektir.",
        level: "kolay",
        topic: "Haklar"
    },
    {
        q: "Çevre için yapılan en yaygın sosyal sorumluluk projesi nedir?",
        options: ["Ağaç dikme kampanyaları", "Alışveriş merkezine gitmek", "Tatil yapmak", "Spor turnuvası düzenlemek"],
        answer: "Ağaç dikme kampanyaları",
        properAnswer: "Ağaç dikme kampanyaları, çevre odaklı sosyal sorumluluk projelerinin en yaygın örneğidir.",
        level: "kolay",
        topic: "Çevre"
    },
    {
        q: "Sosyal sorumluluk projesi yaparken en önemli ilke nedir?",
        options: ["Sadece gönüllülere fayda sağlamak", "Toplumun ihtiyacına uygun olmak", "Kâr amaçlı çalışmak", "Popüler görünmek"],
        answer: "Toplumun ihtiyacına uygun olmak",
        properAnswer: "Sosyal sorumluluk projeleri, toplumun ihtiyacına uygun olmalıdır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Sağlık temalı bir sosyal sorumluluk projesine örnek hangisidir?",
        options: ["Kan bağışı kampanyası", "Futbol turnuvası düzenlemek", "Alışveriş festivali", "Konser bileti satışı"],
        answer: "Kan bağışı kampanyası",
        properAnswer: "Kan bağışı kampanyası, sağlık temalı sosyal sorumluluk projelerine örnektir.",
        level: "kolay",
        topic: "Sağlık"
    },
    {
        q: "Sosyal sorumluluk projelerinde gönüllü olmak bireye ne kazandırır?",
        options: ["Sadece zaman kaybı", "Toplumsal duyarlılık ve deneyim", "Yalnızca para", "Hiçbir şey"],
        answer: "Toplumsal duyarlılık ve deneyim",
        properAnswer: "Gönüllü olmak, bireye toplumsal duyarlılık ve deneyim kazandırır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Hayvanlarla ilgili bir sosyal sorumluluk projesi aşağıdakilerden hangisidir?",
        options: ["Sokak hayvanlarına barınak yapmak", "Sirk düzenlemek", "Evcil hayvan satışı", "Hayvanat bahçesi açmak"],
        answer: "Sokak hayvanlarına barınak yapmak",
        properAnswer: "Sokak hayvanlarına barınak yapmak, hayvanlarla ilgili sosyal sorumluluk projelerinden biridir.",
        level: "kolay",
        topic: "Haklar"
    },
    {
        q: "Bir öğrencinin sosyal sorumluluk projesine katılması hangi değeri güçlendirir?",
        options: ["Bencil davranışları", "Toplumsal dayanışmayı", "Tembelliği", "Rekabeti"],
        answer: "Toplumsal dayanışmayı",
        properAnswer: "Sosyal sorumluluk projelerine katılım, öğrencilerin toplumsal dayanışmasını güçlendirir.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk kulüplerinin üniversitelerdeki amacı nedir?",
        options: ["Sadece eğlenmek", "Öğrencilerin topluma katkı sağlamasını teşvik etmek", "Spor yapmak", "Alışverişe gitmek"],
        answer: "Öğrencilerin topluma katkı sağlamasını teşvik etmek",
        properAnswer: "Sosyal sorumluluk kulüpleri, öğrencilerin topluma katkı sağlamasını teşvik eder.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde en önemli kaynak nedir?",
        options: ["Gönüllü katılım", "Rekabet", "Lüks harcamalar", "Reklam bütçesi"],
        answer: "Gönüllü katılım",
        properAnswer: "Gönüllü katılım, sosyal sorumluluk projelerinin en önemli kaynağıdır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Çocuk işçiliğiyle mücadele eden bir sosyal sorumluluk projesi hangi temaya girer?",
        options: ["İnsan hakları", "Çevre", "Hayvanlar", "Teknoloji"],
        answer: "İnsan hakları",
        properAnswer: "Çocuk işçiliğiyle mücadele eden projeler, insan hakları temalı sosyal sorumluluk projeleridir.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "Bir şirketin sosyal sorumluluk projesi yapmasının en önemli nedeni nedir?",
        options: ["Sadece marka reklamı yapmak", "Topluma değer katmak", "Rakipleri geçmek", "Vergi kaçırmak"],
        answer: "Topluma değer katmak",
        properAnswer: "Şirketler sosyal sorumluluk projeleriyle topluma değer katar.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Kan bağışı kampanyaları toplumda neyi güçlendirir?",
        options: ["Rekabeti", "Dayanışmayı", "Kar amacı", "Sadece bireysel faydayı"],
        answer: "Dayanışmayı",
        properAnswer: "Kan bağışı kampanyaları, toplumda dayanışmayı güçlendirir.",
        level: "orta",
        topic: "Sağlık"
    },
    {
        q: "Çevre temalı sosyal sorumluluk projelerinde en çok hangi konuya odaklanılır?",
        options: ["Geri dönüşüm", "Lüks tüketim", "Moda", "Spor"],
        answer: "Geri dönüşüm",
        properAnswer: "Çevre temalı projelerde en çok geri dönüşüm konusuna odaklanılır.",
        level: "orta",
        topic: "Çevre"
    },
    {
        q: "Engelli bireylerin topluma katılımını destekleyen sosyal sorumluluk projeleri hangi hakkı ön plana çıkarır?",
        options: ["Eşitlik hakkı", "Mülkiyet hakkı", "Seyahat hakkı", "Oyun hakkı"],
        answer: "Eşitlik hakkı",
        properAnswer: "Engelli bireylerin topluma katılımını destekleyen projeler eşitlik hakkını ön plana çıkarır.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "Sosyal sorumluluk projelerinin topluma kazandırdığı en büyük değer nedir?",
        options: ["Bireysel kazanç", "Toplumsal bilinç", "Rekabet", "Moda"],
        answer: "Toplumsal bilinç",
        properAnswer: "Sosyal sorumluluk projeleri toplumsal bilinç kazandırır.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Hayvan haklarıyla ilgili bir sosyal sorumluluk projesi örneği hangisidir?",
        options: ["Kısırlaştırma ve sahiplendirme kampanyaları", "Evcil hayvan satışı", "Hayvanat bahçesi reklamı", "Hayvan yarışmaları"],
        answer: "Kısırlaştırma ve sahiplendirme kampanyaları",
        properAnswer: "Hayvan haklarıyla ilgili projeler kısırlaştırma ve sahiplendirme kampanyalarını içerir.",
        level: "orta",
        topic: "Haklar"
    },
    {
        q: "Üniversitelerde yapılan sosyal sorumluluk projelerinin öğrenciler için en büyük faydası nedir?",
        options: ["Sadece sosyal medya görünürlüğü", "Toplumsal duyarlılık ve liderlik becerisi kazanmak", "Maddi kazanç sağlamak", "Daha çok tatil yapmak"],
        answer: "Toplumsal duyarlılık ve liderlik becerisi kazanmak",
        properAnswer: "Üniversite sosyal sorumluluk projeleri, öğrencilere toplumsal duyarlılık ve liderlik becerisi kazandırır.",
        level: "orta",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde “katılımcı yaklaşım” neyi ifade eder?",
        options: ["Sadece yöneticilerin karar alması", "Toplumun da sürece dahil edilmesi", "Projenin tek taraflı yürütülmesi", "Medya sponsorluğu"],
        answer: "Toplumun da sürece dahil edilmesi",
        properAnswer: "Katılımcı yaklaşım, toplumun sürece dahil edilmesini ifade eder.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk ile gönüllülük arasındaki en temel fark nedir?",
        options: ["Sosyal sorumluluk toplumsal fayda odaklıdır, gönüllülük bireysel tercihtir", "Sosyal sorumluluk zorunludur, gönüllülük yasaktır", "Sosyal sorumluluk eğlence amaçlıdır, gönüllülük iş içindir", "Hiç fark yoktur"],
        answer: "Sosyal sorumluluk toplumsal fayda odaklıdır, gönüllülük bireysel tercihtir",
        properAnswer: "Sosyal sorumluluk toplumsal fayda odaklıdır, gönüllülük ise bireysel tercihtir.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde başarının en önemli göstergesi nedir?",
        options: ["Reklam bütçesinin büyüklüğü", "Toplumsal ihtiyaçlara cevap verebilmesi", "Katılımcı sayısının fazlalığı", "Yalnızca sosyal medya beğenileri"],
        answer: "Toplumsal ihtiyaçlara cevap verebilmesi",
        properAnswer: "Başarı, sosyal sorumluluk projelerinin toplumsal ihtiyaçlara cevap verebilmesi ile ölçülür.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "İnsan hakları temalı sosyal sorumluluk projeleri hangi evrensel belgeden ilham alır?",
        options: ["İnsan Hakları Evrensel Bildirgesi", "Lozan Antlaşması", "Magna Carta", "Sevr Antlaşması"],
        answer: "İnsan Hakları Evrensel Bildirgesi",
        properAnswer: "İnsan hakları temalı projeler, İnsan Hakları Evrensel Bildirgesinden ilham alır.",
        level: "zor",
        topic: "Haklar"
    },
    {
        q: "TEGV hangi vakfın kısaltmasıdır?",
        options: ["Türkiye Eğitim Geliştirme Vakfı", "Türkiye Eğitim ve Gönüllüleri Vakfı", "Türkiye Eğitim Gönüllüleri Vakfı", "Türk Ekonomi ve Gelişim Vakfı"],
        answer: "Türkiye Eğitim Gönüllüleri Vakfı",
        properAnswer: "TEGV, Türkiye Eğitim Gönüllüleri Vakfı'nın kısaltmasıdır.",
        level: "zor",
        topic: "Eğitim"
    },
    {
        q: "KAÇUV hangi vakfın kısaltmasıdır ve Ege’de de faaliyet gösterir?",
        options: ["Kanserli Çocuklar Umut Vakfı", "Kanserli Aile Çocukları Uygulama Vakfı", "Kadın ve Çocuk Umut Vakfı", "Kanserli Çocuklar Ulusal Vakfı"],
        answer: "Kanserli Çocuklar Umut Vakfı",
        properAnswer: "KAÇUV, Kanserli Çocuklar Umut Vakfı'nın kısaltmasıdır ve Ege’de de faaliyet gösterir.",
        level: "zor",
        topic: "Sağlık"
    },
    {
        q: "Bir sosyal sorumluluk projesinin “etki analizi” neyi ölçer?",
        options: ["Reklam gelirlerini", "Topluma sağlanan faydayı", "Projenin popülerliğini", "Harcanan bütçeyi"],
        answer: "Topluma sağlanan faydayı",
        properAnswer: "Etki analizi, sosyal sorumluluk projelerinin topluma sağladığı faydayı ölçer.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde “hesap verebilirlik” hangi değeri güçlendirir?",
        options: ["Güven", "Rekabet", "Popülerlik", "Gizlilik"],
        answer: "Güven",
        properAnswer: "Hesap verebilirlik, sosyal sorumluluk projelerinde güven değerini güçlendirir.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk projelerinde “sürdürülebilir kalkınma hedefleri (SDG)” hangi kurum tarafından belirlenmiştir?",
        options: ["Birleşmiş Milletler", "Avrupa Birliği", "Dünya Bankası", "Dünya Sağlık Örgütü"],
        answer: "Birleşmiş Milletler",
        properAnswer: "Sürdürülebilir kalkınma hedefleri (SDG), Birleşmiş Milletler tarafından belirlenmiştir.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Sosyal sorumluluk çalışmalarında “yeşil yıkama (greenwashing)” kavramı neyi ifade eder?",
        options: ["Şirketlerin çevreye gerçekten faydalı projeler yapması", "Şirketlerin çevreci görünüp aslında çevreye zarar vermeye devam etmesi", "Doğal kaynakları koruma projeleri", "Orman yangınlarını söndürme"],
        answer: "Şirketlerin çevreci görünüp aslında çevreye zarar vermeye devam etmesi",
        properAnswer: "Yeşil yıkama, şirketlerin çevreci görünüp aslında çevreye zarar vermeye devam etmesini ifade eder.",
        level: "zor",
        topic: "Çevre"
    }
];



function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function prepareQuestions() {
    const easy = shuffle(allQuestions.filter(q => q.level === "kolay")).slice(0, 1);
    const medium = shuffle(allQuestions.filter(q => q.level === "orta")).slice(0, 1);
    const hard = shuffle(allQuestions.filter(q => q.level === "zor")).slice(0, 3);
    return shuffle([...easy, ...medium, ...hard]);
}

function showQuestion() {
    updateProgress();

    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.q;
    optionsDiv.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('div');
        btn.textContent = option;
        btn.classList.add('option');
        btn.addEventListener('click', () => handleAnswer(option, btn, q.answer));
        optionsDiv.appendChild(btn);
    });
}

function handleAnswer(selected, btn, correct) {
    if (lockOptions) return;

    lockOptions = true;
    const q = questions[currentQuestionIndex];

    // Tüm seçenekleri devre dışı bırak
    document.querySelectorAll('.option').forEach(o => o.style.pointerEvents = 'none');

    if (selected === correct) {
        btn.classList.add('correct');
        score += getPoint(currentQuestionIndex);
        userAnswers.push({ topic: q.topic, isCorrect: true });
        setTimeout(() => {
            currentQuestionIndex++;
            lockOptions = false;
            showQuestion();
        }, 200); // doğruysa hızlı geçiş
    } else {
        btn.classList.add('wrong');
        userAnswers.push({ topic: q.topic, isCorrect: false });

        // Yanlışsa properAnswer'ı göster
        showProperAnswer(q.properAnswer);
    }
}

function showProperAnswer(text) {
    // ProperAnswer alanını oluştur veya güncelle
    let existing = document.getElementById('proper-answer');
    if (!existing) {
        const div = document.createElement('div');
        div.id = 'proper-answer';
        div.style.marginTop = '10px';
        div.style.padding = '10px';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '5px';
        div.style.backgroundColor = '#fff3cd'; // sarı arka plan
        div.style.color = '#856404';
        div.style.fontWeight = 'bold';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';

        const answerText = document.createElement('div');
        answerText.textContent = text;
        answerText.style.marginBottom = '10px';

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Devam';
        nextBtn.style.alignSelf = 'flex-end'; // butonu sağa yaslar
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            lockOptions = false;
            div.remove(); // properAnswer'ı kaldır
            showQuestion();
        });

        div.appendChild(answerText);
        div.appendChild(nextBtn);
        optionsDiv.appendChild(div);
    } else {
        // Eğer daha önce eklenmişse sadece texti güncelle
        existing.querySelector('div').textContent = text;
    }
}



function getPoint(index) {
    const q = questions[index];
    if (q.level === "kolay") return 1;
    if (q.level === "orta") return 2;
    if (q.level === "zor") return 3;
}

function endGame() {
    questionScreen.classList.add('hidden');
    statsScreen.classList.remove('hidden');

    createFireworks();
    const totalQuestions = questions.length;
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;

    // Topic bazlı sayılar
    const topics = [...new Set(allQuestions.map(q => q.topic))];
    const correctPerTopic = topics.map(topic =>
        userAnswers.filter(a => a.isCorrect && a.topic === topic).length
    );
    const wrongPerTopic = topics.map(topic =>
        userAnswers.filter(a => !a.isCorrect && a.topic === topic).length
    );

    statsScreen.innerHTML = `
        <h2>İstatistikler</h2>
        <div class="stat-card"><span>Oyuncu:</span><span>${username}</span></div>
        <div class="stat-card"><span>Toplam Puan:</span><span>${score}</span></div>
        <div class="stat-card"><span>Doğru:</span><span>✅ ${correctAnswers}</span></div>
        <div class="stat-card"><span>Yanlış:</span><span>❌ ${wrongAnswers}</span></div>
        <div class="charts-container">
            <div class="chart-box">
                <h3>Doğru Cevaplar </h3>
                <canvas id="correctChart"></canvas>
            </div>
            <div class="chart-box">
                <h3>Yanlış Cevaplar </h3>
                <canvas id="wrongChart"></canvas>
            </div>
        </div>
        <button id="next-player">Sonraki Oyuncu</button>
    `;

    // Chartları oluştur
    createPieChart('correctChart', topics, correctPerTopic, 'Doğru Cevaplar');
    createPieChart('wrongChart', topics, wrongPerTopic, 'Yanlış Cevaplar');

    document.getElementById('next-player').addEventListener('click', () => {
        statsScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        usernameInput.value = '';
        userAnswers = [];
    });

    leaderboard.push({ name: username, score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    updateLeaderboard();
}


function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard
        .sort((a, b) => b.score - a.score)
        .forEach((entry, index) => {
            const div = document.createElement('div');
            div.classList.add('leaderboard-entry');

            if (index === 0) div.classList.add('gold');
            else if (index === 1) div.classList.add('silver');
            else if (index === 2) div.classList.add('bronze');

            div.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${entry.name}</span>
                <span class="score">${entry.score} puan</span>
            `;
            leaderboardList.appendChild(div);
        });
}

function createPieChart(canvasId, labels, data, label) {
    new Chart(document.getElementById(canvasId), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"]
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let value = context.raw;
                            let percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

startBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (!username) return alert("Lütfen isim girin.");

    const lowerUsername = username.toLowerCase();

    // deleteallusers komutu
    if (lowerUsername === 'deleteallusers') {
        leaderboard = [];
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        alert("Leaderboard temizlendi!");
        usernameInput.value = '';
        return;
    }
    // deleteuser <name> komutu
    if (lowerUsername.startsWith('deleteuser ')) {
        const nameToDelete = lowerUsername.replace('deleteuser ', '').trim();
        const initialLength = leaderboard.length;
        leaderboard = leaderboard.filter(entry => entry.name.toLowerCase() !== nameToDelete);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        if (leaderboard.length < initialLength) {
            alert(`${nameToDelete} leaderboarddan silindi!`);
        } else {
            alert(`${nameToDelete} leaderboardda bulunamadı!`);
        }
        usernameInput.value = '';
        return;
    }

    // Kullanıcı adı daha önce leaderboard'da var mı kontrol et
    const isDuplicate = leaderboard.some(entry => entry.name.toLowerCase() === lowerUsername);
    if (isDuplicate) {
        alert("Bu isim zaten mevcut, lütfen başka bir isim giriniz.");
        usernameInput.value = '';
        return;
    }

    // Oyun başlat
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questions = prepareQuestions();
    currentQuestionIndex = 0;
    score = 0;

    showQuestion();
});



function createFireworks() {
    const container = document.createElement('div');
    container.className = 'fireworks-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create multiple fireworks bursts
    const burstCount = 7;
    const burstPositions = [
        { x: 50, y: 30 },
        { x: 20, y: 40 },
        { x: 80, y: 40 },
        { x: 30, y: 60 },
        { x: 70, y: 60 }
    ];

    burstPositions.forEach((pos, index) => {
        setTimeout(() => {
            createFireworkBurst(container, pos.x, pos.y);
        }, index * 300);
    });

    // Remove container after animation completes
    setTimeout(() => {
        container.remove();
    }, 4000);
}

function createFireworkBurst(container, xPercent, yPercent) {
    const particleCount = 140;
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'absolute';
    burstContainer.style.left = `${xPercent}%`;
    burstContainer.style.top = `${yPercent}%`;
    burstContainer.style.transform = 'translate(-50%, -50%)';
    burstContainer.style.width = '0';
    burstContainer.style.height = '0';
    container.appendChild(burstContainer);

    // Create initial rising effect
    const risingDot = document.createElement('div');
    risingDot.style.position = 'absolute';
    risingDot.style.width = '7px';
    risingDot.style.height = '7px';
    risingDot.style.backgroundColor = '#ffffff';
    risingDot.style.borderRadius = '50%';
    risingDot.style.left = '0';
    risingDot.style.top = '0';
    risingDot.style.boxShadow = '0 0 8px 2px rgba(255, 255, 255, 0.8)';
    burstContainer.appendChild(risingDot);

    // Animate the rising dot
    const riseAnimation = risingDot.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: 'translate(0, -100px)', opacity: 1 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    riseAnimation.onfinish = () => {
        risingDot.remove();
        
        // Create explosion effect
        for (let i = 0; i < particleCount; i++) {
            createParticle(burstContainer);
        }
        
        // Add flash effect
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.left = '0';
        flash.style.top = '0';
        flash.style.width = '60px';
        flash.style.height = '60px';
        flash.style.borderRadius = '50%';
        flash.style.backgroundColor = '#ffffff';
        flash.style.opacity = '0.8';
        flash.style.transform = 'translate(-50%, -50%)';
        flash.style.filter = 'blur(10px)';
        burstContainer.appendChild(flash);
        
        // Animate flash
        flash.animate([
            { opacity: 0.8, transform: 'translate(-50%, -50%) scale(0.5)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
        ], {
            duration: 400,
            easing: 'ease-out'
        }).onfinish = () => flash.remove();
    };
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = getRandomFireworkColor();
    particle.style.left = '0';
    particle.style.top = '0';
    particle.style.boxShadow = '0 0 4px 1px rgba(255, 255, 255, 0.6)';
    container.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    const size = 4 + Math.random() * 6;
    const duration = 1200 + Math.random() * 700;
    const delay = Math.random() * 100;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Animate particle
    const animation = particle.animate([
        { 
            transform: 'translate(0, 0) scale(1)', 
            opacity: 1 
        },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.2)`, 
            opacity: 0 
        }
    ], { 
        duration: duration, 
        delay: delay,
        easing: 'cubic-bezier(0.1, 0.3, 0.2, 1)' 
    });

    animation.onfinish = () => particle.remove();
}

function getRandomFireworkColor() {
    const colors = [
        '#ff5252', '#ff4081', '#e040fb', '#7c4dff', 
        '#536dfe', '#448aff', '#40c4ff', '#18ffff',
        '#64ffda', '#69f0ae', '#b2ff59', '#eeff41',
        '#ffff00', '#ffd740', '#ffab40', '#ff6e40',
        '#ff3d00', '#ff1744', '#f50057', '#d500f9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
window.addEventListener('load', () => {
    setTimeout(createFireworks, 1000);
});

function updateProgress() {
    const total = questions.length;
    const current = currentQuestionIndex;
    const progress = (current / total) * 100;

    progressBar.style.width = progress + "%";
    progressText.textContent = current + "/" + total;
}

updateLeaderboard();
