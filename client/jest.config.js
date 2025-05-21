// jest.config.js
export default {
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
};
