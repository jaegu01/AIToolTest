# Skill: calc-test

계산기 테스트 자동화 스킬

## Description
GlassCalc Pro의 모든 계산기에 대해 자동화된 테스트를 실행합니다.

## Instructions

1. 먼저 테스트 환경을 확인합니다:
   - `npm test` 명령으로 기존 테스트 실행
   - 테스트 커버리지 확인

2. 각 계산기별 테스트 케이스:
   - Engineering: 삼각함수, 로그, 지수 연산 검증
   - Financial: 대출 이자, 복리 계산 검증
   - Graph: 함수 파싱 및 그래프 데이터 생성 검증
   - Unit: 단위 변환 정확도 검증
   - Programmer: 진법 변환, 비트 연산 검증
   - Statistics: 통계 함수 (평균, 표준편차) 검증
   - DateTime: 날짜 계산 검증
   - Matrix: 행렬 연산 검증
   - Physics: 물리 공식 검증
   - Chemistry: 화학 계산 검증
   - Health: BMI, 기초대사량 계산 검증
   - Color: 색상 변환 검증

3. 테스트 실행:
   ```bash
   npm test -- --coverage
   ```

4. 실패한 테스트가 있으면 원인 분석 및 수정 제안

## Output Format
- 테스트 결과 요약
- 커버리지 리포트
- 실패한 테스트 목록 및 원인
- 권장 수정 사항
