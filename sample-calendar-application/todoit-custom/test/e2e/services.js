describe('E2E: Services', function() {

  describe('events lister', function() {

    beforeEach(function() {
      window.bootE2E();
      browser().navigateTo('/#/');
      element("a#login", "Sign in button").click();
      input("loggingInUser.email").enter("ari@fullstack.io");
      input("loggingInUser.password").enter('123123');
      element('form input[type="submit"]').click();
    });

    it('should list events', function() {
      console.log(browser().location().url());
      expect(
        repeater('#taskList li').count()
      ).toEqual(2);
    });

  });

});