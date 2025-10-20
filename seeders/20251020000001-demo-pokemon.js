'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('pokemon', [
      {
        name: 'Charizard',
        type: 'fire',
        secondary_type: 'flying',
        base_attack: 84,
        base_defense: 78,
        base_hp: 78,
        height: 1.7,
        weight: 90.5,
        description: 'Charizard vole dans le ciel à la recherche de proies puissantes. Son souffle brûlant peut faire fondre n\'importe quoi. Mais il ne crachera jamais de flammes sur un ennemi plus faible.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Blastoise',
        type: 'water',
        secondary_type: null,
        base_attack: 83,
        base_defense: 100,
        base_hp: 79,
        height: 1.6,
        weight: 85.5,
        description: 'Blastoise dispose de canons à eau émergeant de sa carapace. Ils sont très précis et peuvent envoyer des balles d\'eau capables de faire mouche sur une cible située à plus de 50 m.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Venusaur',
        type: 'grass',
        secondary_type: 'poison',
        base_attack: 82,
        base_defense: 83,
        base_hp: 80,
        height: 2.0,
        weight: 100.0,
        description: 'Venusaur porte sur son dos une fleur énorme. On dit que les couleurs de la fleur deviennent plus intenses si elle est bien nourrie et si elle bénéficie d\'un bon ensoleillement.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pikachu',
        type: 'electric',
        secondary_type: null,
        base_attack: 55,
        base_defense: 40,
        base_hp: 35,
        height: 0.4,
        weight: 6.0,
        description: 'Quand plusieurs Pikachu se réunissent, leur énergie électrique peut provoquer de véritables orages.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Jolteon',
        type: 'electric',
        secondary_type: null,
        base_attack: 65,
        base_defense: 60,
        base_hp: 65,
        height: 0.8,
        weight: 24.5,
        description: 'Il accumule des ions négatifs dans l\'atmosphère pour envoyer des décharges électriques de 10 000 volts.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lapras',
        type: 'water',
        secondary_type: 'ice',
        base_attack: 85,
        base_defense: 80,
        base_hp: 130,
        height: 2.5,
        weight: 220.0,
        description: 'Les Lapras sont en voie d\'extinction. Le soir, on dit qu\'on peut entendre leur chant mélancolique.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Articuno',
        type: 'ice',
        secondary_type: 'flying',
        base_attack: 85,
        base_defense: 100,
        base_hp: 90,
        height: 1.7,
        weight: 55.4,
        description: 'Articuno est un Pokémon Oiseau légendaire qui peut contrôler la glace. Le battement de ses ailes gèle l\'air ambiant.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dragonite',
        type: 'dragon',
        secondary_type: 'flying',
        base_attack: 134,
        base_defense: 95,
        base_hp: 91,
        height: 2.2,
        weight: 210.0,
        description: 'Dragonite est capable de faire le tour du globe en seize heures. C\'est un Pokémon au grand cœur qui ramène toujours les Pokémon et les gens perdus en mer.',
        image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pokemon', null, {});
  }
};

