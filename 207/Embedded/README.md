# Embedded

## 1-1. code convention

```markdown
- Snake casing : Underbar
- 변수는 다 소문자 함수는 앞글자 대문자
```

## 1-2. commit message convention

```markdown
[init] 개발 환경 초기 세팅
[feat] 새로운 기능 추가
[fix] 버그 수정
[docs] 문서 추가, 수정, 삭제
[style] 코드 포맷팅(코드 순서 변경, 세미콜론 추가)
[refactor] 코드 리팩터링
[asset] 폰트, 이미지 추가
[chore] 그 외 자잘한 수정
```

## 1-3. git branch strategy

- 작업 전에 `[보드]기능` 제목으로 이슈 생성
- 'feat/#이슈 번호'로 브랜치 파서 작업
- 작업이 다 끝나면 feat 브랜치에서 main 브랜치로 Pull Request 작성

```markdown
feat#issue_number → main
```

- 브랜치명: `feat/#이슈 번호`
- 이슈제목: `[보드] 기능`
- PR제목: `[보드] 기능`

# 2. GitHub 이슈 템플릿

```xml
### Description
구현할 기능에 대한 설명을 작성하세요

### To-Do
- [ ] todo
- [ ] todo
