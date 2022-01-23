<template>
  <div class="white_cover">
    <div class="guide-content default-ctn">
      <img
        class="interface"
        src="/images/info/guide/interface.png"
        alt="인터페이스"
      />
      <dl>
        <dt>PC 인터페이스 소개</dt>
      </dl>

      <table>
        <tbody>
          <tr>
            <th>1. 네비게이션(메뉴)</th>
            <td>상단의 메뉴를 이용하여 각 컨텐츠로 이동할 수 있습니다.</td>
          </tr>
          <tr>
            <th>2. 메인 배너</th>
            <td>스포라이브의 다양한 이슈 및 이벤트를 확인할 수 있습니다.</td>
          </tr>
          <tr>
            <th>3. 오늘의 추천경기</th>
            <td>
              스포라이브가 선정한 추천 승무패 게임 목록을 확인 및 베팅할 수
              있습니다.
            </td>
          </tr>
          <tr>
            <th>4. 경기일정 및 결과</th>
            <td>
              스포라이브에서 제공하는 승부예측 게임의 경기 일정 및 결과를 확인할
              수 있습니다.
            </td>
          </tr>
          <tr>
            <th>5. 새소식</th>
            <td>
              공지사항, 업데이트, 이벤트 등 다양한 소식을 확인할 수 있습니다.
            </td>
          </tr>
          <tr>
            <th>6. 커뮤니티</th>
            <td>
              게시판 활동 및 다양한 스포츠 영상과 정보를 확인할 수 있습니다.
            </td>
          </tr>
          <tr>
            <th>7. 프로필 영역</th>
            <td>
              닉네임, 보유 게임머니, 쪽지 등 자세한 회원 정보를 확인할 수
              있습니다.
            </td>
          </tr>
          <tr>
            <th>8. 베팅카트</th>
            <td>
              승부예측 게임에서 경기를 선택하면 베팅카트(Bet Slip)에서 확인하고
              베팅 할 수 있습니다.
            </td>
          </tr>
          <tr>
            <th>9. 캐주얼 게임</th>
            <td>
              스포라이브에서 제공하는 다양한 캐주얼 게임으로 이동할 수 있습니다.
            </td>
          </tr>
          <tr>
            <th>10. 라이브 채팅</th>
            <td>채팅에 참여할 수 있습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
};
</script>

<style scoped>
@import url(~assets/css/info_pages.css);
.guide-content .interface {
  max-width: 100%;
}
div.guide-content > dl {
  padding-bottom: 10px;
}
div.guide-content table {
  margin-left: 0px;
  width: 100%;
}
div.guide-content table tbody tr th {
  background: #3c577e;
  color: #fff;
  font-size: 800;
}
div.guide-content table tbody tr td {
  text-align: left;
  padding-left: 18px;
  color: #444;
  font-size: 800;
}
</style>
