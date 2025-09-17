# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - dialog [ref=e5]:
    - dialog "로그인해주세요" [ref=e6]:
      - generic [ref=e7]:
        - heading "로그인해주세요" [level=2] [ref=e8]
        - paragraph [ref=e9]: 이 페이지에 접근하려면 로그인이 필요합니다.
      - button "확인 버튼" [ref=e11] [cursor=pointer]:
        - generic [ref=e12] [cursor=pointer]: 확인
  - dialog [ref=e14]:
    - dialog "로그인해주세요" [ref=e15]:
      - generic [ref=e16]:
        - heading "로그인해주세요" [level=2] [ref=e17]
        - paragraph [ref=e18]: 이 페이지에 접근하려면 로그인이 필요합니다.
      - button "확인 버튼" [ref=e20] [cursor=pointer]:
        - generic [ref=e21] [cursor=pointer]: 확인
```