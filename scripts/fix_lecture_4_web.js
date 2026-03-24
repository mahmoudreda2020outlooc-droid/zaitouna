const fs = require('fs');

const summary = `بص يا صاحبي، المحاضرة دي جوهرها في حتتين: إزاي تتعامل مع الـ **Arrays** في **PHP** باستخدام الدوال الجاهزة، وإزاي تحمي الداتا اللي بتيجي من المستخدم باستخدام الـ **Filters**. دي مهارات أساسية في أي تطبيق ويب حقيقي!

### 1. دوال الـ Arrays الجاهزة في PHP (Built-in Array Functions)

الـ PHP فيها مكتبة ضخمة من الدوال الجاهزة للتعامل مع المصفوفات، وأبرزها:

- **count()**: بتحسب عدد العناصر في الـ Array.
- **array_push()**: بتضيف عنصر أو أكتر في آخر الـ Array.
- **array_pop()**: بتشيل آخر عنصر من الـ Array وترجعه.
- **array_shift()**: بتشيل أول عنصر من الـ Array وبتعيد ترقيم الباقيين.
- **array_unshift()**: بتضيف عنصر أو أكتر في أول الـ Array.
- **array_merge()**: بتدمج اتنين Arrays أو أكتر في Array واحدة.
- **array_slice()**: بتاخد جزء (Slice) من الـ Array.
- **array_search()**: بتدور على قيمة معينة في الـ Array وترجع الـ Key بتاعها.
- **in_array()**: بتشوف لو قيمة معينة موجودة في الـ Array وترجع true أو false.
- **sort()**: بترتب الـ Array من الأصغر للأكبر.
- **rsort()**: بترتب الـ Array من الأكبر للأصغر (عكس sort).
- **array_reverse()**: بتعكس ترتيب عناصر الـ Array.
- **array_unique()**: بتمسح القيم المتكررة وتسيب نسخة واحدة بس من كل قيمة.

### 2. دوال الفلترة والتحقق (PHP Filters)

الـ **Filters** دي سلاحك عشان تحمي تطبيقك من البيانات الغلط أو الخبيثة اللي بتيجي من المستخدم. في نوعين رئيسيين:

- **filter_var() مع FILTER_VALIDATE**: بتتحقق إن البيانات بالشكل الصح (valid). مثلاً:
    - **FILTER_VALIDATE_EMAIL**: بتشوف لو الإيميل صحيح الشكل.
    - **FILTER_VALIDATE_INT**: بتتحقق لو القيمة رقم صحيح (integer).
    - **FILTER_VALIDATE_URL**: بتتحقق لو الـ URL صحيح الشكل.
- **filter_var() مع FILTER_SANITIZE**: بتنضف البيانات وبتشيل منها أي حاجة مش مرغوبة. مثلاً:
    - **FILTER_SANITIZE_STRING**: بتشيل الـ HTML tags الخطرة من النص.
    - **FILTER_SANITIZE_EMAIL**: بتشيل الحروف غير المسموحة من الإيميل.
    - **FILTER_SANITIZE_NUMBER_INT**: بتسيب الأرقام والعلامات + و - بس وتشيل باقي الحروف.

### الزتونة 🫒
ذاكر الفرق بين Validate (بيتحقق إن الداتا صحيحة) و Sanitize (بينضف الداتا من الأشياء الخطرة) ده هيجي في الامتحان 100%، وتأكد إنك حافظ دوال الـ Arrays الأساسية زي count وarray_push وarray_pop. يلا بالتوفيق!`;

const db = JSON.parse(fs.readFileSync('src/data/lectures.json', 'utf-8'));
const index = db.findIndex(l => l.subjectId === 'WEB-201' && l.lectureId === 'lecture_4');

if (index !== -1) {
    db[index].summary = summary;
    db[index].title = 'المحاضرة 4: دوال الـ Arrays والـ Filters في PHP';
    fs.writeFileSync('src/data/lectures.json', JSON.stringify(db, null, 2), 'utf-8');
    console.log('Done!');
} else {
    console.log('Not found!');
}
