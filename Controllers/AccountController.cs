namespace TaxRed.Controllers
{
	using Microsoft.AspNetCore.Authentication.OpenIdConnect;
	using Microsoft.AspNetCore.Mvc;

	public class AccountController : Controller
	{
		public IActionResult Login()
		{
			if (!HttpContext.User.Identity.IsAuthenticated)
			{
				return Challenge(OpenIdConnectDefaults.AuthenticationScheme);
			}

			return RedirectToAction("Index", "Home");
		}
	}
}