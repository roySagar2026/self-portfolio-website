/** Resolve tech logos from skill names via public CDNs (Devicon + Simple Icons). */

const ALIASES = {
  react: 'react',
  'react.js': 'react',
  'reactjs': 'react',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  next: 'nextjs',
  typescript: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  ts: 'typescript',
  html: 'html5',
  html5: 'html5',
  css: 'css3',
  css3: 'css3',
  sass: 'sass',
  scss: 'sass',
  tailwind: 'tailwindcss',
  'tailwind css': 'tailwindcss',
  tailwindcss: 'tailwindcss',
  'framer motion': 'framer',
  framer: 'framer',
  gsap: 'greensock',
  greensock: 'greensock',
  vue: 'vuejs',
  'vue.js': 'vuejs',
  angular: 'angular',
  svelte: 'svelte',
  'node.js': 'nodejs',
  nodejs: 'nodejs',
  node: 'nodejs',
  express: 'express',
  'express.js': 'express',
  nest: 'nestjs',
  nestjs: 'nestjs',
  graphql: 'graphql',
  rest: 'fastapi',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mysql: 'mysql',
  redis: 'redis',
  firebase: 'firebase',
  supabase: 'supabase',
  docker: 'docker',
  kubernetes: 'kubernetes',
  aws: 'amazonwebservices',
  azure: 'azure',
  gcp: 'googlecloud',
  'google cloud': 'googlecloud',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  figma: 'figma',
  photoshop: 'photoshop',
  illustrator: 'illustrator',
  python: 'python',
  django: 'django',
  flask: 'flask',
  java: 'java',
  spring: 'spring',
  'c++': 'cplusplus',
  'c#': 'csharp',
  php: 'php',
  laravel: 'laravel',
  ruby: 'ruby',
  rails: 'rails',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  swift: 'swift',
  kotlin: 'kotlin',
  flutter: 'flutter',
  dart: 'dart',
  'react native': 'react',
  redux: 'redux',
  vite: 'vite',
  webpack: 'webpack',
  jest: 'jest',
  cypress: 'cypress',
  prisma: 'prisma',
  stripe: 'stripe',
  jwt: 'jsonwebtokens',
  nginx: 'nginx',
  linux: 'linux',
  ubuntu: 'ubuntu',
  vscode: 'vscode',
  'vs code': 'vscode',
  npm: 'npm',
  yarn: 'yarn',
  pnpm: 'pnpm',
  three: 'threedotjs',
  'three.js': 'threedotjs',
  d3: 'd3js',
  'd3.js': 'd3js',
  websocket: 'socketdotio',
  websockets: 'socketdotio',
  'socket.io': 'socketdotio',
  s3: 'amazons3',
  'ci/cd': 'githubactions',
  'ci-cd': 'githubactions',
  'github actions': 'githubactions',
  auth: 'auth0',
  security: 'letsencrypt',
  canvas: 'html5',
  'design systems': 'storybook',
  performance: 'lighthouse',
  'performance tuning': 'lighthouse',
  cloud: 'cloudflare',
};

const DEVICON = {
  react: 'react/react-original',
  nextjs: 'nextjs/nextjs-original',
  typescript: 'typescript/typescript-original',
  javascript: 'javascript/javascript-original',
  html5: 'html5/html5-original',
  css3: 'css3/css3-original',
  sass: 'sass/sass-original',
  tailwindcss: 'tailwindcss/tailwindcss-original',
  vuejs: 'vuejs/vuejs-original',
  angular: 'angularjs/angularjs-original',
  svelte: 'svelte/svelte-original',
  nodejs: 'nodejs/nodejs-original',
  express: 'express/express-original',
  nestjs: 'nestjs/nestjs-original',
  graphql: 'graphql/graphql-plain',
  mongodb: 'mongodb/mongodb-original',
  postgresql: 'postgresql/postgresql-original',
  mysql: 'mysql/mysql-original',
  redis: 'redis/redis-original',
  firebase: 'firebase/firebase-plain',
  docker: 'docker/docker-original',
  kubernetes: 'kubernetes/kubernetes-plain',
  amazonwebservices: 'amazonwebservices/amazonwebservices-original-wordmark',
  azure: 'azure/azure-original',
  googlecloud: 'googlecloud/googlecloud-original',
  git: 'git/git-original',
  github: 'github/github-original',
  gitlab: 'gitlab/gitlab-original',
  figma: 'figma/figma-original',
  photoshop: 'photoshop/photoshop-plain',
  illustrator: 'illustrator/illustrator-plain',
  python: 'python/python-original',
  django: 'django/django-plain',
  flask: 'flask/flask-original',
  java: 'java/java-original',
  spring: 'spring/spring-original',
  cplusplus: 'cplusplus/cplusplus-original',
  csharp: 'csharp/csharp-original',
  php: 'php/php-original',
  laravel: 'laravel/laravel-original',
  ruby: 'ruby/ruby-original',
  rails: 'rails/rails-original',
  go: 'go/go-original',
  rust: 'rust/rust-original',
  swift: 'swift/swift-original',
  kotlin: 'kotlin/kotlin-original',
  flutter: 'flutter/flutter-original',
  dart: 'dart/dart-original',
  redux: 'redux/redux-original',
  vite: 'vitejs/vitejs-original',
  webpack: 'webpack/webpack-original',
  jest: 'jest/jest-plain',
  nginx: 'nginx/nginx-original',
  linux: 'linux/linux-original',
  ubuntu: 'ubuntu/ubuntu-plain',
  vscode: 'vscode/vscode-original',
  npm: 'npm/npm-original-wordmark',
  yarn: 'yarn/yarn-original',
  threedotjs: 'threejs/threejs-original',
  d3js: 'd3js/d3js-original',
  storybook: 'storybook/storybook-original',
  prisma: 'prisma/prisma-original',
  supabase: 'supabase/supabase-original',
};

const SIMPLE = {
  framer: 'framer',
  greensock: 'greensock',
  stripe: 'stripe',
  jsonwebtokens: 'jsonwebtokens',
  socketdotio: 'socketdotio',
  amazons3: 'amazons3',
  githubactions: 'githubactions',
  auth0: 'auth0',
  letsencrypt: 'letsencrypt',
  lighthouse: 'lighthouse',
  cloudflare: 'cloudflare',
  pnpm: 'pnpm',
  cypress: 'cypress',
  fastapi: 'fastapi',
};

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** Pick primary token from combined names like "React / Next.js" or "Git / CI-CD" */
function primaryToken(name) {
  const raw = normalize(name);
  const first = raw.split(/[/|,+&]/)[0].trim();
  return first;
}

export function resolveSkillLogo(skillName, customLogo) {
  if (customLogo) return customLogo;

  const token = primaryToken(skillName);
  const slug = ALIASES[token] || ALIASES[normalize(skillName)] || token.replace(/[^a-z0-9]/g, '');

  if (DEVICON[slug]) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${DEVICON[slug]}.svg`;
  }
  if (SIMPLE[slug]) {
    return `https://cdn.simpleicons.org/${SIMPLE[slug]}/c4c4c4`;
  }

  // Generic fallback: try simpleicons with cleaned slug
  if (slug) {
    return `https://cdn.simpleicons.org/${slug}/c4c4c4`;
  }

  return null;
}

export function skillInitials(name) {
  return String(name || '?')
    .split(/\s|\//)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}
