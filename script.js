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
    //zor
    {
        q: "Bir sosyal sorumluluk projesinde öğrenciler için ücretsiz internet erişimi sağlamak en çok hangi tema ile örtüşür?",
        options: ["Eğitimde fırsat eşitliği", "Teknolojik gelişim", "Bilgiye erişim", "Toplumsal dayanışma"],
        answer: "Eğitimde fırsat eşitliği",
        properAnswer: "Ücretsiz internet erişimi sağlamak doğrudan eğitimde fırsat eşitliğini destekler.",
        level: "çok zor",
        topic: "Eğitim"
    },
    {
        q: "Bir projede engelli bireylerin iş hayatına katılımını artırmak için yapılan çalışmalar hangi temaya en uygun düşer?",
        options: ["İstihdam politikaları", "Eşitlik", "Toplumsal entegrasyon", "Adalet"],
        answer: "Eşitlik",
        properAnswer: "Engelli bireylerin iş hayatına katılımı esasen fırsat eşitliğini vurgular.",
        level: "çok zor",
        topic: "Eşitlik"
    },
    {
        q: "Bir sosyal sorumluluk projesinde gençlere gönüllülük bilinci kazandırmak hangi tema ile daha çok ilişkilidir?",
        options: ["Kültürel gelişim", "Toplumsal sorumluluk", "Aktif vatandaşlık", "Dayanışma"],
        answer: "Aktif vatandaşlık",
        properAnswer: "Gönüllülük bilincini geliştirmek aktif vatandaşlık anlayışını güçlendirir.",
        level: "çok zor",
        topic: "Gençlik"
    },
    {
        q: "Bir projede kadınların kendi işlerini kurmaları için mikro kredi desteği sağlamak hangi tema ile en güçlü şekilde bağlantılıdır?",
        options: ["Ekonomik kalkınma", "Toplumsal cinsiyet eşitliği", "Finansal okuryazarlık", "Dayanışma"],
        answer: "Toplumsal cinsiyet eşitliği",
        properAnswer: "Kadınlara mikro kredi desteği toplumsal cinsiyet eşitliğini güçlendiren projelere örnektir.",
        level: "zor",
        topic: "Haklar"
    },
    {
        q: "Bir sosyal sorumluluk projesinde plastik kullanımını azaltmak için bez çanta dağıtılması hangi temaya daha doğrudan girer?",
        options: ["Çevre bilinci", "Sürdürülebilir tüketim", "Atık yönetimi", "Doğa koruma"],
        answer: "Sürdürülebilir tüketim",
        properAnswer: "Bez çanta dağıtmak özellikle sürdürülebilir tüketim davranışını teşvik eder.",
        level: "çok zor",
        topic: "Çevre"
    },
    {
        q: "Bir projede mülteci çocuklara dil eğitimi verilmesi hangi tema ile en uygun şekilde bağdaştırılır?",
        options: ["Kültürel uyum", "Eğitim hakkı", "Toplumsal entegrasyon", "İnsan hakları"],
        answer: "Eğitim hakkı",
        properAnswer: "Dil eğitimi doğrudan eğitim hakkının sağlanmasına yönelik bir çalışmadır.",
        level: "çok zor",
        topic: "Haklar"
    },

     {
        q: "Bir sosyal sorumluluk projesinde yaşlı bireyler için teknoloji kullanım atölyeleri düzenlemek hangi tema ile daha çok örtüşür?",
        options: ["Yaşam boyu öğrenme", "Teknolojik gelişim", "Toplumsal kapsayıcılık", "Eğitim"],
        answer: "Yaşam boyu öğrenme",
        properAnswer: "Yaşlılar için teknoloji atölyeleri yaşam boyu öğrenmeyi destekler.",
        level: "çok zor",
        topic: "Eğitim"
    },
    {
        q: "Bir projede işitme engelliler için tiyatro oyunlarının işaret diliyle sahnelenmesi hangi tema ile doğrudan ilgilidir?",
        options: ["Sanatın erişilebilirliği", "Engelli hakları", "Kültürel eşitlik", "Toplumsal entegrasyon"],
        answer: "Sanatın erişilebilirliği",
        properAnswer: "Tiyatroyu işaret diliyle sunmak sanatın erişilebilirliğini artırmaya yöneliktir.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "Bir sosyal sorumluluk projesinde kırsal bölgelerde kız çocuklarının okula devamlılığını sağlamak hangi tema ile en güçlü şekilde ilişkilidir?",
        options: ["Çocuk hakları", "Toplumsal cinsiyet eşitliği", "Eğitim hakkı", "Dayanışma"],
        answer: "Toplumsal cinsiyet eşitliği",
        properAnswer: "Kız çocuklarının eğitime katılımını artırmak toplumsal cinsiyet eşitliğini destekler.",
        level: "zor",
        topic: "Eğitim"
    },
    {
        q: "Bir sosyal sorumluluk projesinde okullarda sağlıklı beslenme bilinci oluşturmak hangi temayla en doğru şekilde bağdaştırılır?",
        options: ["Sağlık eğitimi", "Beslenme hakkı", "Yaşam kalitesi", "Toplumsal farkındalık"],
        answer: "Sağlık eğitimi",
        properAnswer: "Okullarda beslenme bilinci oluşturmak sağlık eğitiminin bir parçasıdır.",
        level: "zor",
        topic: "Sağlık"
    },
    {
        q: "Bir sosyal sorumluluk projesinde çocuk işçiliğini önlemeye yönelik faaliyetler hangi tema ile en doğrudan ilgilidir?",
        options: ["İnsan hakları", "Çocuk hakları", "Çalışma hakları", "Adalet"],
        answer: "Çocuk hakları",
        properAnswer: "Çocuk işçiliğini önlemek esasen çocuk haklarını korumaya yöneliktir.",
        level: " çok zor",
        topic: "Haklar"
    },
    {
        q: "Bir projede şehir merkezlerinde bisiklet yolları yapılması hangi tema ile en doğrudan ilişkilidir?",
        options: ["Sağlıklı yaşam", "Çevre dostu ulaşım", "Kent planlaması", "Sürdürülebilirlik"],
        answer: "Çevre dostu ulaşım",
        properAnswer: "Bisiklet yolları çevre dostu ulaşımı teşvik etmeye yöneliktir.",
        level: "zor",
        topic: "Çevre"
    },
    {
        q: "Bir sosyal sorumluluk projesinde okullarda akran zorbalığını önlemek için eğitim verilmesi hangi tema ile en uygun şekilde bağdaştırılır?",
        options: ["Psikolojik destek", "Eğitimde güvenlik", "Toplumsal farkındalık", "Sağlıklı iletişim"],
        answer: "Eğitimde güvenlik",
        properAnswer: "Akran zorbalığını önlemek eğitim ortamının güvenliğini sağlamaya yöneliktir.",
        level: "çok zor",
        topic: "Eğitim"
    },
    {
        q: "Bir projede doğa sporları ile gençlere çevre bilinci kazandırmak hangi tema ile en güçlü şekilde ilgilidir?",
        options: ["Spor yoluyla farkındalık", "Çevre eğitimi", "Gençlik gelişimi", "Doğa ile uyum"],
        answer: "Çevre eğitimi",
        properAnswer: "Doğa sporları üzerinden çevre bilinci kazandırmak çevre eğitimi kapsamındadır.",
        level: "çok zor",
        topic: "Çevre"
    },
    {
        q: "Bir sosyal sorumluluk projesinde kırsalda sağlık taraması yapmak hangi tema ile doğrudan bağdaştırılır?",
        options: ["Sağlık hakkı", "Toplumsal dayanışma", "Temel ihtiyaçlar", "Yaşam kalitesi"],
        answer: "Sağlık hakkı",
        properAnswer: "Kırsalda sağlık taraması yapmak doğrudan sağlık hakkını gözetir.",
        level: "zor",
        topic: "Sağlık"
    },
    {
        q: "Bir projede dezavantajlı gençlere kodlama eğitimi verilmesi hangi temaya en uygun düşer?",
        options: ["Teknolojiye erişim", "Eğitimde eşitlik", "Dijital okuryazarlık", "Gençlik gelişimi"],
        answer: "Dijital okuryazarlık",
        properAnswer: "Kodlama eğitimi özellikle dijital okuryazarlığı artırmaya yöneliktir.",
        level: "çok zor",
        topic: "Eğitim"
    },

    // Zor (21-30)
    
    {
        q: "Bir perakende şirketinin yöneticisisiniz. Tedarik zincirinizde, bir ürünü daha düşük maliyetle üretebilecek, ancak üretim sürecinde daha fazla karbon salımı yapan bir yöntem buldunuz. Bu maliyet farkı, ürünü düşük gelirli aileler için çok daha erişilebilir hale getirecek. Ne yaparsınız?",
        options: ["Daha ucuz ve çevreci olmayan yöntemi kullanır, ancak bu değişikliği ürünün fiyatına yansıtmayarak tüketiciye doğrudan bir fayda sağlamazsınız.", "Daha pahalı ve çevreci yöntemi korur, ancak ürünün fiyatını artırmadan maliyetleri başka alanlardan kısmaya çalışırsınız.", "Çevreci üretim yöntemine devam eder ve hükümetten, çevre dostu üretim yapan firmalara yönelik vergi teşvikleri talep etme girişiminde bulunursunuz.", "Daha ucuz, ancak daha az çevreci yöntemi seçer ve elde edilen kârın bir kısmını çevresel iyileştirme projelerine bağışlarsınız."],
        answer: "Çevreci üretim yöntemine devam eder ve hükümetten, çevre dostu üretim yapan firmalara yönelik vergi teşvikleri talep etme girişiminde bulunursunuz.",
        properAnswer: "Bu seçenek, hem çevresel hem de sosyal sorumlulukları dengeler ve hem gezegene hem de tüketicilere karşı etik bir duruş sağlar.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "Bir sivil toplum kuruluşunun yöneticisisiniz. Kuruluşunuz, faaliyetlerini büyük ölçüde genişletecek kadar büyük bir bağış teklifi alıyor. Ancak bağışçı, tartışmalı bir kamu figürü ve geçmişte etik olmayan iş uygulamalarıyla tanınıyor. Bağışı kabul etmezseniz yüzlerce kişi yardımdan mahrum kalacak. Ne yaparsınız?",
        options: ["Bağışı kabul eder, ancak bu paranın sadece belirli bir proje için kullanılacağını açıklar ve bağışçının adını gizlersiniz.", "Bağışı reddeder, ancak bağışçıya, itibarını düzeltecek bir sosyal sorumluluk projesine yatırım yapmasını önererek dolaylı yoldan yardım sağlamasını istersiniz.", "Bağışı reddeder, ancak durumu kamuoyuna açıklayarak ve diğer potansiyel bağışçılara bu etik duruşunuzu anlatarak yeni fon kaynakları yaratmaya çalışırsınız.", "Bağışı kabul eder, ancak bağışçıyla kamuya açık bir anlaşma yaparak bağışın şeffaf ve denetlenebilir bir şekilde kullanılmasını garanti altına alırsınız."],
        answer: "Bağışı kabul eder, ancak bağışçıyla kamuya açık bir anlaşma yaparak bağışın şeffaf ve denetlenebilir bir şekilde kullanılmasını garanti altına alırsınız.",
        properAnswer: "Bağışı kabul edip şeffaf ve denetlenebilir bir şekilde kullanmak, hem etik duruşu korur hem de insanlara yardımın ulaşmasını sağlar.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "Sınırlı bir yardım bütçeniz var. Bu bütçeyi ya bir barınaktaki hayvanlara acil gıda ve tıbbi yardım sağlamak için ya da gelişmekte olan bir ülkedeki çocukların temel eğitim masraflarını karşılamak için kullanabilirsiniz. İki projeden sadece birini tam olarak destekleyebilirsiniz. Ne yaparsınız?",
        options: ["Bütçenin tamamını hayvan barınağına ayırırsınız, çünkü acil ve somut bir yardım sağlayarak anında acıyı dindirebilirsiniz.", "Bütçenin tamamını çocukların eğitimine ayırırsınız, çünkü bu, insan potansiyeline yapılan uzun vadeli bir yatırımdır.", "Bütçenizi ikiye böler, her iki projeye de eşit destek sağlarsınız.", "Her iki projenin de potansiyel etkisini artırmak için bütçenizi, çocuk eğitimini hayvan refahıyla birleştiren, örneğin çocuklara hayvan bakımı eğitimi veren bir projeye yönlendirirsiniz."],
        answer: "Her iki projenin de potansiyel etkisini artırmak için bütçenizi, çocuk eğitimini hayvan refahıyla birleştiren, örneğin çocuklara hayvan bakımı eğitimi veren bir projeye yönlendirirsiniz.",
        properAnswer: "Uzun vadeli etkisi en yüksek olan yatırım insan potansiyeline yapılan yatırımdır, bu nedenle çocukların eğitimi önceliklidir.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "Bir teknoloji firmasında çalışıyorsunuz. Şirket, kullanıcı verilerini (anonimleştirilmiş) analiz ederek toplumsal sorunları çözmeyi amaçlayan bir yapay zeka aracı geliştiriyor. Bu araç, doğru kullanılırsa önemli faydalar sağlayacak ancak verilerin tamamen anonim kalması garanti edilemiyor. Ne yaparsınız?",
        options: ["Verilerin, herhangi bir potansiyel risk yaratmaması için, sadece toplu ve istatistiksel raporlar şeklinde kullanılmasına izin verirsiniz.", "Projeyi, veri anonimleştirme risklerini şeffaf bir şekilde açıklayan bir kamu bilgilendirme kampanyasıyla başlatırsınız ve kullanıcıların onayıyla ilerlersiniz.", "Verilerin anonimliğini korumak için, toplumsal sorunları çözecek algoritmanın sadece kısıtlı bir veri setinde çalışmasına izin verirsiniz.", "Projenin etik kurul tarafından incelenmesini ve verilerin, yetkisiz erişimi tamamen imkansız hale getiren şifreleme ve denetim mekanizmalarıyla korunmasını talep edersiniz."],
        answer: "Projenin etik kurul tarafından incelenmesini ve verilerin, yetkisiz erişimi tamamen imkansız hale getiren şifreleme ve denetim mekanizmalarıyla korunmasını talep edersiniz.",
        properAnswer: "Veri kullanımını şeffaf ve kullanıcı onayıyla yapmak, hem etik hem de yasal sorumlulukları yerine getirir.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "Bir şehrin su işleri müdürü olarak, sınırlı bir bütçeyle ya zengin bir mahalledeki eskiyen ancak hala çalışan su borularını tamir edecek ya da yoksul bir mahalledeki patlayan boruları değiştireceksiniz. Yoksul mahalledeki sorun şu an acil, ancak zengin mahallenin boruları yakın gelecekte büyük bir kriz yaratabilir. Ne yaparsınız?",
        options: ["Yoksul mahalledeki sorunu geçici olarak tamir eder ve zengin mahalle sakinlerinden, boru yenileme projesine katkıda bulunmalarını talep edersiniz.", "Bütçenin tamamını, acil ve mevcut sorunu çözmek için yoksul mahallenin borularına ayırırsınız, çünkü en çok ihtiyacı olanlar önceliklendirilmelidir.", "Bütçeyi ikiye bölerek her iki mahalleye de eşit oranda yardım edersiniz.", "Bütçenin tamamını, yakın gelecekte büyük bir arızayı önlemek için zengin mahallenin borularına ayırırsınız, çünkü bu, en yüksek sayıda insanı etkileyecek potansiyel bir krizi önler."],
        answer: "Bütçenin tamamını, acil ve mevcut sorunu çözmek için yoksul mahallenin borularına ayırırsınız, çünkü en çok ihtiyacı olanlar önceliklendirilmelidir.",
        properAnswer: "Acil ve mevcut sorunu çözmek, sınırlı kaynakların en ihtiyaç duyanlara ulaşmasını sağlar ve önceliklendirme ilkesine uygundur.",
        level: "çok zor",
        topic: "Genel"
    },
    {
        q: "“Toplumsal cinsiyet eşitliği” temalı projelerin uzun vadeli toplumsal katkısı nedir?",
        options: [
            "Kadınların ve erkeklerin iş hayatında eşit temsil edilmesi.",
            "Toplumun tüm bireylerine, potansiyellerini tam olarak gerçekleştirme fırsatı sunulması.",
            "Eğitim ve sağlık hizmetlerine erişimde cinsiyetler arası tüm eşitsizliklerin ortadan kalkması.",
            "Toplumsal karar alma mekanizmalarında kadın liderlerin sayısının artırılması."
        ],
        answer: "Toplumun tüm bireylerine, potansiyellerini tam olarak gerçekleştirme fırsatı sunulması.",
        properAnswer: "Toplumsal cinsiyet eşitliği projeleri, sadece belirli alanlarda eşitliği sağlamakla kalmaz, tüm bireylerin cinsiyetlerinden bağımsız olarak en yüksek potansiyellerine ulaşabilecekleri bir ortam yaratır.",
        level: "çok zor",
        topic: "Haklar"
    },
    {
        q: "“Yeşil ekonomi”yi destekleyen sosyal sorumluluk projeleri en çok hangi küresel soruna çözüm arar?",
        options: [
            "Biyoçeşitliliğin kaybını ve ekolojik sistemlerin bozulmasını önlemek.",
            "Kalkınmakta olan ülkelerdeki ekonomik büyüme ve sanayileşmeyi teşvik etmek.",
            "Sınırlı doğal kaynakların sürdürülebilir bir şekilde yönetilmesi ve tüketim alışkanlıklarının değiştirilmesi.",
            "Fosil yakıtlara olan bağımlılığı azaltarak küresel sıcaklık artışını ve iklim krizini yavaşlatmak."
        ],
        answer: "Fosil yakıtlara olan bağımlılığı azaltarak küresel sıcaklık artışını ve iklim krizini yavaşlatmak.",
        properAnswer: "Yeşil ekonomi projeleri, ekonomik faaliyetleri çevresel etkilerden ayırarak, doğrudan küresel ısınmaya ve iklim değişikliğine yol açan ana nedenlere çözüm bulmayı hedefler.",
        level: "çok zor",
        topic: "Çevre"
    },
    {
        q: "Bir sosyal sorumluluk projesinin başarısında “yerel halkın katılımı” neden önemlidir?",
        options: [
            "Projenin hedeflerinin yerel ihtiyaçlara uygunluğunu sağlamak ve aidiyet duygusu oluşturmak.",
            "Projenin sürdürülebilirliğini ve yerel topluluk tarafından sahiplenilmesini garanti altına almak.",
            "Projenin finansal kaynaklarını çeşitlendirmek ve gönüllü işgücü sağlamak.",
            "Proje hakkında yerel medyada daha fazla görünürlük kazanmak ve toplumsal algıyı güçlendirmek."
        ],
        answer: "Projenin sürdürülebilirliğini ve yerel topluluk tarafından sahiplenilmesini garanti altına almak.",
        properAnswer: "Yerel halkın projeye dahil olması, onu pasif bir alıcı olmaktan çıkarır ve aktif bir katılımcı haline getirir. Bu sahiplenme duygusu, projenin bitiminden sonra da devam etmesini ve etkilerinin kalıcı olmasını sağlar.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Çocuk işçiliğiyle mücadele eden bir sosyal sorumluluk projesi hangi temaya girer?",
        options: [
            "Sürdürülebilir Kalkınma ve Yoksullukla Mücadele.",
            "Evrensel İnsan Hakları ve Temel Yaşam Hakları.",
            "Eğitim Eşitliği ve Fırsatlara Erişim.",
            "Emeğin Korunması ve Çalışma Koşullarının İyileştirilmesi."
        ],
        answer: "Evrensel İnsan Hakları ve Temel Yaşam Hakları.",
        properAnswer: "Çocuk işçiliği, çocukların eğitim, sağlık ve güvenlik gibi en temel insan haklarını ihlal eden bir sorundur. Bu nedenle, mücadele projeleri doğrudan evrensel insan hakları temasına odaklanır.",
        level: "çok zor",
        topic: "Haklar"
    },
    // burdan
    {
        q: "Bir şirketin sosyal sorumluluk projesi yapmasının en önemli nedeni nedir?",
        options: [
            "Şirketin itibarını ve marka sadakatini artırmak.",
            "Sosyal ve çevresel sorunlara kalıcı çözümler üreterek uzun vadede sürdürülebilir bir etki yaratmak.",
            "Hükümet ve sivil toplum kuruluşlarıyla daha güçlü ilişkiler kurmak.",
            "Çalışanların motivasyonunu ve şirkete olan bağlılığını artırmak."
        ],
        answer: "Sosyal ve çevresel sorunlara kalıcı çözümler üreterek uzun vadede sürdürülebilir bir etki yaratmak.",
        properAnswer: "Sosyal sorumluluk projeleri, sadece kısa vadeli faydalar değil, aynı zamanda toplumun ve çevrenin karşı karşıya olduğu sorunlara yönelik kalıcı ve sistemli çözümler üretmeyi amaçlar.",
        level: "zor",
        topic: "Genel"
    },
    {
        q: "Kan bağışı kampanyaları toplumda neyi güçlendirir?",
        options: [
            "Toplumsal sağlık bilincini ve kişisel sorumluluk duygusunu.",
            "Bireyler arasında karşılıksız yardım ve dayanışma kültürünü.",
            "Sağlık sisteminin acil durumlara hazırlıklı olma kapasitesini.",
            "Toplumun riskli durumlara karşı direncini ve kriz yönetimi becerisini."
        ],
        answer: "Bireyler arasında karşılıksız yardım ve dayanışma kültürünü.",
        properAnswer: "Kan bağışı kampanyaları, bireylerin birbirine herhangi bir karşılık beklemeden yardım etme eylemini teşvik ederek, toplumun temelindeki dayanışma ve yardımlaşma duygusunu güçlendirir.",
        level: "çok zor",
        topic: "Sağlık"
    },
    {
        q: "Çevre temalı sosyal sorumluluk projelerinde en çok hangi konuya odaklanılır?",
        options: [
            "Atık yönetimi ve döngüsel ekonomiye geçiş.",
            "Karbon ayak izinin azaltılması ve yenilenebilir enerji kaynaklarının kullanımı.",
            "Ormanların ve su kaynaklarının korunması.",
            "Tüketici bilincinin artırılması ve sürdürülebilir tüketim alışkanlıklarının teşvik edilmesi."
        ],
        answer: "Atık yönetimi ve döngüsel ekonomiye geçiş.",
        properAnswer: "Çevre temalı projeler arasında en yaygın ve somut olanlar atık yönetimi ve geri dönüşüm faaliyetleridir. Bu projeler, toplumu daha verimli ve döngüsel bir ekonomiye geçiş konusunda bilinçlendirir.",
        level: "çok zor",
        topic: "Çevre"
    },
    {
        q: "Engelli bireylerin topluma katılımını destekleyen sosyal sorumluluk projeleri hangi hakkı ön plana çıkarır?",
        options: [
            "Erişilebilirlik hakkı.",
            "Yaşam kalitesini artırma hakkı.",
            "Toplumsal yaşama tam ve eşit katılım hakkı.",
            "Fırsat eşitliği ve ayrımcılık yasağı hakkı."
        ],
        answer: "Toplumsal yaşama tam ve eşit katılım hakkı.",
        properAnswer: "Bu tür projeler, engelli bireylerin sadece fiziki mekanlara değil, aynı zamanda sosyal, kültürel ve ekonomik hayatın tüm alanlarına eşit koşullarda ve tam olarak dahil olmalarını sağlamayı hedefler. Bu, en kapsayıcı haktır.",
        level: "zor",
        topic: "Haklar"
    },
    {
        q: "Sosyal sorumluluk projelerinin topluma kazandırdığı en büyük değer nedir?",
        options: [
            "Değişimi mümkün kılan bireysel ve kolektif sorumluluk duygusu.",
            "Toplumun karşı karşıya olduğu sorunlara yönelik somut ve uygulanabilir çözümler üretme kapasitesi.",
            "İnsanlar arasında empati ve dayanışma duygularının güçlenmesi.",
            "Toplulukların kendi sorunlarını çözme ve kendi potansiyellerini keşfetme becerisinin artması."
        ],
        answer: "Değişimi mümkün kılan bireysel ve kolektif sorumluluk duygusu.",
        properAnswer: "Sosyal sorumluluk projeleri, bireylere ve topluluklara, sorunların sadece başkalarına ait olmadığını, aksine kendilerinin de çözümün bir parçası olduğunu hissettirir. Bu sorumluluk bilinci, kalıcı değişimin temelini oluşturur.",
        level: "zor",
        topic: "Genel"
    },
    {
    q: "Hayvan refahı ve hakları üzerine yapılan bir sosyal sorumluluk projesinin en temel amacı aşağıdakilerden hangisidir?",
    options: [
        "Toplumda hayvanlara yönelik merhamet ve duyarlılığı artırarak, hayvanat bahçelerinin ve evcil hayvan ticarethanelerinin kapatılmasını sağlamak.",
        "Sahipsiz hayvanların nüfusunu kontrol altına almak ve şehirlerdeki hayvan barınaklarına yerleştirilmelerini kolaylaştırmak.",
        "Hayvanların acı çekmesini önlemek ve onlara insani yaşam koşulları sunan sistemler oluşturmak.",
        "Hayvan hakları aktivistlerini desteklemek ve yasal hakları için kamuoyunda farkındalık oluşturmak."
    ],
    answer: "Hayvanların acı çekmesini önlemek ve onlara insani yaşam koşulları sunan sistemler oluşturmak.",
    properAnswer: "Hayvan refahıyla ilgili sosyal sorumluluk projelerinin en temel amacı, hayvanların fiziksel ve ruhsal sağlığını güvence altına alarak acı çekmelerini önlemektir. Diğer seçenekler, bu temel amacı gerçekleştirmeye yönelik yöntemler veya daha spesifik alt hedefler olabilir.",
    level: "zor",
    topic: "Haklar"
    },
    {
        q: "Üniversitelerde yapılan sosyal sorumluluk projelerinin öğrenciler için en büyük faydası nedir?",
        options: ["Gelecekteki iş başvurularında öne çıkmalarını sağlayacak CV maddeleri oluşturmak.", "Etik karar verme süreçlerini deneyimleyerek mesleki hayata hazırlanmak.", "Teorik bilgiyi gerçek dünya problemleriyle ilişkilendirme yeteneğini geliştirmek.", "Toplumsal duyarlılığı yüksek bir birey olmanın yanı sıra, liderlik ve iletişim becerilerini de pratik olarak geliştirmek."],
        answer: "Toplumsal duyarlılığı yüksek bir birey olmanın yanı sıra, liderlik ve iletişim becerilerini de pratik olarak geliştirmek.",
        properAnswer: "Üniversite sosyal sorumluluk projeleri, öğrencilere toplumsal duyarlılık ve liderlik becerisi kazandırır.",
        level: "çok zor",
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
        options: ["Şirketlerin çevreye faydalı projeler yapması", "Şirketlerin çevreci görünüp aslında çevreye zarar vermeye devam etmesi", "Doğal kaynakları koruma projeleri", "Orman yangınlarını söndürme"],
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
    const hard = shuffle(allQuestions.filter(q => q.level === "zor")).slice(0, 4);       // 2 zor
    const veryHard = shuffle(allQuestions.filter(q => q.level === "çok zor")).slice(0, 1); // 3 çok zor
    return shuffle([...hard, ...veryHard]);
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
        }, 2000); // doğruysa hızlı geçiş
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
    if (q.level === "zor") return 2;
    if (q.level === "çok zor") return 3;
    if (q.level === "kolay") return 3;
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
