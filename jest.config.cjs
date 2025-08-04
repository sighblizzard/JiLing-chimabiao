module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: [
    '**/test/**/*.(test|spec).(js|jsx)',
    '**/test/verify-*.js',
    '**/test/test-*.js',
    '**/test/format-test.js',
    '**/test/app.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test/setupTests.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(antd|@ant-design|rc-.+|@babel/runtime)/)'
  ]
};
