/**
 * الأصول القابلة للاستبدال من شاشة الإدارة (تبويب الأيقونات والصور).
 * كل عنصر: مفتاح assetRegistry + المسار الذي تُلتزم إليه الصورة في المستودع.
 * عند رفع صورة لمفتاح، تُلتزم إلى path → بعد إعادة النشر يلتقطها assetRegistry تلقائياً
 * وتحلّ محلّ البديل المؤقت دون أي تعديل في منطق الشاشات.
 */
export interface ReplaceableAsset {
  key: string
  label: string
  group: string
  path: string
}

export const replaceableAssets: ReplaceableAsset[] = [
  // حروف بلا صورة بعد (بديل SVG مؤقت)
  { key: 'apple', label: 'تفاح', group: 'حروف', path: 'src/assets/images/food/apple.png' },
  { key: 'carrot', label: 'جزر', group: 'حروف', path: 'src/assets/images/food/carrot.png' },
  { key: 'pomegranate', label: 'رمان', group: 'حروف', path: 'src/assets/images/food/pomegranate.png' },
  { key: 'fox', label: 'ثعلب', group: 'حروف', path: 'src/assets/images/animals/fox.png' },
  { key: 'wolf', label: 'ذئب', group: 'حروف', path: 'src/assets/images/animals/wolf.png' },
  { key: 'giraffe', label: 'زرافة', group: 'حروف', path: 'src/assets/images/animals/giraffe.png' },
  { key: 'fish', label: 'سمكة', group: 'حروف', path: 'src/assets/images/animals/fish.png' },
  { key: 'falcon', label: 'صقر', group: 'حروف', path: 'src/assets/images/animals/falcon.png' },
  { key: 'frog', label: 'ضفدع', group: 'حروف', path: 'src/assets/images/animals/frog.png' },
  { key: 'deer', label: 'ظبي', group: 'حروف', path: 'src/assets/images/animals/deer.png' },
  { key: 'cloud', label: 'غيمة', group: 'حروف', path: 'src/assets/images/extra/cloud.png' },
  { key: 'gift', label: 'هدية', group: 'حروف', path: 'src/assets/images/extra/gift.png' },
  { key: 'rose', label: 'وردة', group: 'حروف', path: 'src/assets/images/extra/rose.png' },
  { key: 'hand', label: 'يد', group: 'حروف', path: 'src/assets/images/extra/hand.png' },

  // ===== كلمات شاشة "كلمات مفردة" (قابلة للاستبدال بأعلى جودة) =====
  { key: 'mother', label: 'ماما', group: 'كلمات · أشخاص', path: 'src/assets/images/people/mother.png' },
  { key: 'father', label: 'بابا', group: 'كلمات · أشخاص', path: 'src/assets/images/people/father.png' },
  { key: 'brother', label: 'أخوي', group: 'كلمات · أشخاص', path: 'src/assets/images/words/brother.png' },
  { key: 'sister', label: 'أختي', group: 'كلمات · أشخاص', path: 'src/assets/images/words/sister.png' },
  { key: 'grandpa', label: 'جدّو', group: 'كلمات · أشخاص', path: 'src/assets/images/words/grandpa.png' },
  { key: 'grandma', label: 'جدّتي', group: 'كلمات · أشخاص', path: 'src/assets/images/words/grandma.png' },
  { key: 'water', label: 'مويه', group: 'كلمات · مشروبات', path: 'src/assets/images/drinks/water.png' },
  { key: 'milk', label: 'حليب', group: 'كلمات · مشروبات', path: 'src/assets/images/drinks/milk.png' },
  { key: 'juice', label: 'عصير', group: 'كلمات · مشروبات', path: 'src/assets/images/drinks/juice.png' },
  { key: 'laban', label: 'لبن', group: 'كلمات · مشروبات', path: 'src/assets/images/words/laban.png' },
  { key: 'meal', label: 'أكل', group: 'كلمات · مأكولات', path: 'src/assets/images/words/meal.png' },
  { key: 'bread', label: 'خبز', group: 'كلمات · مأكولات', path: 'src/assets/images/food/bread.png' },
  { key: 'rice', label: 'رز', group: 'كلمات · مأكولات', path: 'src/assets/images/words/rice.png' },
  { key: 'dates', label: 'تمر', group: 'كلمات · مأكولات', path: 'src/assets/images/words/dates.png' },
  { key: 'egg', label: 'بيض', group: 'كلمات · مأكولات', path: 'src/assets/images/words/egg.png' },
  { key: 'cheese', label: 'جبن', group: 'كلمات · مأكولات', path: 'src/assets/images/words/cheese.png' },
  { key: 'chicken_food', label: 'دجاج', group: 'كلمات · مأكولات', path: 'src/assets/images/words/chicken_food.png' },
  { key: 'cake', label: 'حلا', group: 'كلمات · مأكولات', path: 'src/assets/images/words/cake.png' },
  { key: 'banana', label: 'موز', group: 'كلمات · فواكه', path: 'src/assets/images/words/banana.png' },
  { key: 'apple', label: 'تفاح', group: 'كلمات · فواكه', path: 'src/assets/images/words/apple.png' },
  { key: 'orange_fruit', label: 'برتقال', group: 'كلمات · فواكه', path: 'src/assets/images/words/orange_fruit.png' },
  { key: 'grapes', label: 'عنب', group: 'كلمات · فواكه', path: 'src/assets/images/words/grapes.png' },
  { key: 'watermelon', label: 'بطيخ', group: 'كلمات · فواكه', path: 'src/assets/images/words/watermelon.png' },
  { key: 'tomato', label: 'طماطم', group: 'كلمات · خضار', path: 'src/assets/images/words/tomato.png' },
  { key: 'cucumber', label: 'خيار', group: 'كلمات · خضار', path: 'src/assets/images/words/cucumber.png' },
  { key: 'carrot', label: 'جزر', group: 'كلمات · خضار', path: 'src/assets/images/words/carrot.png' },
  { key: 'potato', label: 'بطاطس', group: 'كلمات · خضار', path: 'src/assets/images/words/potato.png' },
  { key: 'house', label: 'بيت', group: 'كلمات · أماكن', path: 'src/assets/images/words/house.png' },
  { key: 'bathroom_room', label: 'حمام', group: 'كلمات · أماكن', path: 'src/assets/images/words/bathroom_room.png' },
  { key: 'mosque', label: 'مسجد', group: 'كلمات · أماكن', path: 'src/assets/images/words/mosque.png' },
  { key: 'school', label: 'مدرسة', group: 'كلمات · أماكن', path: 'src/assets/images/words/school.png' },
  { key: 'kitchen', label: 'مطبخ', group: 'كلمات · أماكن', path: 'src/assets/images/words/kitchen.png' },
  { key: 'bedroom', label: 'غرفتي', group: 'كلمات · أماكن', path: 'src/assets/images/words/bedroom.png' },
  { key: 'garden', label: 'حديقة', group: 'كلمات · أماكن', path: 'src/assets/images/words/garden.png' },
  { key: 'shirt', label: 'لبس', group: 'كلمات · ملابس', path: 'src/assets/images/words/shirt.png' },
  { key: 'boots', label: 'جزمة', group: 'كلمات · ملابس', path: 'src/assets/images/words/boots.png' },
  { key: 'sock', label: 'شراب', group: 'كلمات · ملابس', path: 'src/assets/images/words/sock.png' },
  { key: 'cap', label: 'طاقية', group: 'كلمات · ملابس', path: 'src/assets/images/words/cap.png' },
  { key: 'jacket', label: 'جاكيت', group: 'كلمات · ملابس', path: 'src/assets/images/words/jacket.png' },
  { key: 'phone', label: 'جوال', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/phone.png' },
  { key: 'tv', label: 'تلفزيون', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/tv.png' },
  { key: 'car', label: 'سيارة', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/car.png' },
  { key: 'book_obj', label: 'كتاب', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/book_obj.png' },
  { key: 'clock_obj', label: 'ساعة', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/clock_obj.png' },
  { key: 'key', label: 'مفتاح', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/key.png' },
  { key: 'bag', label: 'شنطة', group: 'كلمات · أشياء يومية', path: 'src/assets/images/words/bag.png' },
  { key: 'ball', label: 'كرة', group: 'كلمات · ألعاب', path: 'src/assets/images/words/ball.png' },
  { key: 'blocks', label: 'مكعبات', group: 'كلمات · ألعاب', path: 'src/assets/images/words/blocks.png' },
  { key: 'doll', label: 'دمية', group: 'كلمات · ألعاب', path: 'src/assets/images/words/doll.png' },
  { key: 'bike', label: 'دراجة', group: 'كلمات · ألعاب', path: 'src/assets/images/words/bike.png' },
  { key: 'puzzle_toy', label: 'بازل', group: 'كلمات · ألعاب', path: 'src/assets/images/words/puzzle_toy.png' },
  { key: 'head', label: 'راس', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/head.png' },
  { key: 'eye', label: 'عين', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/eye.png' },
  { key: 'ear', label: 'أذن', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/ear.png' },
  { key: 'nose', label: 'أنف', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/nose.png' },
  { key: 'mouth', label: 'فم', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/mouth.png' },
  { key: 'hand', label: 'يد', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/hand.png' },
  { key: 'leg', label: 'رجل', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/leg.png' },
  { key: 'tummy', label: 'بطن', group: 'كلمات · أجزاء الجسم', path: 'src/assets/images/words/tummy.png' },
  { key: 'toothbrush', label: 'فرشاة', group: 'كلمات · نظافة', path: 'src/assets/images/words/toothbrush.png' },
  { key: 'toothpaste', label: 'معجون', group: 'كلمات · نظافة', path: 'src/assets/images/words/toothpaste.png' },
  { key: 'soap', label: 'صابون', group: 'كلمات · نظافة', path: 'src/assets/images/words/soap.png' },
  { key: 'shampoo', label: 'شامبو', group: 'كلمات · نظافة', path: 'src/assets/images/words/shampoo.png' },
  { key: 'towel', label: 'منشفة', group: 'كلمات · نظافة', path: 'src/assets/images/words/towel.png' },
  { key: 'tissues', label: 'مناديل', group: 'كلمات · نظافة', path: 'src/assets/images/words/tissues.png' },

  // ===== المشاعر والاحتياجات: ألم + تهدئة (قابلة للاستبدال) =====
  { key: 'stomachPain', label: 'بطني', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/stomachPain.png' },
  { key: 'headPain', label: 'راسي', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/headPain.png' },
  { key: 'toothPain', label: 'أسناني', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/toothPain.png' },
  { key: 'earPain', label: 'أذني', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/earPain.png' },
  { key: 'handPain', label: 'يدي', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/handPain.png' },
  { key: 'legPain', label: 'رجلي', group: 'المشاعر · ألم', path: 'src/assets/images/emotions/legPain.png' },
  { key: 'loudSound', label: 'الصوت عالي', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/loudSound.png' },
  { key: 'quietPlace', label: 'مكان هادي', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/quietPlace.png' },
  { key: 'doNotTouch', label: 'لا تلمسني', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/doNotTouch.png' },
  { key: 'calm_help', label: 'ساعدني (تهدئة)', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/calm_help.png' },
  { key: 'calm_stop', label: 'أوقف (تهدئة)', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/calm_stop.png' },
  { key: 'goOut', label: 'أطلع', group: 'المشاعر · تهدئة', path: 'src/assets/images/emotions/goOut.png' },

  { key: 'cat', label: 'قطة', group: 'حيوانات', path: 'src/assets/images/animals/cat.png' },

  { key: 'dog', label: 'كلب', group: 'حيوانات', path: 'src/assets/images/animals/dog.png' },

  { key: 'rabbit', label: 'أرنب', group: 'حيوانات', path: 'src/assets/images/animals/rabbit.png' },

  { key: 'bird', label: 'عصفور', group: 'حيوانات', path: 'src/assets/images/animals/bird.png' },

  { key: 'cow', label: 'بقرة', group: 'حيوانات', path: 'src/assets/images/animals/cow.png' },

  { key: 'sheep', label: 'خروف', group: 'حيوانات', path: 'src/assets/images/animals/sheep.png' },

  { key: 'horse', label: 'حصان', group: 'حيوانات', path: 'src/assets/images/animals/horse.png' },

  { key: 'chicken', label: 'دجاجة', group: 'حيوانات', path: 'src/assets/images/animals/chicken.png' },

  { key: 'lion', label: 'أسد', group: 'حيوانات', path: 'src/assets/images/animals/lion.png' },

  { key: 'elephant', label: 'فيل', group: 'حيوانات', path: 'src/assets/images/animals/elephant.png' },

  { key: 'duck', label: 'بطة', group: 'حيوانات', path: 'src/assets/images/animals/duck.png' },

  { key: 'arm', label: 'ذراع', group: 'أجزاء الجسم', path: 'src/assets/images/body/arm.png' },

  { key: 'chest', label: 'صدر', group: 'أجزاء الجسم', path: 'src/assets/images/body/chest.png' },

  { key: 'belly', label: 'بطن', group: 'أجزاء الجسم', path: 'src/assets/images/body/belly.png' },

  { key: 'back', label: 'ظهر', group: 'أجزاء الجسم', path: 'src/assets/images/body/back.png' },

  { key: 'foot', label: 'قدم', group: 'أجزاء الجسم', path: 'src/assets/images/body/foot.png' },

  { key: 'happy', label: 'سعيد', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/happy.png' },

  { key: 'sad', label: 'زعلان', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/sad.png' },

  { key: 'scared', label: 'خايف', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/scared.png' },

  { key: 'angry', label: 'معصب', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/angry.png' },

  { key: 'tired', label: 'تعيان', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/tired.png' },

  { key: 'bored', label: 'طفشان', group: 'المشاعر · مشاعر', path: 'src/assets/images/emotions/bored.png' },

  { key: 'red', label: 'أحمر', group: 'ألوان', path: 'src/assets/images/colors/red.png' },

  { key: 'blue', label: 'أزرق', group: 'ألوان', path: 'src/assets/images/colors/blue.png' },

  { key: 'yellow', label: 'أصفر', group: 'ألوان', path: 'src/assets/images/colors/yellow.png' },

  { key: 'green', label: 'أخضر', group: 'ألوان', path: 'src/assets/images/colors/green.png' },

  { key: 'orange', label: 'برتقالي', group: 'ألوان', path: 'src/assets/images/colors/orange.png' },

  { key: 'pink', label: 'وردي', group: 'ألوان', path: 'src/assets/images/colors/pink.png' },

  { key: 'purple', label: 'بنفسجي', group: 'ألوان', path: 'src/assets/images/colors/purple.png' },

  { key: 'white', label: 'أبيض', group: 'ألوان', path: 'src/assets/images/colors/white.png' },

  { key: 'black', label: 'أسود', group: 'ألوان', path: 'src/assets/images/colors/black.png' },

  { key: 'brown', label: 'بني', group: 'ألوان', path: 'src/assets/images/colors/brown.png' },

  { key: 'circle', label: 'دائرة', group: 'أشكال', path: 'src/assets/images/shapes/circle.svg' },

  { key: 'square', label: 'مربع', group: 'أشكال', path: 'src/assets/images/shapes/square.svg' },

  { key: 'triangle', label: 'مثلث', group: 'أشكال', path: 'src/assets/images/shapes/triangle.svg' },

  { key: 'rectangle', label: 'مستطيل', group: 'أشكال', path: 'src/assets/images/shapes/rectangle.svg' },

  { key: 'star_shape', label: 'نجمة', group: 'أشكال', path: 'src/assets/images/shapes/star.svg' },

  { key: 'heart_shape', label: 'قلب', group: 'أشكال', path: 'src/assets/images/shapes/heart.svg' },

  { key: 'icon_words', label: 'كلمات مفردة', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_words.png' },

  { key: 'icon_short', label: 'جمل قصيرة', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_short.png' },

  { key: 'icon_ready', label: 'جمل جاهزة', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_ready.png' },

  { key: 'icon_emotions', label: 'المشاعر', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_emotions.png' },

  { key: 'icon_shapes', label: 'الألوان والأشكال', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_shapes.png' },

  { key: 'icon_daily', label: 'العبارات اليومية', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_daily.png' },

  { key: 'icon_letters', label: 'الحروف', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_letters.png' },

  { key: 'icon_animals', label: 'حيوانات وأصوات', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_animals.png' },

  { key: 'icon_games', label: 'ألعاب تعليمية', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_games.png' },

  { key: 'icon_stories', label: 'قصص', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_stories.png' },

  { key: 'icon_progress', label: 'تقرير التقدم', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_progress.png' },

  { key: 'icon_settings', label: 'الإعدادات', group: 'الرئيسية · أيقونات', path: 'src/assets/images/home/icon_settings.png' },
]
