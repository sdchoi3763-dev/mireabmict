/* 사용법: node scripts/init.js android | ios | sync
   android/ios 폴더가 없으면 만들고, 있으면 화면 파일만 다시 넣습니다. 몇 번을 실행해도 안전합니다. */
const { execSync } = require('child_process'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), run = c => { console.log('> ' + c); execSync(c, { stdio: 'inherit', cwd: ROOT }); };
const what = process.argv[2];
if (!['android', 'ios', 'sync'].includes(what)){ console.error('android, ios, sync 중 하나를 붙여 실행하세요'); process.exit(1); }
run('node scripts/prepare-www.js');
const plats = what === 'sync' ? ['android', 'ios'].filter(p => fs.existsSync(path.join(ROOT, p))) : [what];
for (const p of plats){
  if (!fs.existsSync(path.join(ROOT, p))) run(`npx cap add ${p}`);
  run(`node scripts/native-setup.js ${p}`);
  run(`npx cap sync ${p}`);
}
console.log('완료: ' + (plats.join(', ') || '만들어진 플랫폼 없음'));
