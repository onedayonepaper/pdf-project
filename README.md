# PDF Merge

온라인 PDF 병합 도구. 서버 업로드 없이 브라우저에서 직접 PDF 파일을 병합합니다.

## 기능

- 최대 10개의 PDF 파일 병합
- 각 파일 최대 20MB
- 드래그 앤 드롭 지원
- 실시간 진행률 표시
- 모바일 지원
- 다국어 지원 (영어, 한국어)

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- pdf-lib
- react-dnd
- i18next

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/yourusername/pdf-merge.git
cd pdf-merge
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 빌드
```bash
npm run build
```

## 사용 방법

1. PDF 파일을 드래그 앤 드롭하거나 클릭하여 선택
2. 파일 순서를 드래그하여 변경
3. "PDF 병합하기" 버튼 클릭
4. 병합된 PDF 파일 다운로드

## 제한사항

- 최대 10개의 PDF 파일
- 각 파일 최대 20MB
- PDF 형식만 지원

## 라이선스

MIT

## 개인정보 보호정책

이 애플리케이션은 모든 처리를 클라이언트 측에서 수행하며, 서버로 파일을 업로드하지 않습니다. 사용자의 PDF 파일은 브라우저 메모리에서만 처리되며, 서버에 저장되지 않습니다. 