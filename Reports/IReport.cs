using System;

namespace TaxRed.Reports
{
	public interface IReport : IDisposable
	{
		string Path { get; }
		string TargetFilename { get; }
	}
}
