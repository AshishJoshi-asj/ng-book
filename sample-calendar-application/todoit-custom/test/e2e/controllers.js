describe('E2E controllers: ', function() {

  beforeEach(function() {
    browser().navigateTo('/#/');
  });

  it('should have the date in the browser', function() {
    var d = new Date();
    expect(
      element("#time h1").html()
    ).toMatch(d.getFullYear());
  });

  it('should have the user timezone in the header', function() {
    expect(
      element('header').html()
    ).toMatch('US/Pacific');
  });

});