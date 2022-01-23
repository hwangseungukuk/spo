<template>
  <tr>
    <th>
      <i :class="`icon-svg ${getSportByCode(sport).value}`"></i>
      <span>{{ getSportByCode(sport).text }}</span>
    </th>
    <td class="league">
      <span>{{ leagueName }}</span>
    </td>
    <td class="date">
      <span>{{ $moment(date).add(9, 'hours').format('HH:mm') }}</span>
    </td>
    <td class="detail">
      <span>{{ detail }}</span>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    sport: { type: Number, default: 0 },
    leagueName: { type: String, default: 'League name' },
    date: { type: Date, default: () => new Date() },
    detail: { type: String, default: 'detail' },
  },
};
</script>

<style scoped>
tr {
  font-size: 12px;
  color: #888888;
}

th {
  color: #3eb2c0;
  padding-left: 25px;
}

th i.icon-svg {
  width: 14px;
  height: 14px;
  margin-right: 10px;
  background-color: #3eb2c0;
  vertical-align: top;
}

td.league,
td.detail {
  padding-left: 20px;
}

td.date {
  text-align: center;
}
</style>
