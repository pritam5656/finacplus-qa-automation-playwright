const { test, expect } = require('../../src/fixtures/ui.fixture');
const { books } = require('../../src/data/books');
const { writeBookDetails } = require('../../src/utils/fileHelper');
const { captureUiStep } = require('../../src/utils/screenshotHelper');

test.describe('DemoQA Book Store — login, search, logout', () => {
  test('user can login, search a book, save details, and logout', async ({
    page,
    credentials,
    homePage,
    loginPage,
    profilePage,
    bookStorePage,
  }) => {
    const targetBook = books.learningJavaScriptDesignPatterns;

    await test.step('Open DemoQA and navigate to Book Store Application', async () => {
      await homePage.open();
      await captureUiStep(page, '01-home-page');
      await homePage.goToBookStoreApplication();
      await captureUiStep(page, '02-book-store-application');
    });

    await test.step('Login with configured credentials', async () => {
      await loginPage.openFromSidebar();
      await captureUiStep(page, '03-login-form');
      await loginPage.login(credentials.username, credentials.password);
      await profilePage.expectLoggedInAs(credentials.username);
      await captureUiStep(page, '04-profile-logged-in');
    });

    await test.step('Search for Learning JavaScript Design Patterns', async () => {
      await profilePage.goToBookStore();
      await captureUiStep(page, '05-book-store-before-search');
      await bookStorePage.search(targetBook.searchTerm);
      await bookStorePage.expectBookInResults(targetBook.expectedTitle);
      await captureUiStep(page, '06-search-results');
    });

    await test.step('Persist title, author, and publisher to file', async () => {
      const details = await bookStorePage.getBookDetails(targetBook.expectedTitle);
      expect(
        details.title,
        `Saved title should include "${targetBook.expectedTitle}"`,
      ).toContain(targetBook.expectedTitle);
      expect(details.author, 'Author should be present').toBeTruthy();
      expect(details.publisher, 'Publisher should be present').toBeTruthy();

      const filePath = writeBookDetails(details);
      expect(filePath, 'Book details file path should be returned').toBeTruthy();
      await captureUiStep(page, '07-book-details-captured');
    });

    await test.step('Logout and land on login form', async () => {
      await profilePage.logout();
      await loginPage.expectLoginFormVisible();
      await expect(page, 'URL should contain /login after logout').toHaveURL(/login/i);
      await captureUiStep(page, '08-logged-out-login-form');
    });
  });
});
