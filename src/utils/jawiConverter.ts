// Utiliti Penukar Tulisan Rumi ke Jawi untuk e-RPH Pendidikan Islam (KPM)
// Berpandukan Piawaian Sistem Ejaan Jawi Baharu Dewan Bahasa dan Pustaka (DBP)
// Pedoman Ejaan Jawi Yang Disempurnakan (PEJYD) & Daftar Kata Bahasa Melayu (DKBM) Rumi-Sebutan-Jawi DBP
import { RPHItem } from '../types';

// Kamus istilah piawai e-RPH & Kurikulum Pendidikan Islam KPM mengikut DBP
export const JAWI_DICTIONARY: Record<string, string> = {
  // 1. Organisasi, Kementerian & Dokumen Rasmi
  'kementerian pendidikan malaysia': 'کمنترين ڤنديديقن مليسيا',
  'kementerian pendidikan': 'کمنترين ڤنديديقن',
  'bahagian pembangunan kurikulum': 'بهاݢين ڤمباڠونن کوريکولوم',
  'jabatan pendidikan negeri': 'جابتن ڤنديديقن نݢري',
  'pejabat pendidikan daerah': 'ڤجابت ڤنديديقن داءيره',
  'sekolah kebangsaan': 'سکوله کبڠسأن',
  'sk seri saujana': 'سکوله کبڠسأن سري ساوجان',
  'sk merbau pulas': 'سکوله کبڠسأن مرباو ڤولس',
  'rancangan pengajaran harian': 'رانچڠن ڤڠاجرن هارين',
  'rancangan pengajaran tahunan': 'رانچڠن ڤڠاجرن تاهونن',
  'dokumen standard kurikulum dan pentaksiran': 'دوکومن ستندرد کوريکولوم دان ڤنتکسيرن',
  'dskp': 'دوکومن ستندرد کوريکولوم دان ڤنتکسيرن (DSKP)',
  'rpt': 'رانچڠن ڤڠاجرن تاهونن (RPT)',
  'erph': 'e-RPH',
  'e-rph': 'e-RPH (رانچڠن ڤڠاجرن هارين ديݢيتل)',
  'pendidikan islam': 'ڤنديديقن اسلام',
  'panitia pendidikan islam': 'ڤانيتيا ڤنديديقن اسلام',
  'program j-qaf': 'ڤروݢرم j-QAF',
  'j-qaf': 'j-QAF',
  'tahun 2026': 'تاهون 2026',

  // 2. Label Medan e-RPH
  'minggu persekolahan': 'ميڠݢو ڤرسکولهن',
  'minggu': 'ميڠݢو',
  'hari': 'هاري',
  'tarikh': 'تاريخ',
  'masa': 'ماس',
  'minit': 'مينيت',
  'jam': 'جم',
  'tempoh': 'تيمڤوه',
  'kelas': 'کلس',
  'matapelajaran': 'مات ڤلاجرن',
  'mata pelajaran': 'مات ڤلاجرن',
  'bidang pembelajaran': 'بيدڠ ڤمبلاجرن',
  'bidang': 'بيدڠ',
  'tajuk': 'تاجوق',
  'topik': 'توڤيک',
  'standard kandungan': 'ستندرد کاندوڠن',
  'standard pembelajaran': 'ستندرد ڤمبلاجرن',
  'standard prestasi': 'ستندرد ڤريستاسي',
  'sk': 'ستندرد کاندوڠن (SK)',
  'sp': 'ستندرد ڤمبلاجرن (SP)',
  'objektif pembelajaran': 'اوبجيکتيف ڤمبلاجرن',
  'kriteria kejayaan': 'کريتيريا کجايأن',
  'aktiviti pengajaran dan pemudahcaraan': 'اکتيۏيتي ڤڠاجرن دان ڤمودهچاراءن',
  'aktiviti pdpc': 'اکتيۏيتي ڤدڤچ',
  'pdpc': 'ڤدڤچ (PdPc)',
  'pdp': 'ڤدڤ (PdP)',
  'set induksi': 'سيت ايندوکسي',
  'aktiviti utama': 'اکتيۏيتي اوتام',
  'aktiviti perkembangan': 'اکتيۏيتي ڤرکمبڠن',
  'penutup dan rumusan': 'ڤنوتوڤ دان روموسن',
  'penutup': 'ڤنوتوڤ',
  'rumusan': 'روموسن',
  'bahan bantu mengajar': 'باهن بنتو مڠاجر',
  'bbm': 'باهن بنتو مڠاجر (BBM)',
  'elemen merentas kurikulum': 'ايليمن مرنتس کوريکولوم',
  'emk': 'ايليمن مرنتس کوريکولوم (EMK)',
  'pentaksiran bilik darjah': 'ڤنتکسيرن بيليق درجه',
  'pbd': 'ڤنتکسيرن بيليق درجه (PBD)',
  'tahap penguasaan': 'تاهڤ ڤڠواسأن',
  'refleksi guru': 'ريفليکسي ݢورو',
  'refleksi': 'ريفليکسي',
  'catatan tindakan susulan': 'چاتتن تيندقن سوسولن',
  'tindakan susulan': 'تيندقن سوسولن',
  'status semakan': 'ستاتوس سمقن',
  'tandatangan guru': 'تانداتاڠن ݢورو',
  'pengesahan pgb': 'ڤڠسهن ڤݢب / ݢورو بسر',
  'guru besar': 'ݢورو بسر',
  'penolong kanan pentadbiran': 'ڤنولوڠ کانن ڤنتدبيرن',
  'ketua panitia': 'کتوا ڤانيتيا',

  // 3. Hari-hari Persekolahan
  'isnin': 'اثنين',
  'selasa': 'ثلاث',
  'rabu': 'رابو',
  'khamis': 'خميس',
  'jumaat': 'جمعة',
  'sabtu': 'سبتو',
  'ahad': 'احد',

  // 4. Bulan Masihi & Hijri
  'januari': 'جانواري',
  'februari': 'فيبرواري',
  'mac': 'مچ',
  'april': 'اڤريل',
  'mei': 'مي',
  'jun': 'جون',
  'julai': 'جولاي',
  'ogos': 'اوݢوس',
  'september': 'سيڤتيمبر',
  'oktober': 'اوکتوبر',
  'november': 'نوۏيمبر',
  'disember': 'ديسيمبر',
  'muharram': 'محرم',
  'safar': 'صفر',
  'rabiulawal': 'ربيع الاول',
  'rabiulakhir': 'ربيع الاخر',
  'jamadilawal': 'جمادى الاول',
  'jamadilakhir': 'جمادى الاخر',
  'rejab': 'رجب',
  'syaaban': 'شعبان',
  'ramadan': 'رمضان',
  'syawal': 'شوال',
  'zulkaedah': 'ذوالقعدة',
  'zulhijjah': 'ذوالحجة',

  // 5. Bidang Pembelajaran Pendidikan Islam
  'al-quran': 'القرءان',
  'quran': 'القرءان',
  'al-qur\'an': 'القرءان',
  'hadis': 'حديث',
  'akidah': 'عقيدة',
  'aqidah': 'عقيدة',
  'ibadah': 'عبادة',
  'sirah': 'سيرة',
  'adab': 'ادب',
  'adab islamiah': 'ادب اسلامية',
  'adab islami': 'ادب اسلامي',
  'jawi': 'جاوي',
  'bahasa arab': 'بهاس عرب',
  'tasmik': 'تسميع',
  'tilawah': 'تلاوة',
  'hafazan': 'حفظن',
  'kefahaman': 'کفهمن',
  'tajwid': 'تجويد',
  'ulum syari\'yyah': 'علوم شرعية',
  'ulum': 'علوم',

  // 6. Status e-RPH
  'lengkap': 'لڠکڤ',
  'deraf': 'دراف',
  'disemak pgb': 'دسمق ڤݢب',
  'disemak': 'دسمق',
  'belum disemak': 'بلوم دسمق',
  'disahkan': 'دصحکن',

  // 7. Nama Kelas Lazim
  '1 ibnu sina': '١ ابن سينا',
  '1 ibnu khaldun': '١ ابن خلدون',
  '2 ibnu sina': '٢ ابن سينا',
  '3 ibnu sina': '٣ ابن سينا',
  '4 ibnu sina': '٤ ابن سينا',
  '4 al-farabi': '٤ الفارابي',
  '5 al-biruni': '٥ البيروني',
  '5 al-khawarizmi': '٥ الخوارزمي',
  '6 ibnu khaldun': '٦ ابن خلدون',
  '6 ibnu sina': '٦ ابن سينا',
  '6 al-ghazali': '٦ الغزالي',
  'tahun 1': 'تاهون ١',
  'tahun 2': 'تاهون ٢',
  'tahun 3': 'تاهون ٣',
  'tahun 4': 'تاهون ٤',
  'tahun 5': 'تاهون ٥',
  'tahun 6': 'تاهون ٦',
  'transisi': 'ترنسيسي',
  'program transisi': 'ڤروݢرم ترنسيسي',
  'program transisi tahun satu': 'ڤروݢرم ترنسيسي تاهون ١',
  'fawatih as-suwar': 'فواتح السور',
  'fawatihussuwar': 'فواتح السور',
  'mad silah': 'مد صلة',
  'suku kata': 'سوکو کات',
  'suku kata terbuka': 'سوکو کات تربوک',
  'suku kata tertutup': 'سوکو کات ترتوتوڤ',
  'dua suku kata': 'دوا سوکو کات',
  'huruf bersambung': 'حروف برسامبوڠ',
  'huruf tunggal': 'حروف توڠݢل',
  'huruf berbaris': 'حروف برباريس',
  'keluarga nabi': 'کلوارݢ نبي',
  'keluarga nabi muhammad': 'کلوارݢ نبي محمد صلى الله عليه وسلم',
  'tanda waqaf': 'تندا وقف',
  'pengurusan akhir persekolahan': 'ڤڠوروسن اخير ڤرسکولهن',

  // 8. Kata Kerja Pendidikan & DSKP (Bloom & KPM)
  'menyatakan': 'مڽاتاکن',
  'menerangkan': 'منرڠکن',
  'menjelaskan': 'منجلسکن',
  'menyenaraikan': 'مڽنارايکن',
  'mengenal pasti': 'مڠنل ڤستي',
  'mengenalpasti': 'مڠنل ڤستي',
  'mengenal': 'مڠنل',
  'mengaplikasikan': 'مڠاڤليکاسيکن',
  'merumus': 'مروموس',
  'merumuskan': 'مروموسکن',
  'melakukan': 'ملاکوکن',
  'membaca': 'ممباچ',
  'menyebut': 'مڽبوت',
  'menulis': 'منوليس',
  'menyalin': 'مڽالين',
  'menghafaz': 'مڠحفظ',
  'memahami': 'مفهمي',
  'menceritakan': 'منچريتاکن',
  'membincangkan': 'ممبينچڠکن',
  'melafazkan': 'ملافظکن',
  'mengamalkan': 'مڠعملکن',
  'membandingkan': 'ممبنديڠکن',
  'membanding bezakan': 'ممبنديڠ بيذاکن',
  'membezakan': 'ممبيذاکن',
  'menilai': 'منيلاي',
  'menghasilkan': 'مڠحاصيلکن',
  'membentangkan': 'ممبنتڠکن',
  'menunjuk cara': 'منونجوق چارا',
  'mempraktikkan': 'ممڤريکتيککن',
  'memadankan': 'ممادنکن',
  'menyusun': 'مڽوسون',
  'menandakan': 'مننداکن',
  'mengesan': 'مڠسن',
  'membulatkan': 'ممبولتکن',
  'memperdengarkan': 'ممڤردڠرکن',
  'meminta': 'ممينتا',
  'membuat': 'ممبوات',
  'menyemak': 'مڽيمق',
  'menjalankan': 'منجالنکن',
  'mencapai': 'منچاڤاي',
  'menguasai': 'مڠواساءي',
  'mengandungi': 'مڠاندوڠي',
  'mengikut': 'مڠيکوت',
  'mengeluarkan': 'مڠلوارکن',
  'menuntut': 'منونتوت',
  'memberi': 'ممبري',
  'memberikan': 'ممبريکن',
  'menayangkan': 'منايڠکن',
  'memainkan': 'مماءينکن',
  'menyanyikan': 'مڽاڽيکن',
  'mengkaji': 'مڠکاجي',
  'mengambil': 'مڠمبيل',
  'mengelaskan': 'مڠلسکن',
  'mengelompokkan': 'مڠلومڤوقکن',
  'mempamerkan': 'ممڤامرکن',
  'menggabungkan': 'مڠݢابوڠکن',
  'membimbing': 'ممبيمبيڠ',
  'melatih': 'ملاتيه',

  // 9. Aktiviti PdPc & Kaedah PAK-21
  'simulasi': 'سيمولاسي',
  'amali': 'عملي',
  'talaqqi musyafahah': 'تلقي مشافهة',
  'talaqqi': 'تلقي',
  'musyafahah': 'مشافهة',
  'sumbang saran': 'سومبڠ سارن',
  'perbincangan kumpulan': 'ڤربينچڠن کومڤولن',
  'perbincangan': 'ڤربينچڠن',
  'pembentangan': 'ڤمبنتڠن',
  'pembentangan kumpulan': 'ڤمبنتڠن کومڤولن',
  'kerja kumpulan': 'کرجا کومڤولن',
  'kerja individu': 'کرجا اينديۏيدو',
  'berpasangan': 'برڤاسڠن',
  'berkumpulan': 'برکومڤولن',
  'individu': 'اينديۏيدو',
  'soal jawab': 'سوءال جواب',
  'kuiz': 'کوءيز',
  'kuiz pantas': 'کوءيز ڤنتس',
  'permainan': 'ڤرماءينن',
  'nyanyian nasyid': 'ڽاڽين نشيد',
  'nasyid': 'نشيد',
  'tazkirah': 'تذکيرة',
  'ikrar': 'اقرار',
  'bacaan contoh': 'باچاءن چونتوه',
  'bacaan bergilir': 'باچاءن برݢيلير',
  'tasmik rakan': 'تسميع راکن',
  'tasmik guru': 'تسميع ݢورو',
  'round robin': 'Round Robin (روءوند روبين)',
  'gallery walk': 'Gallery Walk (ݢالري واک)',
  'think-pair-share': 'Think-Pair-Share (فيکير-ڤاسڠ-کوڠسي)',
  'peer tutoring': 'Peer Tutoring (بيمبيڠن راکن سباي)',
  'traffic light': 'Traffic Light (لامڤو ايسيارت)',
  'hot seating': 'Hot Seating (کوروءسي ڤانس)',
  'role play': 'Role Play (ماءين ڤرانن)',
  'i-think': 'i-Think',
  'peta pemikiran': 'ڤيتا ڤميکيرن',
  'peta minda': 'ڤيتا ميندا',
  'peta buih berganda': 'ڤيتا بوءيه برݢندا',
  'peta buih': 'ڤيتا بوءيه',
  'peta alir': 'ڤيتا الير',
  'peta bulatan': 'ڤيتا بولتن',
  'peta dakap': 'ڤيتا داکڤ',
  'peta pokok': 'ڤيتا ڤوکوق',
  'peta titi': 'ڤيتا تيتي',

  // 10. Bahan Bantu Mengajar (BBM)
  'slaid': 'سلاءيد',
  'slaid interaktif': 'سلاءيد اينتراکتيف',
  'video': 'ۏيديو',
  'video animasi': 'ۏيديو انيماسي',
  'audio': 'اوديو',
  'rakaman audio': 'راقمن اوديو',
  'speaker': 'ڤمبسر سوارا',
  'pembesar suara': 'ڤمبسر سوارا',
  'mushaf al-quran resam uthmani': 'مصحف القرءان رسم عثماني',
  'mushaf al-quran': 'مصحف القرءان',
  'resam uthmani': 'رسم عثماني',
  'buku teks': 'بوکو تيک س',
  'buku teks pendidikan islam': 'بوکو تيک س ڤنديديقن اسلام',
  'buku aktiviti': 'بوکو اکتيۏيتي',
  'lembaran kerja': 'لمبارن کرجا',
  'lembaran kerja digital': 'لمبارن کرجا ديݢيتل',
  'papan putih mini': 'ڤاڤن ڤوتيه ميني',
  'mini whiteboard': 'ڤاڤن ڤوتيه ميني',
  'kad imbasan': 'کد ايمبسن',
  'kad kalimah': 'کد کليمه',
  'kad perkataan': 'کد ڤرکاتأن',
  'kad ayat': 'کد اية',
  'kad stesen': 'کد ستيسين',
  'kad refleksi': 'کد ريفليکسي',
  'carta bergambar': 'چارتا برݢمبر',
  'carta alir': 'چارتا الير',
  'carta': 'چارتا',
  'sejadah praktikal': 'سجاده ڤريکتيکل',
  'sejadah': 'سجاده',
  'peta marhalah': 'ڤيتا مرحلة',
  'peta': 'ڤيتا',
  'projektor': 'ڤروجيکتور',
  'televisyen pintar': 'تيليۏيشن ڤينتر',
  'komputer riba': 'کومڤوتر ريبا',

  // 11. Elemen Merentas Kurikulum (EMK)
  'nilai murni': 'نيلاي مورني',
  'kasih sayang': 'کاسيه سايڠ',
  'hormat-menghormati': 'حرمت-مڠحرمتي',
  'ketelitian': 'کتليتين',
  'tawaduk': 'تواضع',
  'keikhlasan': 'کأخلاصن',
  'kesabaran': 'کصبرن',
  'kesyukuran': 'کشکورن',
  'kejujuran': 'کجوجورن',
  'kerajinan': 'کراجينن',
  'kerjasama': 'کرجاسام',
  'kebersihan': 'کبرسيهن',
  'bahasa': 'بهاس',
  'sebutan fonetik': 'سبوتن فونيتيک',
  'kelestarian global': 'کلستارين ݢلوبل',
  'teknologi maklumat dan komunikasi': 'تيکنولوݢي معلومت دان کومونيکاسي',
  'tmk': 'تيکنولوݢي معلومت دان کومونيکاسي (TMK)',
  'kemahiran berfikir aras tinggi': 'کماهيرن برفيکير ارس تيڠݢي',
  'kbat': 'کماهيرن برفيکير ارس تيڠݢي (KBAT)',
  'patriotisme': 'ڤاتريوتيسمى',
  'patriotisme dan cinta akan perpaduan': 'ڤاتريوتيسمى دان چينتاکن ڤرڤادوان',
  'kreativiti dan inovasi': 'کرياتيۏيتي دان اينوۏاسي',
  'keusahawanan': 'کأوسهاوانن',
  'pendidikan sivik': 'ڤنديديقن سيۏيک',
  'tanggungjawab solat': 'تڠݢوڠجواب صلاة',
  'sains sosial dan geografi': 'ساءينس سوسيال دان ݢيوݢرافي',
  'sains dan teknologi': 'ساءينس دان تيکنولوݢي',

  // 12. Pentaksiran Bilik Darjah (PBD)
  'pentaksiran lisan': 'ڤنتکسيرن ليسن',
  'pentaksiran bertulis': 'ڤنتکسيرن برتوليس',
  'pentaksiran pemerhatian': 'ڤنتکسيرن ڤمرهاتين',
  'pentaksiran kendiri': 'ڤنتکسيرن کنديري',
  'pentaksiran rakan sebaya': 'ڤنتکسيرن راکن سباي',
  'tahap penguasaan tp1': 'تاهڤ ڤڠواسأن TP1',
  'tahap penguasaan tp2': 'تاهڤ ڤڠواسأن TP2',
  'tahap penguasaan tp3': 'تاهڤ ڤڠواسأن TP3',
  'tahap penguasaan tp4': 'تاهڤ ڤڠواسأن TP4',
  'tahap penguasaan tp5': 'تاهڤ ڤڠواسأن TP5',
  'tahap penguasaan tp6': 'تاهڤ ڤڠواسأن TP6',
  'senarai semak': 'سناراي سمق',
  'lembaran pengecaman': 'لمبارن ڤڠچمن',
  'bacaan bertajwid': 'باچاءن برتجويد',
  'pemerhatian amali': 'ڤمرهاتين عملي',
  'pengukuhan': 'ڤڠوکوهن',
  'pemulihan': 'ڤموليهن',
  'pengayaan': 'ڤڠايأن',

  // 13. Istilah Hukum Tajwid & Al-Quran
  'mad asli': 'مد اصلي',
  'mad far\'i': 'مد فرعي',
  'mad wajib muttasil': 'مد واجب متصل',
  'mad jaiz munfasil': 'مد جائز منفصل',
  'mad arid lissukun': 'مد عارض للسكون',
  'mad badal': 'مد بدل',
  'mad lazim': 'مد لازم',
  'nun sakinah': 'نون ساكنة',
  'tanwin': 'تنوين',
  'izhar halqi': 'اظهار حلقي',
  'izhar': 'اظهار',
  'idgham maal ghunnah': 'ادغام مع الغنة',
  'idgham bila ghunnah': 'ادغام بلا غنة',
  'idgham': 'ادغام',
  'iqlab': 'اقلاب',
  'ikhfa hakiki': 'اخفاء حقيقي',
  'ikhfa': 'اخفاء',
  'mim sakinah': 'ميم ساكنة',
  'izhar syafawi': 'اظهار شفوي',
  'ikhfa syafawi': 'اخفاء شفوي',
  'idgham mitslaini': 'ادغام مثلين',
  'qalqalah': 'قلقلة',
  'qalqalah sughra': 'قلقلة صغرى',
  'qalqalah kubra': 'قلقلة كبرى',
  'waqaf': 'وقف',
  'ibtida': 'ابتداء',
  'makhraj huruf': 'مخرج حروف',
  'makhraj': 'مخرج',
  'sifat huruf': 'صفت حروف',
  'harakat': 'حرکة',
  'fathah': 'فتحة',
  'kasrah': 'كسرة',
  'dhommah': 'ضمة',
  'sukon': 'سکون',
  'syaddah': 'شدة',
  'kalimah': 'کليمه',
  'ayat': 'اية',
  'surah': 'سورة',
  'surah al-balad': 'سورة البلد',
  'surah al-fatihah': 'سورة الفاتحة',
  'surah al-tin': 'سورة التين',
  'surah al-insyirah': 'سورة الانشراح',
  'surah ad-dhuha': 'سورة الضحى',
  'surah al-qadr': 'سورة القدر',
  'surah al-zalzalah': 'سورة الزلزلة',
  'surah al-adiyat': 'سورة العاديات',
  'surah al-qariah': 'سورة القارعة',
  'surah at-takathur': 'سورة التكاثر',
  'surah al-asr': 'سورة العصر',
  'surah al-humazah': 'سورة الهمزة',
  'surah al-fil': 'سورة الفيل',
  'surah quraisy': 'سورة قريش',
  'surah al-maun': 'سورة الماعون',
  'surah al-kauthar': 'سورة الكوثر',
  'surah al-kafirun': 'سورة الكافرون',
  'surah an-nasr': 'سورة النصر',
  'surah al-masad': 'سورة المسد',
  'surah al-ikhlas': 'سورة الاخلاص',
  'surah al-falaq': 'سورة الفلق',
  'surah an-nas': 'سورة الناس',

  // 14. Istilah Fiqh & Ibadah
  'solat': 'صلاة',
  'solat fardu': 'صلاة فرض',
  'solat sunat': 'صلاة سنة',
  'solat jamak': 'صلاة جمع',
  'solat qasar': 'صلاة قصر',
  'solat jamak dan qasar': 'صلاة جمع دان قصر',
  'jamak taqdim': 'جمع تقديم',
  'jamak takhir': 'جمع تأخير',
  'rukhsah': 'رخصة',
  'rukhsah solat': 'رخصة صلاة',
  'musafir': 'مسافر',
  'marhalah': 'مرحلة',
  'wuduk': 'وضوء',
  'tayamum': 'تيمم',
  'zakat': 'زكاة',
  'puasa': 'ڤواسا',
  'haji': 'حج',
  'umrah': 'عمرة',
  'syarat sah': 'شرط صح',
  'syarat wajib': 'شرط واجب',
  'rukun': 'روكون',
  'rukun solat': 'روكون صلاة',
  'sah': 'صح',
  'batal': 'بطل',
  'sujud': 'سجود',
  'rukuk': 'رکوع',
  'iktidal': 'اعتدال',
  'tahiyyat': 'تحيات',
  'niat': 'نية',
  'kiblat': 'قبلة',
  'azan': 'اذان',
  'iqamah': 'اقامة',
  'zohor': 'ظهر',
  'asar': 'عصر',
  'maghrib': 'مغرب',
  'isyak': 'عشاء',
  'subuh': 'صبح',

  // 15. Istilah Sirah & Tokoh
  'hijrah': 'هجرة',
  'peristiwa hijrah': 'ڤريستيوا هجرة',
  'rasulullah': 'رسول الله',
  'rasulullah saw': 'رسول الله صلى الله عليه وسلم',
  'nabi muhammad saw': 'نبي محمد صلى الله عليه وسلم',
  'nabi': 'نبي',
  'rasul': 'رسول',
  'sahabat': 'صحابت',
  'saidina abu bakar': 'سيدنا ابو بکر',
  'saidina ali': 'سيدنا علي',
  'saidina uthman': 'سيدنا عثمان',
  'saidina umar': 'سيدنا عمر',
  'muhajirin': 'مهاجرين',
  'ansar': 'انصار',
  'madinah': 'مدينة',
  'mekah': 'مكة',
  'gua thur': 'ݢوا ثور',
  'masjid quba\'': 'مسجد قباء',
  'quba\'': 'قباء',
  'perjanjian aqabah': 'ڤرجنجين عقبة',
  'kronologi': 'کرونولوݢي',
  'iktibar': 'عبرة',

  // 16. Kosa Kata Umum e-RPH & Sintaksis Melayu DBP
  'guru': 'ݢورو',
  'murid': 'موريد',
  'kumpulan': 'کومڤولن',
  'rakan': 'راکن',
  'rakan sebaya': 'راکن سباي',
  'lancar': 'لنچر',
  'fasih': 'فصيح',
  'bertajwid': 'برتجويد',
  'istiqamah': 'استقامة',
  'beradab': 'برادب',
  'cemerlang': 'چمرلڠ',
  'aktif': 'اکتيف',
  'tepat': 'تڤت',
  'betul': 'بتول',
  'jelas': 'جلس',
  'panjang': 'ڤنجڠ',
  'pendek': 'ڤينديق',
  'banyak': 'باڽق',
  'sedikit': 'سديکيت',
  'sekurang-kurangnya': 'سکورڠ-کورڠڽ',
  'sekurang-kurang': 'سکورڠ-کورڠ',
  'bergilir-gilir': 'برݢيلير-ݢيلير',
  'bersama': 'برسام',
  'masing-masing': 'ماسيڠ-ماسيڠ',
  'penerangan': 'ڤنرڠن',
  'bimbingan': 'بيمبيڠن',
  'latihan': 'لاتيهن',
  'bacaan': 'باچاءن',
  'sebutan': 'سبوتن',
  'maksud': 'مقصود',
  'konsep': 'کونسيڤ',
  'kaedah': 'قاعده',
  'syarat': 'شرط',
  'perbezaan': 'ڤربيذاءن',
  'persamaan': 'ڤرسامأن',
  'penguasaan': 'ڤڠواسأن',
  'kejayaan': 'کجايأن',
  'kemudahan': 'کمودهن',
  'kewajipan': 'کواجبن',
  'kehidupan': 'کهيدوڤن',
  'perjalanan': 'ڤرجالنن',
  'peristiwa': 'ڤريستيوا',
  'pengorbanan': 'ڤڠوربانن',
  'perancangan': 'ڤرانچڠن',
  'kebergantungan': 'کبرݢنتوڠن',
  'peneguhan': 'ڤنݢوهن',
  'perbandingan': 'ڤربنديڠن',
  'tempo': 'تيمڤو',
  'dan': 'دان',
  'dengan': 'دڠن',
  'yang': 'يڠ',
  'untuk': 'اونتوق',
  'pada': 'ڤد',
  'di': 'د',
  'ke': 'ک',
  'dari': 'دري',
  'daripada': 'درڤد',
  'kepada': 'کڤد',
  'oleh': 'اوليه',
  'serta': 'سرتا',
  'atau': 'اتاو',
  'adalah': 'اداله',
  'iaitu': 'ياءيتو',
  'sebagai': 'سباݢاي',
  'secara': 'سچارا',
  'selepas': 'سلڤس',
  'sebelum': 'سبلوم',
  'semasa': 'سماس',
  'setiap': 'ستياڤ',
  'semua': 'سموا',
  'antara': 'انتارا',
  'dalam': 'دالم',
  'hadapan': 'هادڤن',
  'belakang': 'بلاکڠ',
  'kiri': 'کيري',
  'kanan': 'کانن',
  'atas': 'اتس',
  'bawah': 'باوه',
  'tengah': 'تڠه',
  'awal': 'اول',
  'akhir': 'اخير',
  'dua': 'دوا',
  'tiga': 'تيݢ',
  'empat': 'امڤت',
  'lima': 'ليم',
  'enam': 'انم',
  'tujuh': 'توجوه',
  'lapan': 'لاڤن',
  'sembilan': 'سمبيلن',
  'sepuluh': 'سڤولوه',
  'orang': 'اورڠ',
  'telah': 'تله',
  'dapat': 'داڤت',
  'boleh': 'بوليه',
  'hendak': 'هندق',
  'mahu': 'ماهو',
  'sambil': 'سمبيل',
  'walau': 'والاو',
  'di mana jua': 'د مان جوا',
  'berada': 'براد',
  'kereta': 'کريتا',
  'kuala lumpur': 'کوالا لومڤور',
  'pulau pinang': 'ڤولاو ڤينڠ',
  'kedah': 'قدح',
  'keluarga': 'کلوارݢ',
  'peribadi': 'ڤريبادي',
  'azam': 'عزم',
  'wajib': 'واجب',
  'sunat': 'سنة',
  'harus': 'هاروس',
  'makruh': 'مکروه',
  'haram': 'حرام',
  'halal': 'حلال',
  'pahala': 'ڤهالا',
  'dosa': 'دوسا',
  'syurga': 'سورݢ',
  'neraka': 'نراک',
  'iman': 'ايمان',
  'islam': 'اسلام',
  'ihsan': 'احسان',
  'allah': 'الله',
  'allah swt': 'الله سبحانه وتعالى'
};

// Pemetaan aksara huruf konsonan Rumi ke Jawi (Sistem Ejaan Jawi DBP)
const CONSONANT_MAP: Record<string, string> = {
  'b': 'ب',
  't': 'ت',
  's': 'س',
  'j': 'ج',
  'h': 'ه',
  'd': 'د',
  'r': 'ر',
  'z': 'ز',
  'f': 'ف',
  'k': 'ک',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'w': 'و',
  'y': 'ي',
  'c': 'چ',
  'p': 'ڤ',
  'g': 'ݢ',
  'v': 'ۏ',
  'q': 'ق',
  'x': 'ک س'
};

// Tukaran nombor Rumi ke Angka Jawi/Arab mengikut piawaian
export const toJawiDigits = (numStr: string | number): string => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(numStr).replace(/[0-9]/g, (d) => digits[parseInt(d, 10)] || d);
};

// Algoritma Penukaran Kata Rumi ke Jawi (Berasaskan Pedoman DBP)
export function convertWordToJawi(word: string): string {
  if (!word) return '';

  const clean = word.toLowerCase().trim();

  // 1. Semak padanan tepat dalam kamus istilah
  if (JAWI_DICTIONARY[clean]) {
    return JAWI_DICTIONARY[clean];
  }

  // 2. Semak jika perkataan adalah nombor
  if (/^\d+$/.test(clean)) {
    return clean;
  }

  let w = clean;

  // Tanggalkan tanda bacaan di awal/akhir
  const leadPunct = w.match(/^[^\w\s]+/)?.[0] || '';
  const trailPunct = w.match(/[^\w\s]+$/)?.[0] || '';
  w = w.replace(/^[^\w\s]+/, '').replace(/[^\w\s]+$/, '');

  if (!w) return word;

  if (JAWI_DICTIONARY[w]) {
    return leadPunct + JAWI_DICTIONARY[w] + trailPunct;
  }

  // Pengendalian imbuhan awal lazim Melayu (Kaedah DBP)
  let prefix = '';
  if (w.startsWith('meng') && w.length > 5) {
    prefix = 'مڠ';
    w = w.slice(4);
  } else if (w.startsWith('men') && w.length > 4) {
    prefix = 'من';
    w = w.slice(3);
  } else if (w.startsWith('mem') && w.length > 4) {
    prefix = 'مم';
    w = w.slice(3);
  } else if (w.startsWith('me') && w.length > 3) {
    prefix = 'م';
    w = w.slice(2);
  } else if (w.startsWith('peng') && w.length > 5) {
    prefix = 'ڤڠ';
    w = w.slice(4);
  } else if (w.startsWith('pen') && w.length > 4) {
    prefix = 'ڤن';
    w = w.slice(3);
  } else if (w.startsWith('pem') && w.length > 4) {
    prefix = 'ڤم';
    w = w.slice(3);
  } else if (w.startsWith('pe') && w.length > 3) {
    prefix = 'ڤ';
    w = w.slice(2);
  } else if (w.startsWith('ber') && w.length > 4) {
    prefix = 'بر';
    w = w.slice(3);
  } else if (w.startsWith('ter') && w.length > 4) {
    prefix = 'تر';
    w = w.slice(3);
  } else if (w.startsWith('per') && w.length > 4) {
    prefix = 'ڤر';
    w = w.slice(3);
  } else if (w.startsWith('di') && w.length > 3) {
    prefix = 'د';
    w = w.slice(2);
  } else if (w.startsWith('ke') && w.length > 3) {
    prefix = 'ک';
    w = w.slice(2);
  } else if (w.startsWith('se') && w.length > 3) {
    prefix = 'س';
    w = w.slice(2);
  }

  // Pengendalian imbuhan akhiran lazim (Kaedah DBP)
  let suffix = '';
  if (w.endsWith('kan') && w.length > 4) {
    suffix = 'کن';
    w = w.slice(0, -3);
  } else if (w.endsWith('nya') && w.length > 4) {
    suffix = 'ڽ';
    w = w.slice(0, -3);
  } else if (w.endsWith('lah') && w.length > 4) {
    suffix = 'له';
    w = w.slice(0, -3);
  } else if (w.endsWith('kah') && w.length > 4) {
    suffix = 'که';
    w = w.slice(0, -3);
  } else if (w.endsWith('an') && w.length > 3) {
    // Kata berakhiran vokal 'a' bila menerima akhiran -an dieja dengan hamzah tiga suku + nun: ءن
    if (w.endsWith('aan')) {
      suffix = 'اءن';
      w = w.slice(0, -3);
    } else {
      suffix = 'ن';
      w = w.slice(0, -2);
    }
  } else if (w.endsWith('i') && w.length > 3) {
    suffix = 'ي';
    w = w.slice(0, -1);
  }

  if (JAWI_DICTIONARY[w]) {
    return leadPunct + prefix + JAWI_DICTIONARY[w] + suffix + trailPunct;
  }

  // Penukaran fonetik per aksara / digraf berpandukan Pedoman Ejaan Jawi Yang Disempurnakan
  let result = '';
  let i = 0;
  const len = w.length;

  while (i < len) {
    const two = w.slice(i, i + 2);
    const char = w[i];
    const isFirst = i === 0;
    const isLast = i === len - 1 || (i === len - 2 && (w[i+1] === 'h' || w[i+1] === 'k'));

    // Digraf dwihuruf Melayu & Arab
    if (two === 'ng') {
      result += 'ڠ';
      i += 2;
      continue;
    } else if (two === 'ny') {
      result += 'ڽ';
      i += 2;
      continue;
    } else if (two === 'sy') {
      result += 'ش';
      i += 2;
      continue;
    } else if (two === 'kh') {
      result += 'خ';
      i += 2;
      continue;
    } else if (two === 'gh') {
      result += 'غ';
      i += 2;
      continue;
    } else if (two === 'ai') {
      result += isFirst ? 'اءي' : 'اي';
      i += 2;
      continue;
    } else if (two === 'au') {
      result += isFirst ? 'اءو' : 'او';
      i += 2;
      continue;
    } else if (two === 'oi') {
      result += 'وي';
      i += 2;
      continue;
    }

    // Huruf tunggal Vokal & Konsonan mengikut Pedoman DBP
    if (char === 'a') {
      if (isFirst) {
        result += 'ا';
      } else {
        result += 'ا';
      }
    } else if (char === 'i') {
      if (isFirst) {
        result += 'اي';
      } else {
        result += 'ي';
      }
    } else if (char === 'e') {
      // Dalam DBP, e-pepet di tengah perkataan lazimnya tidak dilambangkan vokal (contoh: tepat = تڤت)
      // Namun di awal kata menggunakan Alif (contoh: emas = امس)
      if (isFirst) {
        result += 'ا';
      } else {
        // e-taling dilambangkan ya
        result += 'ي';
      }
    } else if (char === 'u' || char === 'o') {
      if (isFirst) {
        result += 'او';
      } else {
        result += 'و';
      }
    } else if (char === 'k') {
      // Kaedah DBP: Huruf 'k' di hujung perkataan jati Melayu ditulis dengan Qaf (ق)
      if (isLast || i === len - 1) {
        result += 'ق';
      } else {
        result += 'ک';
      }
    } else if (CONSONANT_MAP[char]) {
      result += CONSONANT_MAP[char];
    } else {
      result += char;
    }

    i++;
  }

  return leadPunct + prefix + result + suffix + trailPunct;
}

// Penukar keseluruhan teks/perenggan ke Jawi mengikut susunan frasa DBP
export function convertRumiToJawi(text: string): string {
  if (!text) return '';

  let translated = text;

  // Susun frasa kamus mengikut panjang perkataan menurun supaya frasa majmuk ditukar dahulu
  const phrases = Object.keys(JAWI_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    if (regex.test(translated)) {
      translated = translated.replace(regex, JAWI_DICTIONARY[phrase]);
    }
  }

  // Tukar token yang masih berbaki perkataan Rumi
  const lines = translated.split('\n');
  const convertedLines = lines.map((line) => {
    return line.replace(/[a-zA-Z0-9_-]+/g, (match) => {
      // Kekalkan kod rujukan teknikal, akronim dan standard KPM
      if (
        /^TP\d+$/i.test(match) ||
        /^SK\s*[\d.]+/i.test(match) ||
        /^SP\s*[\d.]+/i.test(match) ||
        /^BBM$/i.test(match) ||
        /^EMK$/i.test(match) ||
        /^PBD$/i.test(match) ||
        /^KBAT$/i.test(match) ||
        /^TMK$/i.test(match) ||
        /^PAK-?21$/i.test(match) ||
        /^j-QAF$/i.test(match)
      ) {
        return match;
      }
      return convertWordToJawi(match);
    });
  });

  return convertedLines.join('\n');
}

// Terjemahan data RPH ke versi Jawi mengikut Standard DBP
export function getJawiRph(rph: RPHItem): RPHItem {
  const overrides = rph.jawiOverrides || {};

  const translateList = (items: string[], overrideList?: string[]) => {
    if (overrideList && overrideList.length > 0) return overrideList;
    return (items || []).map((item) => convertRumiToJawi(item));
  };

  const jawiDay = overrides.day || JAWI_DICTIONARY[rph.day.toLowerCase()] || convertWordToJawi(rph.day);
  const jawiArea = overrides.learningArea || JAWI_DICTIONARY[rph.learningArea.toLowerCase()] || convertWordToJawi(rph.learningArea);
  const jawiClassName = overrides.className || JAWI_DICTIONARY[rph.className.toLowerCase()] || convertRumiToJawi(rph.className);
  const jawiSubject = overrides.subject || JAWI_DICTIONARY[rph.subject.toLowerCase()] || convertRumiToJawi(rph.subject);

  return {
    ...rph,
    preferredScript: 'jawi',
    day: jawiDay,
    className: jawiClassName,
    subject: jawiSubject,
    learningArea: rph.learningArea,
    topic: overrides.topic || convertRumiToJawi(rph.topic),
    contentStandard: overrides.contentStandard || convertRumiToJawi(rph.contentStandard),
    learningStandard: overrides.learningStandard || convertRumiToJawi(rph.learningStandard),
    objectives: translateList(rph.objectives, overrides.objectives),
    successCriteria: translateList(rph.successCriteria, overrides.successCriteria),
    inductionActivity: overrides.inductionActivity || convertRumiToJawi(rph.inductionActivity),
    mainActivities: translateList(rph.mainActivities, overrides.mainActivities),
    closureActivity: overrides.closureActivity || convertRumiToJawi(rph.closureActivity),
    teachingAids: translateList(rph.teachingAids, overrides.teachingAids),
    crossCurricularElements: translateList(rph.crossCurricularElements, overrides.crossCurricularElements),
    pbdAssessment: overrides.pbdAssessment || convertRumiToJawi(rph.pbdAssessment),
    reflection: overrides.reflection || convertRumiToJawi(rph.reflection),
    status: rph.status
  };
}

// Label Antara Muka Pengguna dalam Rumi & Jawi Piawai Dewan Bahasa dan Pustaka (DBP)
export const SCRIPT_LABELS = {
  rumi: {
    title: 'RANCANGAN PENGAJARAN HARIAN (e-RPH) PENDIDIKAN ISLAM',
    ministry: 'KEMENTERIAN PENDIDIKAN MALAYSIA',
    school: 'SK MERBAU PULAS • SESI PERSEKOLAHAN 2026',
    standardNotice: 'Piawaian Sistem Ejaan Jawi Baharu Dewan Bahasa dan Pustaka (DBP)',
    week: 'Minggu Persekolahan',
    dayDate: 'Hari & Tarikh',
    time: 'Masa / Tempoh',
    class: 'Kelas',
    area: 'Bidang Pembelajaran',
    topic: 'Tajuk / Topik PdPc',
    contentStandard: 'Standard Kandungan (SK)',
    learningStandard: 'Standard Pembelajaran (SP)',
    objectives: 'Objektif Pembelajaran (Di akhir PdPc murid dapat):',
    successCriteria: 'Kriteria Kejayaan:',
    activitiesHeading: 'Aktiviti Pengajaran & Pemudahcaraan (PdPc)',
    induction: '1. Set Induksi (5 Minit):',
    main: '2. Aktiviti Utama / Perkembangan (45 Minit):',
    closure: '3. Penutup & Rumusan (10 Minit):',
    teachingAids: 'Bahan Bantu Mengajar (BBM):',
    emk: 'Elemen Merentas Kurikulum (EMK):',
    pbd: 'Pentaksiran Bilik Darjah (PBD):',
    reflection: 'Refleksi Guru & Catatan Tindakan Susulan:',
    reflectionNote: 'Wajib diisi selepas sesi PdPc',
    status: 'Status Semakan:',
    printBtn: 'Cetak Rasmi',
    copyBtn: 'Salin Teks',
    saveBtn: 'Simpan e-RPH',
    cancelBtn: 'Batal',
    scriptOption: 'Pilihan Skrip Tulisan e-RPH:',
    autoConvert: '✨ Auto-Tukar Rumi ➡️ Jawi DBP'
  },
  jawi: {
    title: 'رانچڠن ڤڠاجرن هارين (e-RPH) ڤنديديقن اسلام',
    ministry: 'کمنترين ڤنديديقن مليسيا',
    school: 'سکوله کبڠسأن مرباو ڤولس • سيسي ڤرسکولهن 2026',
    standardNotice: 'ڤياواين سيستم ايجاءن جاوي بهارو ديوان بهاس دان ڤوستاک (DBP)',
    week: 'ميڠݢو ڤرسکولهن',
    dayDate: 'هاري دان تاريخ',
    time: 'ماس / تيمڤوه',
    class: 'کلس',
    area: 'بيدڠ ڤمبلاجرن',
    topic: 'تاجوق / توڤيک ڤدڤچ',
    contentStandard: 'ستندرد کاندوڠن (SK)',
    learningStandard: 'ستندرد ڤمبلاجرن (SP)',
    objectives: 'اوبجيکتيف ڤمبلاجرن (د اخير ڤدڤچ موريد داڤت):',
    successCriteria: 'کريتيريا کجايأن:',
    activitiesHeading: 'اکتيۏيتي ڤڠاجرن دان ڤمودهچاراءن (PdPc)',
    induction: '١. سيت ايندوکسي (٥ مينيت):',
    main: '٢. اکتيۏيتي اوتام / ڤرکمبڠن (٤٥ مينيت):',
    closure: '٣. ڤنوتوڤ دان روموسن (١٠ مينيت):',
    teachingAids: 'باهن بنتو مڠاجر (BBM):',
    emk: 'ايليمن مرنتس کوريکولوم (EMK):',
    pbd: 'ڤنتکسيرن بيليق درجه (PBD):',
    reflection: 'ريفليکسي ݢورو دان چاتتن تيندقن سوسولن:',
    reflectionNote: 'واجب دأيسي سلڤس سيسي ڤدڤچ',
    status: 'ستاتوس سمقن:',
    printBtn: 'چيتق دوکومن رسمي',
    copyBtn: 'سالين تيک س',
    saveBtn: 'سيمڤن e-RPH',
    cancelBtn: 'باتل',
    scriptOption: 'ڤيليهن سکريڤ توليسن e-RPH:',
    autoConvert: '✨ توکر رومي ➡️ جاوي DBP'
  }
};
