﻿using System.Collections.Generic;

namespace TaxRed.Reports
{
	public class ReportBuilderArgs
	{
		public string Employee { get; set; }
		public string EmployeePosition { get; set; }
		public List<string> Tickets { get; set; }
		public int Year { get; set; }
		public int Month { get; set; }
	}
}
