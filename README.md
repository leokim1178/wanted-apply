# 프리 온보딩 백엔드 코스 선발과제

### 필수 기술요건

- [x] 사용 언어 : TypeScript
- [x] 프레임워크 : nestjs
- [x] REST API 로 구현
- [x] ORM 사용하여 구현 : TypeORM
- [x] RDBMS 사용 : MySQL

### 과제 요구사항 수행

- [x] 채용공고 등록
- [x] 채용공고 수정
- [x] 채용공고 삭제
- [x] 채용공고 전체목록조회
- [x] 채용공고 검색조회
- [x] 채용 상세 페이지
- [x] 채용공고 지원

<hr>
</hr>

## 기술 스택

<br>
<div align='center'> 🖥&nbsp&nbsp&nbsp사용한 기술 스택</div>
<br>
<p align="center">
📑&nbsp&nbsp&nbsp구성 언어

<p align="center">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/js-icon.svg">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/ts-icon.svg">

<p align="center">
언어는 JS & TS를 사용했습니다
  </p>
  </p>
 <p align="center">
🏠&nbsp&nbsp&nbsp데이터베이스
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/mysql-icon.svg">
<p align="center">
RDBMS로 MYSQL을 사용하였습니다
</p>
  </p>
<p align="center">
🏖&nbsp&nbsp&nbspWith...
  </p>
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/restapi-icon.svg">
&nbsp&nbsp
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/docker-icon.svg">
  &nbsp&nbsp
<img alt= "icon" wide="60" height="60" src ="https://symbols.getvecta.com/stencil_89/37_nestjs-icon.a67daec196.svg">
  &nbsp&nbsp&nbsp
<img alt= "icon" wide="60" height= "60" src ="https://images.velog.io/images/sjy0917/post/45b7622b-54df-4f04-bd83-278c33c9bc90/typeorm.png">  
<p align="center">
nestjs과 TypeORM을 기반으로 Rest API를 구성했으며 도커 환경을 설정했습니다 
</p>

<hr>
</hr>

## 요구사항 분석 및 구현 과정

1. 채용공고 등록

   1. API type

   - type : [`Post`]
   - return type : `Recruit`

   1. param명

   - "회사\_id": companyId
   - "채용포지션": position
   - "채용보상금": incentive
   - "채용내용": detail
   - "사용기술": techStack
   - request.body로 받아 CreateRecruitInput dto로 타입지정

   1. 구현과정

   - checkExist()로 존재하는 company인지 확인
   - TypeORM save()를 사용, request.body의 input을 스프레드 연산자를 통해 저장

</br>

2. 채용공고 수정
   1. API type
   - type : [`Patch`]
   - return type : `Recruit`
   2. param명
   - create와 동일
   - request.body로 받아 UpdateRecruitInput dto로 타입지정
   3. 구현과정
   - checkExist()로 존재하는 recruit인지 확인
   - TypeORM save() 사용, request.body의 input을 스프레드 연산자를 통해 저장

</br>

3.  채용공고 삭제

    1. API type

    - type: [`Delete`]
    - return type : `Boolean`

    2. param명

    - recruitId : 채용공고의 ID

    3. 구현과정

    - checkExist()로 존재하는 recruit인지 확인
    - TypeORM delete()를 사용해 삭제

    </br>

4.  채용공고 목록 불러오기

    1. 전체 목록 불러오기
       1. API type
       - type: [`Get`]
       - return type: [`Recruit[]`]
       2. param 없음
       3. 구현과정
          - TypeORM find()를 사용해 모든 채용공고 조회
    2. 검색 기능 구현

       1. API type

       - type: [`Get`]
       - return type: [`Recruit[]`]

       2. param명

       - request.query => search : string

       3. 구현과정

       - TypeORM `querybuilder`를 사용
       - company relation을 `leftJoinAndSelect`
       - SQL문 `LIKE` 술어로 `%`와일드카드를 사용해 검색어(`search`)를 포함하는 항목들 검색(검색 항목 : `채용포지션`,`회사명`, `채용내용`,`기술스택`)
       - getMany()

       </br>

5.  채용공고 상세

    1. API type

       - type: [`Get`]
       - return type: [`Recruit`]

    2. param명

       - request.query => recruitId : number

    3. 구현과정

       - TypeORM `querybuilder`를 사용
       - company와 company의 채용공고목록 relation을 `leftJoinAndSelect`
       - getOne()

    </br>

6.  채용공고 지원

    1. API type

    - type: [`Post`]
    - return type: [`User.applies`]

    2. param명

    - request.body => recruitId : number, userId : string

    3. 구현과정

    - id들과 TypeORM findOne으로 recruit, user 조회
    - 다대다 관계에 있는 지원자명단 recruit.applicants(`User[]`)에 지원하는 user를 추가(중복 지원일 경우 406 error)
    - 지원자가 포함된 지원자명단을 해당 recruit에 save()
    - 지원자의 지원목록 리턴

7.  기타
    1.  @nestjs/common의 exception filter로 예외처리,에러 핸들링
    2.  NotFoundException(404 error) 예외처리는 checkExist 함수로 따로 분리해 기능에 필요한 table을 조회함과 동시에 에러 핸들링을 하고자 했습니다.
    3.  JSdoc 주석을 사용해 api를 설명했습니다 JSdoc 파일을 따로 만들진 않았습니다.

<hr>
</hr>

## 실행방법

- git clone https://github.com/leokim1178/wanted_pre_onboarding
- terminal commands

```
# local
brew install mysql
mysql.server start
mysql_secure_installation
    비밀번호(1234) 및 기타 설정
mysql -u root -p
    Enter password : 1234
yarn start:dev

# docker (권장)
docker 설치
docker compose build
docker compose up
```

웹 브라우저 혹은 Postman 으로 api 테스트

<hr>
</hr>

## ERD 설계

![](/readme-imgs/wanted-database.png)

- 회사와 채용공고 : 1 : N 관계
- 채용공고와 유저 : N : M 관계
- 국가와 지역명은 create에 포함되지 않아 default값(country:"한국",region:"서울")으로 설정

<hr>
</hr>

## 폴더 구조

```
🚀 wanted_pre_onboarding
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ README.md
├─ nest-cli.json
├─ readme-imgs
├─ 🐳 .dockerignore
├─ 🐳 Dockerfile
├─ 🐳 docker-compose.yaml
├─ 🎒 package.json
├─ src
│  ├─ 🍇 apis
│  │  ├─ 🏢 company
│  │  │  └─ entities
│  │  │     └─ company.entity.ts
│  │  ├─ 🎖 recruit
│  │  │  ├─ dto
│  │  │  │  ├─ createRecruitInput.ts
│  │  │  │  └─ updateRecruitInput.ts
│  │  │  ├─ entities
│  │  │  │  └─ recruit.entity.ts
│  │  │  ├─ recruit.controller.ts
│  │  │  ├─ recruit.module.ts
│  │  │  └─ recruit.service.ts
│  │  └─ 🧑‍💻 user
│  │     └─ entities
│  │        └─ user.entity.ts
│  ├─ 👑 app.module.ts
│  ├─ commons
│  │  └─ filter
│  │     └─ http-exception-filter.ts
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
├─ tsconfig.json
└─ yarn.lock
```
