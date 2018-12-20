namespace TaxRed
{
	using Microsoft.AspNetCore.Authentication.Cookies;
	using Microsoft.AspNetCore.Authentication.OpenIdConnect;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.SpaServices.Webpack;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.IdentityModel.Protocols.OpenIdConnect;
	using Microsoft.IdentityModel.Tokens;
	using Okta.Sdk;
	using Okta.Sdk.Configuration;
	using Repositories;
	using Repositories.Jira;

	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
				options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
			})
			.AddCookie()
			.AddOpenIdConnect(options =>
			{
				options.ClientId = Configuration["ClientId"];
				options.ClientSecret = Configuration["ClientSecret"];
				options.Authority = Configuration["Issuer"];
				options.CallbackPath = "/authorization-code/callback";
				options.ResponseType = OpenIdConnectResponseType.Code;
				options.SaveTokens = true;
				options.UseTokenLifetime = false;
				options.GetClaimsFromUserInfoEndpoint = true;
				options.Scope.Add("openid");
				options.Scope.Add("profile");
				options.TokenValidationParameters = new TokenValidationParameters
				{
					NameClaimType = "name"
				};
			});

			var oktaClient = new OktaClient(new OktaClientConfiguration
			{
				OktaDomain = Configuration["OktaDomain"],
				Token = Configuration["APIToken"]
			});

			services.AddSingleton<IOktaClient>
			(
				new OktaClient(new OktaClientConfiguration
				{
					OktaDomain = Configuration["OktaDomain"],
					Token = Configuration["APIToken"]
				})
			);

			services.AddSingleton<ITicketsRepository>(new JiraTicketsRepository(Configuration["JiraPassword"]));

			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1); ;
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true
				});
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
			}

			app.UseDefaultFiles();
			app.UseStaticFiles();
			app.UseAuthentication();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Index}/{id?}");

				routes.MapSpaFallbackRoute(
					name: "spa-fallback",
					defaults: new { controller = "Home", action = "Index" });
			});
		}
	}
}
