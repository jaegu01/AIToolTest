# Skill: i18n-check

다국어 번역 누락 검사 스킬

## Description
모든 언어 파일(ko, en, ja, zh-CN, zh-TW)에서 번역 누락을 검사합니다.

## Instructions

1. 기준 파일 읽기:
   - `src/i18n/locales/ko.json`을 기준으로 사용

2. 모든 언어 파일 비교:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/ja.json`
   - `src/i18n/locales/zh-CN.json`
   - `src/i18n/locales/zh-TW.json`

3. 검사 항목:
   - 누락된 키 찾기
   - 빈 값("")이 있는 키 찾기
   - 기준 파일에 없지만 다른 파일에 있는 키 (미사용 키)

4. 결과 리포트:
   - 언어별 누락 키 목록
   - 번역 완료율 (%)
   - 수정이 필요한 파일 목록

## Output Format
```
=== i18n 검사 결과 ===

[ko] 기준 파일: 120 keys
[en] 완료: 118/120 (98.3%)
  - 누락: calculators.newCalc.name
  - 누락: common.newFeature
[ja] 완료: 115/120 (95.8%)
  ...
```

## Actions
- 누락된 키에 대해 번역 제안
- 번역 파일 자동 업데이트 (사용자 확인 후)
