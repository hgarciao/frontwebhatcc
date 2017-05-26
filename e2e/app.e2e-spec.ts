import { HatccFrontPage } from './app.po';

describe('hatcc-front App', () => {
  let page: HatccFrontPage;

  beforeEach(() => {
    page = new HatccFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
