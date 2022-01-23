<template>
  <div class="white_cover">
    <div class="trades-guide-content default-ctn mb-0">
      <dl class="d-flex">
        <dt>베팅 내역 거래소 이용방법</dt>
        <dd>
          스포라이브에 가입한 회원이면 베팅 내역 거래소를 통해 내가 베팅한
          내역을 쉽게 공유하고 판매도 가능합니다!
        </dd>
      </dl>
      <h3 class="text-white font-bold d-inline-block px-2 mb-1">
        거래소 이용방법
      </h3>
      <div class="d-flex flex-column">
        <p class="mb-2">
          1. 원하는 검색 조건을 설정하여 거래소에 올라온 베팅 내역을
          조회해보세요.
        </p>
        <img src="~assets/images/trades/trades-use-1.png" alt="" />
      </div>
      <div class="d-flex flex-column mt-4">
        <p class="mb-2">
          2. 펼치기 버튼을 클릭하면 베팅 내역을 상세하게 확인할 수 있습니다.
        </p>
        <img src="~assets/images/trades/trades-use-2.png" alt="" />
      </div>
      <div class="d-flex flex-column mt-4">
        <p class="mb-2">
          3. 구매를 원할 경우 구매하기 버튼을 클릭하여 원하는 베팅 내역을 구매할
          수 있습니다.
        </p>
        <img src="~assets/images/trades/trades-use-3.png" alt="" />
      </div>
      <div class="d-flex flex-column mt-4">
        <p class="mb-2">
          4. 내용 확인 후 최종으로 '구매' 버튼을 클릭하면 구매가 완료됩니다.
        </p>
        <img
          src="~assets/images/trades/trades-use-4.png"
          alt=""
          style="width: 450px"
        />
      </div>

      <div class="attention mt-4">
        <p class="pl-4 pr-5 m-0"><strong>※구매 시 꼭 확인해주세요.※</strong></p>
        <ul>
          <li>
            - 구매 시 안내 팝업을 통해 베팅 내역 구매 정보에 대해 한번 더 확인이
            가능합니다.
          </li>
          <li>
            - 아직 베팅이 마감되지 않고 베팅 폴더 중
            <strong> 마지막 경기 시작 10분 전까지 거래가 가능합니다.</strong>
          </li>
          <li>
            -
            <strong
              >경기 취소나 적중특례 시 원금 보장이 되지 않을 수
              있습니다.</strong
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url(~assets/css/info_pages.css);

.guide-content div:nth-of-type(3) img {
  width: 400px;
}
</style>
