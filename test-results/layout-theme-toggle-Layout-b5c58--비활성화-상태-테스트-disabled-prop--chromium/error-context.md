# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - banner [ref=e4]:
      - heading "민지의 다이어리" [level=1] [ref=e5] [cursor=pointer]
      - button "로그인" [ref=e7] [cursor=pointer]:
        - generic [ref=e8] [cursor=pointer]: 로그인
    - img "배너 이미지" [ref=e11]
    - navigation [ref=e13]:
      - generic [ref=e15] [cursor=pointer]: 일기보관함
      - generic [ref=e17] [cursor=pointer]: 사진보관함
    - main [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e21]:
          - generic [ref=e22]:
            - combobox [ref=e23] [cursor=pointer]:
              - generic [ref=e24] [cursor=pointer]:
                - generic [ref=e25] [cursor=pointer]: 필터 선택
                - img "드롭다운" [ref=e27] [cursor=pointer]
            - generic [ref=e29]:
              - img "검색" [ref=e31]
              - textbox "일기를 검색해보세요" [ref=e32]
          - button "일기쓰기" [ref=e34] [cursor=pointer]:
            - generic [ref=e35] [cursor=pointer]: 일기쓰기
        - navigation "페이지네이션" [ref=e40]:
          - button "이전 페이지" [disabled] [ref=e41]:
            - img "이전" [ref=e42]
          - button "다음 페이지" [disabled] [ref=e43]:
            - img "다음" [ref=e44]
    - contentinfo [ref=e46]
```