namespace TaxRed.Reports
{
	public interface IReportBuilder
	{
		IReport Build(ReportBuilderArgs args);
	}
}
