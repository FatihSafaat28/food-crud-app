import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'app/*.tsx',
    'app/register/**/*.tsx',
    'app/dashboard/menu/**/*.tsx',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)