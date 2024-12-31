<template>
  <div class="rules">
    <h1 class="rules__title text__title">Réglement</h1>
    <section class="rules__section">
      <h3 class="rules__subtitle text__subtitle">Contexte</h3>
      <p class="rules__description text__description">
        Le gouvernement péruvien vient d’autoriser les aventuriers en quête de trésors à explorer les 85 182 km2 du
        département de la Madre de Dios !
        Les aventuriers vont pouvoir explorer le département selon des déplacement spécifiés à l'avance et pourront peut
        être tomber sur un trésor.
        Attention des montagnes infranchissables sont présentes sur le territoire !
      </p>

      <h3 class="rules__subtitle text__subtitle">Comment jouer ?</h3>
      <p class="rules__description text__description">
        Il faut uploader un fichier ou copier/coller le parcours du jeu. Le parcours du jeu est défini comme suit (les
        lignes n'ont pas d'ordre fixe, l'ordre des lignes ne compte que pour les joueurs):
        <i>si un joueur L est en ligne 1 et un joueur M en ligne 5 c'est le joueur 1 qui jouera en premier et qui aura
          la priorité lors de conflit de position</i>
      </p>

      <h3 class="rules__subtitle text__subtitle">Template de ligne disponible</h3>
      <ul>
        <li>
          <div class="rules__listItem">
            <span class="rules__listTitle">C - {Nb. de case en largeur} - {Nb. de case en hauteur}</span>
            <span class="rules__listDescription"> Définition de la zone de jeux (<strong>C</strong>arte)</span>
          </div>
        </li>
        <li>
          <div class="rules__listItem">
            <span class="rules__listTitle">M - {Axe horizontal} - {Axe vertical}</span>
            <span class="rules__listDescription"> Position d'une montagne (<strong>M</strong>ontagne)</span>
            <span class="rules__listMultiple">Il peut y avoir plusieurs montagnes</span>
          </div>
        </li>
        <li>
          <div class="rules__listItem">
            <span class="rules__listTitle">T - {Axe horizontal} - {Axe vertical} - {Nb. de trésors}</span>
            <span class="rules__listDescription">Position d'un trésor avec le nombre de trésors qu'il renferme
              (<strong>T</strong>résor)</span>
            <span class="rules__listMultiple">Il peut y avoir plusieurs trésors</span>
          </div>
        </li>
        <li>
          <div class="rules__listItem">
            <span class="rules__listTitle">A - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation}
              - {Séquence de
              mouvement}</span>
            <span class="rules__listDescription"> Aventurier avec son nom, sa position de départ et sa <a
                href="#deplacement">séquence de
                déplacement</a> (<strong>A</strong>venturier)</span>
            <span class="rules__listMultiple">Il peut y avoir plusieurs aventuriers</span>
          </div>
        </li>
      </ul>

      <h3 class="rules__subtitle text__subtitle" id="deplacement">Déplacement</h3>
      <p class="rules__description text__description">
        Si vous voulez faire déplacer votre aventurier vous avez 3 paramèetre à votre disposition :
      </p>
      <ul>
        <li><strong>G</strong> pour aller vers la gauche</li>
        <li><strong>D</strong> pour aller vers la droite</li>
        <li><strong>A</strong> pour aller vers l’avant</li>
      </ul>

      En finalité, la séquence de déplacement ressemble à : AAGDADDADGA

      <div class="rules__description text__description">
        Remarque : les aventuriers ne peuvent pas aller hors du territoire de la Madre de Dios (s'ils arrivent à la
        limite
        alors ils seront bloqués).
        De même, si un aventurier a moins de mouvement qu'un autre alors les mouvements du joueur ayant le moins de
        mouvements seront fait durant les premiers tours.
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
</script>

<style lang="scss" scoped>
.rules {

  &__list {

    &Item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: 12px 0;
    }

    &Title {
      font-weight: 400;
      font-size: 16px;
    }

    &Description {
      font-size: 14px;
    }

    &Multiple {
      font-size: 12px;
      color: $green;
    }
  }
}
</style>
