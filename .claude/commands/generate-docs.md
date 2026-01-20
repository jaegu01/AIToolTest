# Command: generate-docs

문서 자동 생성 명령어

## Description
코드에서 문서를 자동으로 생성합니다.

## Usage
```
/generate-docs [type] [--output=path]
```

## Types
- `api`: API/함수 문서
- `components`: 컴포넌트 문서
- `hooks`: 커스텀 훅 문서
- `stores`: 상태 관리 문서
- `all`: 전체 문서

## Instructions

### API 문서 생성
```markdown
# Calculator Evaluator

## evaluate(expression, options)
수식을 평가하고 결과를 반환합니다.

### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| expression | string | Yes | 평가할 수식 |
| options | EvaluatorOptions | No | 평가 옵션 |

### Returns
`EvaluationResult`

### Example
\`\`\`typescript
const result = evaluate('sin(30)', { angleUnit: 'deg' })
// { success: true, result: '0.5' }
\`\`\`
```

### 컴포넌트 문서 생성
```markdown
# Display

계산기 결과를 표시하는 컴포넌트

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | 추가 CSS 클래스 |
| showExpression | boolean | true | 수식 표시 여부 |

## Usage
\`\`\`tsx
<Display showExpression={true} />
\`\`\`
```

### 출력 위치
```
docs/
├── api/
│   ├── calculator.md
│   └── utils.md
├── components/
│   ├── Display.md
│   └── Keypad.md
├── hooks/
│   └── useSound.md
└── stores/
    └── themeStore.md
```

## Example
```
/generate-docs components --output=docs/components

→ docs/components/ 에 컴포넌트 문서 생성
```
