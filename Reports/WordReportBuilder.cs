using System;
using System.IO;
using Microsoft.Office.Interop.Word;

namespace TaxRed.Reports
{
	public class WordReportBuilder : IReportBuilder
	{
		private static string EMPLOYEE_TEMPLATE = "<ImieINazwisko>";
		private static string EMPLOYEE_POSITION_TEMPLATE = "<Stanowisko>";
		private static string REPORT_DATE_TEMPLATE = "<Miesiac/ROK>";
		private static string TICKETS_TEMPLATE = "<tickets>";

		public IReport Build(ReportBuilderArgs args)
		{
			string currentDirectory = Directory.GetCurrentDirectory();
			string filePath = Path.Combine(currentDirectory, "Resources", "ReportTemplate.docx");

			object newTemplateName = Path.Combine(currentDirectory, "Resources", Guid.NewGuid() + ".docx");

			Application app = new Application();
			Document docx = app.Documents.Open(filePath);
			try
			{

				string findName = EMPLOYEE_TEMPLATE;
				string replacedName = args.Employee;
				string findPeriod = REPORT_DATE_TEMPLATE;
				string replacedPeriod = $"{args.Month}.{args.Year}";
				string findPositon = EMPLOYEE_POSITION_TEMPLATE;
				string replacedPosition = args.EmployeePosition;

				Find findText = docx.Application.Selection.Find;
				findText.ClearFormatting();
				findText.Text = findName;
				findText.Replacement.ClearFormatting();
				findText.Replacement.Text = replacedName;

				object repleace = WdReplace.wdReplaceAll;

				findText.Execute(findName, false, true, false, false, false, true, 1, false, replacedName, 2,
					false, false, false, false);
				findText.Execute(findPeriod, false, true, false, false, false, true, 1, false, replacedPeriod, 2,
					false, false, false, false);
				findText.Execute(findPositon, false, true, false, false, false, true, 1, false, replacedPosition, 2,
					false, false, false, false);


				findText.Execute(TICKETS_TEMPLATE, false, true, false, false, false, true, 1, false, string.Join(Environment.NewLine, args.Tickets), 2,
					false, false, false, false);



				docx.Application.ActiveDocument.SaveAs(ref newTemplateName);

				return new Report
				{
					Path = newTemplateName.ToString(),
					TargetFilename = $"{args.Employee}_{args.Year}{args.Month}.docx"
				};
			}
			finally
			{
				docx.Close();
			}
		}
	}
}

