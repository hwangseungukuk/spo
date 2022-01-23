<template>
  <dl class="precautions">
    <dt>※ 거래소 이용 주의 사항 ※</dt>
    <dd>
      거래소에 등록된 판매/구매 내역 중 배당률이 비정상적이거나 우천취소 등
      이례적인 상황이 발생한 경우 사전 안내 없이<br />
      적중특례 (1.0배) 처리될 수 있습니다.<br />
      적중특례 또는 베팅취소 발생으로 인하여 구매한 골드에서 손실이 발생하여도
      별도의 보상은 없습니다.
    </dd>
  </dl>
</template>

<script>
export default {};
</script>

<style scoped>
.precautions {
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  border-radius: 10px;
  margin-top: 20px;
}
.precautions dt {
  width: 230px;
  text-align: center;
  color: #3eb2c0;
  font-weight: 600;
}
.precautions dd {
  margin-bottom: 0px;
  padding: 18px 0;
  font-weight: 400;
}
</style>
