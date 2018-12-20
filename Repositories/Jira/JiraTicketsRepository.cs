namespace TaxRed.Repositories.Jira
{
	using System.Collections.Generic;
	using System.Linq;
	using Atlassian.Jira;
	using Models;
	using Okta.Sdk;

	public class JiraTicketsRepository : ITicketsRepository
	{
		private readonly string _password;

		public JiraTicketsRepository(string password)
		{
			_password = password;
		}

		public IEnumerable<Ticket> GetTicketsFor(string userName)
		{
			Jira jiraClient = Jira.CreateRestClient("https://jira.kcura.com", userName, _password);

			const string jql = "assignee was currentUser() AFTER startOfMonth(-1) BEFORE startOfMonth() AND (status != Closed  OR status changed to closed AFTER startOfMonth(-1) )";

			return jiraClient.Issues.GetIssuesFromJqlAsync(new IssueSearchOptions(jql)).Result.Select(a => new Ticket
			{
				Title = a.Key.Value + " " + a.Summary,
				Link = $"https://jira.kcura.com/browse/{a.Key}" 
			});
		}
	}
}