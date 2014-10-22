describe('E2E: Content', function() {

  it('should have a sign up button', function() {
    browser().navigateTo('/#/');
    expect(
      element("a#login").html()
    ).toEqual("Try it! Sign in");
  });

  it('should show login when clicking sign in', function() {
    browser().navigateTo('/#/');
    element("a#login", "Sign in button").click();
    expect(browser().location().path())
      .toBe('/login');
  });

  it('should be able to fill in the loggingInUser info', function() {
    browser().navigateTo('/#/');
    element("a#login", "Sign in button").click();
    input("loggingInUser.email").enter("ari@fullstack.io");
    input("loggingInUser.password").enter('123123');
    element('form input[type="submit"]').click();
    expect(browser().location().path())
      .toBe('/dashboard');
  });

  // it('should have an entry form on the dashboard page', 
  //   function() {
  //     browser().navigateTo('/#/');
  //     sleep(1);
  //     element('a#login', 'login button').click();
  //     element("button#googleAuthButton").click();
  //     sleep(1);
  //     expect(
  //       element('#newEntry input').val()
  //     ).toBeDefined();
  // });

});