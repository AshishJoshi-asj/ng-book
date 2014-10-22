describe('E2E: Routes', function() {

  it('should load the index page', function() {
    browser().navigateTo('/#/');
    expect(browser().location().path()).toBe('/');
  });

  it('should redirect bad requests to the index page', function() {
    browser().navigateTo('/#/definitely/not/a/route/yo');
    expect(browser().location().path()).toBe('/');
  });

  // it('should load the index page without user', function() {
  //   browser().navigateTo('/#/dashboard');
  //   expect(browser().location().path()).toBe('/');
  // });

  // it('should load the dashboard with valid user', 
  //   function() {
  //     browser().navigateTo('/#/');
  //     sleep(1);
  //     element('button', 'google login button').click();
  //     sleep(1);
  //     expect(browser().location().path())
  //       .toBe('/dashboard');
  //   });

});