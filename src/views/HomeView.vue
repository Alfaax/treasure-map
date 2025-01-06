<template>
  <main>
    <h1 class="text__title">La carte aux trésors !</h1>
    <p class="text__description"> C'est votre première partie et vous ne savez pas comment jouer ? <router-link
        to="/reglement" class="text__link">Voici le règlement !</router-link>
    </p>
    <p class="text__description">
      Pour commencer, vous devez uploader un fichier (ou coller son contenu). L'extension de votre fichier doit être
      .txt et avoir le
      format
      défini dans le règlement.
    </p>
    <section class="HomeGame__section HomeGame__section--header">

    </section>
    <section class="HomeGame__section HomeGame__section--uploader" v-if="!isGameLoading && !isGameLaunched">
      <div class="HomeGame__uploadChooser">
        <div class="HomeGame__uploadChooserTitle">Upload ton fichier</div>
        <input type="file" accept=".txt" id="uploader" @change="previewFiles">
      </div>
      <div class="HomeGame__uploadChooser">
        <div class="HomeGame__uploadChooserTitle">Ou rentre directement les informations</div>
        <form @submit.prevent="formatText(true)">
          <textarea class="input__textarea" id="textArea" cols="30" rows="10" v-model="textFromArea" />
          <button class="button" type="submit">Valider</button>
        </form>
      </div>
    </section>
    <section class="HomeGame__section HomeGame__section--loader" v-if="isGameLoading">
      <div class="HomeGame__loader">Votre partie est en cours de création ...</div>
      <button class="button" @click="cancelLoad">annuler</button>
    </section>
    <section class="HomeGame__section HomeGame__section--game" v-if="isGameLaunched">
      <Game v-if="isGameLaunched" :params="gameParams" />
      <button class="HomeGame__reset button button--red" @click="regame">relancer une partie</button>
    </section>
    <div class="error">{{ error }}</div>
  </main>
</template>

<script setup lang="ts">
import Game from '../components/GameComponent.vue';
import { ref } from 'vue';

interface GameParams {
  map: TMap,
  mountains?: Coordonnates[],
  treasures: Treasure[]
  players: Player[]
}

const error = ref<string>('');
const isGameLoading = ref<boolean>(false);
const isGameLaunched = ref<boolean>(false);

const previewText = ref<null | string | ArrayBuffer>(null);
const textFromArea = ref<string | null>(null);

const lines = ref<string[]>([]);
const gameLines = ref<string[]>([]);

const gameParams = ref<GameParams>({} as GameParams);

const previewFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target?.files?.[0]) {
    const extension = target.files[0]?.name?.split('.')?.pop()?.toLowerCase();
    if (extension !== 'txt') {
      error.value = 'Veuillez uploader un fichier .txt';
      return
    }

    const reader = new FileReader();
    const file = target.files[0];
    reader.readAsText(file);
    reader.onload = (eventReader) => {
      if (!eventReader.target) return;
      previewText.value = eventReader.target.result;
      formatText()
    };
  }
}

const formatText = (isFromArea?: boolean) => {
  if (isFromArea && textFromArea.value) {
    lines.value = textFromArea.value?.split('\n');
    isGameLoading.value = true;
  } else if (isFromArea && !textFromArea.value) {
    error.value = 'Veuillez entrer du texte pour lancer la partie';
  } else {
    if (typeof previewText.value !== 'string') return;
    lines.value = previewText.value?.split('\n');
    isGameLoading.value = true;
  }

  if (lines.value?.length === 0) return;
  gameLines.value = lines.value
    .filter((line) => line.charAt(0) !== '#')
    .map((line) => line.replace(new RegExp(' - ', 'g'), '-'));

  setGameData()
}

const setGameData = () => {
  gameLines.value.forEach((line) => {
    const splitLine = line.split('-');
    switch (line.charAt(0)) {
      case 'C':
        gameParams.value.map = {
          width: parseInt(splitLine[1]),
          height: parseInt(splitLine[2])
        };
        break;
      case 'M':
        const mountain = {
          x: parseInt(splitLine[1]),
          y: parseInt(splitLine[2])
        }
        if (gameParams.value.mountains) gameParams.value.mountains.push(mountain); else gameParams.value.mountains = [mountain];
        break;
      case 'T':
        const treasure = {
          x: parseInt(splitLine[1]),
          y: parseInt(splitLine[2]),
          nb: parseInt(splitLine[3])
        }
        if (gameParams.value.treasures) gameParams.value.treasures.push(treasure); else gameParams.value.treasures = [treasure];
        break;
      case 'A':
        const player = {
          name: splitLine[1],
          x: parseInt(splitLine[2]),
          y: parseInt(splitLine[3]),
          orientation: splitLine[4],
          moves: splitLine[5]
        }
        if (gameParams.value.players) gameParams.value.players.push(player); else gameParams.value.players = [player];
        break;
      default:
        break;
    }
  });
  isGameLoading.value = false;
  isGameLaunched.value = true;
}

const regame = () => {
  isGameLaunched.value = false;
  textFromArea.value = null;
  lines.value = [];
  gameLines.value = [];
  gameParams.value = {} as GameParams;
}
const cancelLoad = () => {
  isGameLoading.value = false;
}
</script>

<style lang="scss" scoped>
.HomeGame {

  &__reset {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  &__section {
    margin-bottom: 12px;

    &--header {
      border-bottom: 1px solid $grey;
    }

    &--uploader {
      display: flex;
      justify-content: center;
      align-content: flex-start;

      form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }

    &--loader {
      text-align: center;
    }

    &--game {

      .button {
        margin-bottom: 12px;
      }
    }
  }

  &__uploadChooser {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
    align-items: center;

    &Title {
      font-size: 12px;
      color: $grey;
    }
  }

  &__loader {
    font-weight: 600;
    color: $green;
    margin-bottom: 24px;
  }
}

.text {

  &__description {
    text-align: center;
  }
}
</style>
