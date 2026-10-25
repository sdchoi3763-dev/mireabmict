/* www/index.html 을 설치형 앱용으로 준비합니다.
   - 앱 안에서 실행 중임을 알리는 표시(window.TL_NATIVE)를 맨 앞에 넣습니다. 이미 있으면 그대로 둡니다.
   - Claude 아티팩트에서 저장한 HTML을 그대로 www/index.html 로 넣어도 됩니다. */
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', 'www', 'index.html');
if (!fs.existsSync(file)){ console.error('www/index.html 이 없습니다. 앱 화면 파일을 www 폴더에 넣어 주세요.'); process.exit(1); }
let html = fs.readFileSync(file, 'utf8');
const MARK = '<script>window.TL_NATIVE=true</script>';
if (!html.includes('window.TL_NATIVE=true')){
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + MARK);
  else html = MARK + html;
  fs.writeFileSync(file, html);
  console.log('www/index.html: 설치형 앱 표시를 넣었습니다');
} else console.log('www/index.html: 준비됨');
