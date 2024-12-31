import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import GameComponent from '@/components/GameComponent.vue'

const defaultParams = {
  map: { width: 3, height: 4 },
  players: [
      {
          name: 'Player1',
          x: 1,
          y: 1,
          orientation: 'S',
          moves: 'A'
      },
  ],
  mountains: [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
  ],
  treasures: [
      { x: 0, y: 3, nb: 2 },
      { x: 1, y: 3, nb: 3 },
  ],
};

describe("GameComponent.vue", () => {
  const wrapper = mount(GameComponent, {
      props: {
          params: defaultParams
      },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance = wrapper.vm as any;

  test("Les joueurs sont correctement initialisés", () => {
      expect(instance.livePlayers).toEqual(defaultParams.players);
  });

  test("Les trésors sont correctement initialisées", () => {
    expect(instance.liveTreasures).toEqual(defaultParams.treasures);
  });

  test("Les montagnes sont correctement initialisées", () => {
    expect(instance.params.mountains).toEqual(defaultParams.mountains);
  });

  test("Le nombre de tour est correct", () => {
    expect(instance.roundNumber).toBe(1)
  })

  test("getTreasure est fonctionnel", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = wrapper.vm as any;
    instance.getTreasure(defaultParams.players[0])
    expect(instance.liveTreasures[0].nb).toBe(2)

    instance.getTreasure({
      ...defaultParams.players[0],
      x: 0,
      y: 3
    })
    expect(instance.liveTreasures[0].nb).toBe(1)

    instance.liveTreasures[0].nb = 2
  })

  test("avancer est fonctionnel", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = wrapper.vm as any;
    expect(instance.getPlayerNextPosition('A', defaultParams.players[0])).toEqual({ x: 1, y: 2 })
  })

  test("tourner à droite est fonctionnel", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = wrapper.vm as any;
    expect(instance.getPlayerNextPosition('D', defaultParams.players[0])).toEqual({ orientation: 'O' })
  })

  test("tourner à gauche est fonctionnel", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = wrapper.vm as any;
    expect(instance.getPlayerNextPosition('G', defaultParams.players[0])).toEqual({ orientation: 'E' })
  })

  test("startGame est fonctionnel", () => {
    const wrapper1 = mount(GameComponent, {
        props: {
            params: defaultParams
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance1 = wrapper1.vm as any;

    expect(instance1.livePlayers[0].x).toBe(1)
    expect(instance1.livePlayers[0].y).toBe(1)
    instance1.startGame()
    expect(instance1.partyAlreadyStarted).toBe(true)
    expect(instance1.livePlayers[0].x).toBe(1)
    expect(instance1.livePlayers[0].y).toBe(2)
    expect(instance1.livePlayers[0].orientation).toBe('S')
    expect(instance1.resultPlayers[0].treasures).toBe(0)
  })
});
