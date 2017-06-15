describe('configuration', () => {
  const path = '../../lib/configuration/configuration'
  const backup = Object.assign({}, process.env);

  afterEach(() => {
    Object.assign(process.env, backup);
  });

  it('should be valid - environment=production', () => {
    process.env.NODE_ENV = 'production';

    expect(require(path)).toMatchObject({
      development: false
    });
  });

  it('should be valid - environment=development', () => {
    process.env.NODE_ENV = 'development';

    expect(require(path)).toMatchObject({
      development: true
    });
  });
});