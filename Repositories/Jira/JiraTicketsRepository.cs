namespace TaxRed.Repositories.Jira
{
	using System.Collections.Generic;
	using System.Linq;
	using Atlassian.Jira;
	using Models;

	public class JiraTicketsRepository : ITicketsRepository
	{
		private readonly string _password;

		public JiraTicketsRepository(string password)
		{
			_password = password;
		}

		public IEnumerable<Ticket> GetTickets()
		{
			Jira jiraClient = Jira.CreateRestClient("https://jira.kcura.com", "avichay.kardash", _password);

			const string jql = "assignee was currentUser() AFTER startOfMonth(-1) BEFORE startOfMonth() AND (status != Closed  OR status changed to closed AFTER startOfMonth(-1) )";

			return jiraClient.Issues.GetIssuesFromJqlAsync(new IssueSearchOptions(jql)).Result.Select(a => new Ticket { Title = a.Summary, Description = a.Description });
		}
	}
}