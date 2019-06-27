module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true, // se objeto UserGroup cria tabela user_group em vez do padrão UserGroups
    underscoredAll: true, // mesma coisa mas para nome de colunas e relacionamentos
  },
};
