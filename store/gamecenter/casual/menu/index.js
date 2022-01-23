import JumpBallImage from '~/assets/images/gamecenter/casual/casual-jumpball-big.png';
import CoinTossImage from '~/assets/images/gamecenter/casual/casual-coin-toss-big.png';
import FreeKickImage from '~/assets/images/gamecenter/casual/casual-freekick-big.png';
import ShootingStarImage from '~/assets/images/gamecenter/casual/casual-shootingstar-big.png';

const CASUAL_REG_EX = /:\d{2,}:/;

const state = () => ({
  games: [
    {
      image: CoinTossImage,
      description: '코인은 이미 던져졌다! 어마어마한 스포골드는 누구에게?',
      url: 'http://game.spolive.com/?gametype=cointoss',
      name: '코인토스',
      eng: 'cointoss',
      code: 61,
      history: true,
      order: 1,
    },
    {
      image: JumpBallImage,
      description: '어디로 튈지 모르는 공! 순간의 선택에 엇갈리는 대박의 꿈!',
      url: 'http://game.spolive.com/?gametype=jumpball',
      name: '점프볼',
      code: 63,
      eng: 'jumpball',
      history: true,
      order: 2,
    },
    {
      image: FreeKickImage,
      description:
        '수비를 피해 골을 넣는 짜릿함! 나의 오른발에 스포골드가 걸렸다!',
      url: 'http://game.spolive.com/?gametype=freekick',
      name: '프리킥',
      eng: 'freekick',
      code: 64,
      history: true,
      order: 3,
    },
    {
      image: ShootingStarImage,
      description:
        '이 골에 팀의 승리가 달렸다! 짜릿하고 흥미 넘치는 승부차기의 세계!',
      url: 'http://game.spolive.com/?gametype=shootout',
      name: '슈팅스타',
      eng: 'shootingstar',
      history: false,
      order: 4,
    },
  ],
});

const getters = {
  getGamesForHistory: (state) => {
    return state.games.filter((game) => {
      return game.history;
    });
  },
  getCasualCodeWithBets: (state) => (bets) => {
    let result = bets.match(CASUAL_REG_EX)[0];
    result = result.replaceAll(':', '');
    return parseInt(result);
  },
  getCasualDataWithCode: (state) => (code) => {
    const result = state.games.find((game) => game.code === code);
    if (result) {
      return result;
    } else {
      return {
        name: '알 수 없음',
        eng: 'Unknown',
        code: -1,
      };
    }
  },
  getCasualWithBets: (state, getters) => (bets) => {
    const result = state.games.find((game) => {
      return game.code === getters.getCasualCodeWithBets(bets);
    });
    if (result) {
      return result;
    } else {
      return null;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
};
