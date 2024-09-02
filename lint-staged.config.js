const TYPESCRIPT_MODULES = [
  {
    name: 'client',
    path: 'apps/client',
  },
  {
    name: 'server',
    path: 'apps/server',
  },
];

const TYPESCRIPT_LINTER = TYPESCRIPT_MODULES.reduce((acc, { name, path }) => {
  acc[`${path}/**/*.{js,jsx,ts,tsx}`] = [
    () => `pnpm typecheck --filter ${name}`,
    `pnpm lint --filter ${name} -- --fix`,
  ];

  return acc;
}, {});

module.exports = {
  ...TYPESCRIPT_LINTER,
  '*.json': ['prettier --write'],
};