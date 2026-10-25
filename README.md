# ICT INFRA CHECK 설치형 앱 빌드 재료 (v1.1, 2026-10-24)

이 폴더는 휴대폰에 설치하는 ICT INFRA CHECK 앱(APK·아이폰 앱)을 **만드는 재료**입니다. 자세한 순서는 「ICT INFRA CHECK 모바일 앱 설치 매뉴얼」을 보세요.

## 가장 쉬운 방법 — 안드로이드 APK (GitHub)
1. GitHub에 비공개 저장소를 만들고, 이 폴더 **안의 내용 전부**(.github 숨김 폴더 포함)를 올립니다.
2. Actions 탭 → Android APK → Run workflow. 5~10분 뒤 Artifacts의 `ICT_InfraCheck-apk`를 받습니다.
3. 압축을 풀어 나온 `app-debug.apk`를 휴대폰에 옮겨 설치합니다.

## PC에서 직접 빌드 (Node.js 20 이상)
| 명령 | 하는 일 |
| --- | --- |
| `npm install` | 필요한 패키지 설치 (처음 한 번) |
| `npm run android:init` | android 폴더 생성, 권한·아이콘·시작 화면 적용 (여러 번 실행해도 안전) |
| `npm run android:open` | Android Studio로 열기 → ▶ 실행 또는 서명 빌드 |
| `npm run ios:init` / `ios:open` | 아이폰용 (Mac + Xcode 16 이상) |
| `npm run sync` | www/index.html 을 바꾼 뒤 앱 프로젝트에 반영 |

## 앱 화면을 새 버전으로 바꿀 때
`www/index.html` 하나만 새 파일로 바꾸면 됩니다. Claude의 ICT INFRA CHECK 앱에서 저장한 HTML을 그대로 넣어도 됩니다. 빌드할 때 설치형 앱 표시가 자동으로 들어갑니다.

## 구성
| 경로 | 내용 |
| --- | --- |
| `.github/workflows/android-apk.yml` | GitHub에서 APK 자동 빌드 |
| `.github/workflows/ios-build.yml` | GitHub Mac 서버에서 iOS 빌드 확인 (설치 파일은 만들지 않음) |
| `www/index.html` | 앱 화면 전체 |
| `assets/` | 아이콘·시작 화면 그림 |
| `scripts/init.js` | 플랫폼 생성·동기화 |
| `scripts/native-setup.js` | 카메라·마이크·사진·파일 권한, 아이콘 적용 |
| `scripts/prepare-www.js` | 화면 파일에 설치형 앱 표시 넣기 |
| `capacitor.config.json` | 앱 이름 `ICT INFRA CHECK`, 앱 ID `kr.targetlab.app` (기존 설치 앱 데이터 유지를 위해 그대로 둠) |

## 알아 둘 점
- 설치형 앱의 데이터는 **그 휴대폰 안에만** 저장됩니다. 팀 공유·권한·변경 이력·부적합 알림은 Claude 공유 링크 버전에서만 동작합니다. 기기 사이 이동은 「데이터 백업」 ZIP으로 합니다.
- 설비 QR 스캔, PPT·엑셀 만들기는 처음 쓸 때 인터넷이 필요합니다 (도구를 내려받음).
- 스토어에 올리기 전에는 `capacitor.config.json`의 앱 ID를 회사 것으로 바꾸세요.
