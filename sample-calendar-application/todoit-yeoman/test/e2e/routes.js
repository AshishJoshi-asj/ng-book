describe('E2E: Routes', function() {

  it('should load the index page', function() {
    browser().navigateTo('/#/');
    expect(browser().location().path()).toBe('/');
  });

  it('should redirect bad requests to the index page', function() {
    browser().navigateTo('/#/definitely/not/a/route/yo');
    expect(browser().location().path()).toBe('/');
  });

  it('should load the dashboard page', function() {
    browser().navigateTo('/#/dashboard');
    expect(browser().location().path()).toBe('/dashboard');
  });

});