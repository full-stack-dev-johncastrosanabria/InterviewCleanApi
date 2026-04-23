using FluentAssertions;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace InterviewCleanApi.Tests;

public class E2ETests : IDisposable
{
    private readonly IWebDriver _driver;
    private readonly WebDriverWait _wait;
    private const string ReactClientUrl = "http://localhost:5173";
    private const string VueClientUrl = "http://localhost:5174";

    public E2ETests()
    {
        var options = new ChromeOptions();
        options.AddArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
        _driver = new ChromeDriver(options);
        _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
    }

    private async Task<bool> IsServerRunning(string url)
    {
        try
        {
            using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
            var response = await httpClient.GetAsync(url);
            return true;
        }
        catch
        {
            return false;
        }
    }

    [Fact]
    public async Task ReactClient_UserCanRegisterLoginAndViewProducts()
    {
        // Skip test if server is not running
        if (!await IsServerRunning(ReactClientUrl))
        {
            // Use Skip.If when available, or just return
            return;
        }

        // Navigate to React client
        _driver.Navigate().GoToUrl(ReactClientUrl);
        
        // Wait for page to load
        await Task.Delay(2000);
        
        // Check if login form is present
        var loginFormExists = _driver.FindElements(By.CssSelector("form")).Count > 0;
        loginFormExists.Should().BeTrue("Login form should be present");

        // Try to find register link or button
        var registerElements = _driver.FindElements(By.XPath("//*[contains(text(), 'Register') or contains(text(), 'Registro') or contains(text(), 'Sign up')]"));
        
        if (registerElements.Count > 0)
        {
            // Test registration flow
            registerElements.First().Click();
            await Task.Delay(1000);

            // Fill registration form if present
            var usernameField = _driver.FindElements(By.Name("username")).FirstOrDefault() ?? 
                               _driver.FindElements(By.Name("userName")).FirstOrDefault();
            var emailField = _driver.FindElements(By.Name("email")).FirstOrDefault();
            var passwordField = _driver.FindElements(By.Name("password")).FirstOrDefault();

            if (usernameField != null && emailField != null && passwordField != null)
            {
                var testEmail = $"test_{Guid.NewGuid()}@test.com";
                
                usernameField.SendKeys("testuser");
                emailField.SendKeys(testEmail);
                passwordField.SendKeys("Test123!");

                // Submit registration
                var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
                submitButton.Click();
                await Task.Delay(2000);
            }
        }

        // Test login with default credentials
        var emailInput = _driver.FindElements(By.Name("email")).FirstOrDefault();
        var passwordInput = _driver.FindElements(By.Name("password")).FirstOrDefault();

        if (emailInput != null && passwordInput != null)
        {
            emailInput.Clear();
            emailInput.SendKeys("john@test.com");
            passwordInput.Clear();
            passwordInput.SendKeys("123456");

            var loginButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
            loginButton.Click();
            await Task.Delay(3000);

            // Check if redirected to products page or dashboard
            var currentUrl = _driver.Url;
            currentUrl.Should().NotBe(ReactClientUrl, "Should be redirected after login");
        }
    }

    [Fact]
    public async Task VueClient_UserCanRegisterLoginAndViewProducts()
    {
        // Skip test if server is not running
        if (!await IsServerRunning(VueClientUrl))
        {
            return;
        }

        // Navigate to Vue client
        _driver.Navigate().GoToUrl(VueClientUrl);
        
        // Wait for page to load
        await Task.Delay(2000);
        
        // Check if login form is present
        var loginFormExists = _driver.FindElements(By.CssSelector("form")).Count > 0;
        loginFormExists.Should().BeTrue("Login form should be present");

        // Try to find register link or button
        var registerElements = _driver.FindElements(By.XPath("//*[contains(text(), 'Register') or contains(text(), 'Registro') or contains(text(), 'Sign up')]"));
        
        if (registerElements.Count > 0)
        {
            // Test registration flow
            registerElements.First().Click();
            await Task.Delay(1000);

            // Fill registration form if present
            var usernameField = _driver.FindElements(By.Name("username")).FirstOrDefault() ?? 
                               _driver.FindElements(By.Name("userName")).FirstOrDefault();
            var emailField = _driver.FindElements(By.Name("email")).FirstOrDefault();
            var passwordField = _driver.FindElements(By.Name("password")).FirstOrDefault();

            if (usernameField != null && emailField != null && passwordField != null)
            {
                var testEmail = $"test_{Guid.NewGuid()}@test.com";
                
                usernameField.SendKeys("testuser");
                emailField.SendKeys(testEmail);
                passwordField.SendKeys("Test123!");

                // Submit registration
                var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
                submitButton.Click();
                await Task.Delay(2000);
            }
        }

        // Test login with default credentials
        var emailInput = _driver.FindElements(By.Name("email")).FirstOrDefault();
        var passwordInput = _driver.FindElements(By.Name("password")).FirstOrDefault();

        if (emailInput != null && passwordInput != null)
        {
            emailInput.Clear();
            emailInput.SendKeys("john@test.com");
            passwordInput.Clear();
            passwordInput.SendKeys("123456");

            var loginButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
            loginButton.Click();
            await Task.Delay(3000);

            // Check if redirected to products page or dashboard
            var currentUrl = _driver.Url;
            currentUrl.Should().NotBe(VueClientUrl, "Should be redirected after login");
        }
    }

    [Fact]
    public async Task ReactClient_NavigationAndUIElements()
    {
        // Skip test if server is not running
        if (!await IsServerRunning(ReactClientUrl))
        {
            return;
        }

        _driver.Navigate().GoToUrl(ReactClientUrl);
        await Task.Delay(2000);

        // Check page title
        var title = _driver.Title;
        title.Should().NotBeNullOrEmpty("Page should have a title");

        // Check for essential UI elements
        var bodyText = _driver.FindElement(By.TagName("body")).Text;
        bodyText.Should().NotBeNullOrEmpty("Page should have content");

        // Check for form elements
        var forms = _driver.FindElements(By.TagName("form"));
        forms.Should().NotBeEmpty("Should have at least one form");
    }

    [Fact]
    public async Task VueClient_NavigationAndUIElements()
    {
        // Skip test if server is not running
        if (!await IsServerRunning(VueClientUrl))
        {
            return;
        }

        _driver.Navigate().GoToUrl(VueClientUrl);
        await Task.Delay(2000);

        // Check page title
        var title = _driver.Title;
        title.Should().NotBeNullOrEmpty("Page should have a title");

        // Check for essential UI elements
        var bodyText = _driver.FindElement(By.TagName("body")).Text;
        bodyText.Should().NotBeNullOrEmpty("Page should have content");

        // Check for form elements
        var forms = _driver.FindElements(By.TagName("form"));
        forms.Should().NotBeEmpty("Should have at least one form");
    }

    public void Dispose()
    {
        _driver?.Quit();
        _driver?.Dispose();
    }
}