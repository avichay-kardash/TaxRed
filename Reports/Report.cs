using System.IO;

namespace TaxRed.Reports
{
	public class Report : IReport
	{

		public string Path { get; set; }
		public string TargetFilename { get; set; }


		public void Dispose()
		{
			//if (File.Exists(Path))
			//{
			//	File.Delete(Path);
			//}
		}
	}
}
