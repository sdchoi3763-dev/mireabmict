/* 카메라·마이크·사진·파일 권한과 아이콘·시작 화면을 android / ios 프로젝트에 넣습니다.
   사용법: node scripts/native-setup.js android | ios   (여러 번 실행해도 같은 결과) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), A = path.join(ROOT, 'assets');
const copy = (src, dst) => { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); };
const plat = process.argv[2];

function android(){
  const res = path.join(ROOT, 'android/app/src/main/res'), man = path.join(ROOT, 'android/app/src/main/AndroidManifest.xml');
  if (!fs.existsSync(man)) throw new Error('android 폴더가 없습니다. 먼저 npm run android:init 을 실행하세요');
  let x = fs.readFileSync(man, 'utf8');
  const perms = [
    'android.permission.INTERNET',
    'android.permission.CAMERA',
    'android.permission.RECORD_AUDIO',
    'android.permission.MODIFY_AUDIO_SETTINGS',
    'android.permission.READ_MEDIA_IMAGES',
    ['android.permission.READ_EXTERNAL_STORAGE', 32],
    ['android.permission.WRITE_EXTERNAL_STORAGE', 29]
  ];
  const add = perms.filter(p => !x.includes(`"${Array.isArray(p) ? p[0] : p}"`)).map(p => Array.isArray(p)
    ? `    <uses-permission android:name="${p[0]}" android:maxSdkVersion="${p[1]}" />` : `    <uses-permission android:name="${p}" />`);
  if (add.length) x = x.replace(/<\/manifest>\s*$/, add.join('\n') + '\n</manifest>\n');
  if (!x.includes('android.hardware.camera')) x = x.replace(/<\/manifest>\s*$/, '    <uses-feature android:name="android.hardware.camera" android:required="false" />\n</manifest>\n');
  if (!x.includes('requestLegacyExternalStorage')) x = x.replace('<application', '<application\n        android:requestLegacyExternalStorage="true"');
  fs.writeFileSync(man, x);
  for (const d of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'])
    for (const f of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'])
      copy(path.join(A, 'android', `mipmap-${d}`, f), path.join(res, `mipmap-${d}`, f));
  fs.mkdirSync(path.join(res, 'values'), { recursive: true });
  fs.writeFileSync(path.join(res, 'values/ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#1F4E79</color>\n</resources>\n');
  for (const d of fs.readdirSync(res)) if (/^drawable/.test(d) && fs.existsSync(path.join(res, d, 'splash.png'))) fs.unlinkSync(path.join(res, d, 'splash.png'));
  copy(path.join(A, 'android/splash.png'), path.join(res, 'drawable/splash.png'));
  console.log('android: 권한·아이콘·시작 화면 설정 완료');
}

function ios(){
  const app = path.join(ROOT, 'ios/App/App'), plist = path.join(app, 'Info.plist');
  if (!fs.existsSync(plist)) throw new Error('ios 폴더가 없습니다. 먼저 npm run ios:init 을 실행하세요 (Mac 필요)');
  let x = fs.readFileSync(plist, 'utf8');
  const keys = [
    ['NSCameraUsageDescription', '<string>점검 사진과 설비 QR 라벨을 촬영합니다.</string>'],
    ['NSMicrophoneUsageDescription', '<string>점검 항목에 음성 메모를 녹음합니다.</string>'],
    ['NSPhotoLibraryUsageDescription', '<string>앨범의 사진을 점검표에 첨부합니다.</string>'],
    ['NSPhotoLibraryAddUsageDescription', '<string>점검 사진을 앨범에 저장합니다.</string>'],
    ['UIFileSharingEnabled', '<true/>'],
    ['LSSupportsOpeningDocumentsInPlace', '<true/>']
  ];
  const add = keys.filter(([k]) => !x.includes(`<key>${k}</key>`)).map(([k, v]) => `\t<key>${k}</key>\n\t${v}`).join('\n');
  if (add) x = x.replace(/<\/dict>\s*<\/plist>\s*$/, add + '\n</dict>\n</plist>\n');
  fs.writeFileSync(plist, x);
  const icons = path.join(app, 'Assets.xcassets/AppIcon.appiconset');
  if (fs.existsSync(icons)) copy(path.join(A, 'ios/AppIcon-512@2x.png'), path.join(icons, 'AppIcon-512@2x.png'));
  const sp = path.join(app, 'Assets.xcassets/Splash.imageset');
  if (fs.existsSync(sp)) for (const f of fs.readdirSync(sp)) if (f.endsWith('.png')) copy(path.join(A, 'ios/splash-2732x2732.png'), path.join(sp, f));
  console.log('ios: 권한 안내 문구·파일 공유·아이콘·시작 화면 설정 완료');
}

try { plat === 'android' ? android() : plat === 'ios' ? ios() : (console.error('android 또는 ios 를 붙여 실행하세요'), process.exit(1)); }
catch(e){ console.error(e.message); process.exit(1); }
