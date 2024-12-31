<template>
  <div class="gameContainer">
    <button class="gameContainer__start button button--green" @click="startGame" v-if="!partyAlreadyStarted">Lancer la
      partie</button>
    <div class="game">
      <div class="game-x" v-for="(x, indexX) in params.map.width" :key="indexX">
        <div :class="'game-y' + ' pos-' + (x - 1) + '-' + (y - 1)" v-for="(y, indexY) in params.map.height"
          :key="indexY">
          <template v-for="(player, indexPlayer) in params.players" :key="indexPlayer">
            <div class="gamePlayer" v-if="(player.x + 1) === x && (player.y + 1 === y)" :key="indexPlayer">
              <img class="game__icon" src="@/assets/icons/player.svg" alt="player" />
              <div class="game__playerName">{{ player.name }}</div>
            </div>
          </template>
          <template v-for="(mountain, indexMountain) in params.mountains" :key="indexMountain">
            <div class="gameMountain" v-if="(mountain.x + 1) === x && (mountain.y + 1) === y">
              <img class="game__icon" src="@/assets/icons/mountain.svg" alt="mountain" />
            </div>
          </template>
          <template v-for="(treasure, indexTreasure) in liveTreasures" :key="indexTreasure">
            <div class="gameTreasure" v-if="(treasure.x + 1) === x && (treasure.y + 1) === y">
              <img class="game__icon" v-if="treasure.nb > 1" src="@/assets/icons/treasure.svg" alt="treasure" />
              <div class="game__treasureNb" v-if="treasure.nb > 1">{{ treasure.nb }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="game__result" v-if="partyFinished">
      <div>C - {{ params.map.width }} - {{ params.map.height }}</div>
      <div v-for="mountain in params.mountains" :key="mountain">
        M - {{ mountain.x }} - {{ mountain.y }}
      </div>
      <template v-for="treasure in liveTreasures" :key="treasure">
        <div v-if="treasure.nb > 0">
          T - {{ treasure.x }} - {{ treasure.y }} - {{ treasure.nb }}
        </div>
      </template>
      <div v-for="player in params.players" :key="player">
        A - {{ player.name }} - {{ player.x }} - {{ player.y }} - {{ player.orientation }} - {{
          resultPlayers.find((playerTreasure: any) => playerTreasure.name === player.name)?.treasures }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  params: {
    type: Object,
    required: true
  }
});

const livePlayers = ref(props.params.players);
const liveTreasures = ref(props.params.treasures);
const resultPlayers = ref<ResultPlayer[]>([]);
const partyAlreadyStarted = ref<boolean>(false);
const partyFinished = ref<boolean>(false);
const orientations = ['O', 'N', 'E', 'S'];

const roundNumber = computed(() => {
  const roundNumberTmp = ref<number>(0);
  props.params.players.forEach((player: StartPlayer) => {
    if (player.moves.length > roundNumberTmp.value) {
      roundNumberTmp.value = player.moves.length;
    }
  })

  return roundNumberTmp.value;
});

onMounted(() => {
  props.params.players.forEach((player: StartPlayer) => {
    resultPlayers.value.push({
      ...player,
      treasures: 0
    })
  })
})

const startGame = () => {
  partyAlreadyStarted.value = true;
  for (let i = 0; i < roundNumber.value; i++) {
    console.groupCollapsed('TOUR ' + i);
    props.params.players.forEach((player: StartPlayer, index: number) => {
      if (i < player.moves.length) {
        const move = player.moves[i];
        console.log(player.name + ' effectue un mouvement de type ' + move);
        player = {
          ...player,
          ...getPlayerNextPosition(move, player)
        }
        livePlayers.value[index] = player;
      }
    })
    console.groupEnd();
  }
  partyFinished.value = true;
};

const getPlayerNextPosition = (move: string, player: StartPlayer) => {
  switch (move) {
    case 'A':
      return avancer(player);
    case 'D':
      return tourner('D', player);
    case 'G':
      return tourner('G', player);
    default:
      return {};
  }
}

const avancer = (player: StartPlayer) => {
  let isBlocked = false;
  let tmpPlayer: StartPlayer;
  switch (player.orientation) {
    case 'N':
      tmpPlayer = {
        ...player,
        y: player.y - 1
      }
      break;
    case 'S':
      tmpPlayer = {
        ...player,
        y: player.y + 1
      }
      break;
    case 'E':
      tmpPlayer = {
        ...player,
        x: player.x + 1
      }
      break;
    case 'O':
      tmpPlayer = {
        ...player,
        x: player.x - 1
      }
      break;
    default:
      tmpPlayer = player;
      break;
  }

  props.params.mountains.forEach((mountain: Coordonnates) => {
    if (mountain.x === tmpPlayer.x && mountain.y === tmpPlayer.y) {
      console.log(player.name + ' est tombé sur une montagne, il reste à ça position.');
      isBlocked = true;
      tmpPlayer = player;
    }
  })

  if (tmpPlayer.x < 0) tmpPlayer.x = 0;
  if (tmpPlayer.y < 0) tmpPlayer.y = 0;

  if (tmpPlayer.x > props.params.map.width - 1) tmpPlayer.x = props.params.map.width - 1;
  if (tmpPlayer.y > props.params.map.height - 1) tmpPlayer.y = props.params.map.height - 1;

  livePlayers.value.forEach((playerLoop: StartPlayer) => {
    if (playerLoop.name !== tmpPlayer.name)
      if (playerLoop.x === tmpPlayer.x && playerLoop.y === tmpPlayer.y) {
        console.log(player.name + ' est tombé sur ' + playerLoop.name + ', il reste à ça position.');
        isBlocked = true;
        tmpPlayer = player;
      }
  })

  console.log(player.name + ' est maintenant en ' + tmpPlayer.x + ' ' + tmpPlayer.y);

  if (!isBlocked) {
    getTreasure(tmpPlayer);
  }

  return {
    x: tmpPlayer.x,
    y: tmpPlayer.y
  };
}

const tourner = (direction: string, player: StartPlayer) => {
  const lastOrientationIndex = orientations.indexOf(player.orientation);
  let newOrientationIndex: number;
  switch (direction) {
    case 'G':
      newOrientationIndex = lastOrientationIndex === 0 ? orientations.length - 1 : lastOrientationIndex - 1;
      console.log(player.name + ' tourne vers ' + orientations[newOrientationIndex]);
      return {
        orientation: orientations[newOrientationIndex]
      }
    case 'D':
      newOrientationIndex = lastOrientationIndex === orientations.length - 1 ? 0 : lastOrientationIndex + 1;
      console.log(player.name + ' tourne vers ' + orientations[newOrientationIndex]);
      return {
        orientation: orientations[newOrientationIndex]
      }
    default:
      return player;
  }
}

const getTreasure = (player: StartPlayer) => {
  liveTreasures.value.forEach((treasure: Treasure) => {
    if (treasure.x === player.x && treasure.y === player.y) {
      console.log(player.name + ' a trouvé un trésor !' + (treasure.nb > 0 ? '' : ' Malheureusement il était vide.'));
      if (treasure.nb > 0) {
        const playerResult = resultPlayers.value.find((playerResult: ResultPlayer) => playerResult.name === player.name);
        if (playerResult) {
          playerResult.treasures++;
        } else {
          resultPlayers.value.push({
            ...player,
            treasures: 1
          })
        }
      }
      treasure.nb--;
    }
  })
}
</script>

<style scoped lang="scss">
.game {
  display: flex;
  flex-direction: row;

  &__result {
    margin-top: 8px;
    padding-left: 12px;
  }

  &Container {

    &__start {
      width: 100%;
      margin-bottom: 12px;
    }

    .button {
      margin-top: 12px;
    }
  }

  &__icon {
    width: 24px;
  }

  &-x {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: c;
  }

  &-y {
    border: 1px solid green;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &Player,
  &Treasure {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
  }
}
</style>
