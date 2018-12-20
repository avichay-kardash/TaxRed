namespace TaxRed.Models
{
	public class CalendarDay
	{
		public int WeekIndex { get; set; }
		public int DayOfWeek { get; set; }
		public int DayOfMonth { get; set; }
		public CalendarDayState State { get; set; } = CalendarDayState.Work;
	}
}
