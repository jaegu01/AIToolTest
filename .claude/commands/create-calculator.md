# Command: create-calculator

새 계산기 스캐폴딩 명령어

## Description
새로운 유형의 계산기를 위한 기본 파일 구조를 생성합니다.

## Usage
```
/create-calculator [name] [--description="설명"]
```

## Instructions

1. 파일 생성:
   ```
   src/
   ├── app/[locale]/[name]/
   │   └── page.tsx
   ├── components/calculator/[name]/
   │   ├── [Name]Calculator.tsx
   │   ├── [Name]Keypad.tsx
   │   └── [Name]Display.tsx
   ├── stores/[name]Store.ts
   └── lib/calculator/[name].ts
   ```

2. 페이지 템플릿:
   ```tsx
   "use client";

   import { useTranslations } from "next-intl";
   import { CalculatorShell } from "@/components/calculator/CalculatorShell";
   import { [Name]Calculator } from "@/components/calculator/[name]/[Name]Calculator";

   export default function [Name]Page() {
     const t = useTranslations();

     return (
       <CalculatorShell
         title={t("calculators.[name].name")}
         description={t("calculators.[name].description")}
       >
         <[Name]Calculator />
       </CalculatorShell>
     );
   }
   ```

3. 계산기 컴포넌트 템플릿:
   ```tsx
   "use client";

   import { Display } from "@/components/calculator/Display";
   import { [Name]Keypad } from "./[Name]Keypad";
   import { use[Name]Store } from "@/stores/[name]Store";

   export function [Name]Calculator() {
     return (
       <div className="glass p-4 rounded-2xl">
         <Display />
         <[Name]Keypad />
       </div>
     );
   }
   ```

4. 스토어 템플릿:
   ```typescript
   import { create } from "zustand";

   interface [Name]State {
     // 상태 정의
   }

   export const use[Name]Store = create<[Name]State>((set) => ({
     // 초기 상태 및 액션
   }));
   ```

5. 번역 키 추가:
   ```json
   {
     "calculators": {
       "[name]": {
         "name": "[Name] 계산기",
         "description": "[설명]"
       }
     }
   }
   ```

6. 홈페이지에 계산기 추가:
   - `src/app/[locale]/page.tsx`의 calculators 배열에 추가
   - 적절한 아이콘 선택

## Example
```
/create-calculator currency --description="환율 계산기"

→ Currency 계산기 스캐폴딩 생성
→ 5개 언어 번역 키 추가
→ 홈페이지에 추가
```

## Generated Files
- `src/app/[locale]/currency/page.tsx`
- `src/components/calculator/currency/CurrencyCalculator.tsx`
- `src/components/calculator/currency/CurrencyKeypad.tsx`
- `src/stores/currencyStore.ts`
- `src/lib/calculator/currency.ts`
