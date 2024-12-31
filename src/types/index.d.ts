interface Coordonnates {
  x: number
  y: number
}

interface Player extends Coordonnates {
  name: string
  orientation: string
}

interface StartPlayer extends Player {
  moves: string
}

interface ResultPlayer extends Player {
  treasures: number
}

interface Treasure extends Coordonnates {
  nb: number
}

interface TMap {
  width: number
  height: number
}
