﻿using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TaxRed.Models;
using TaxRed.Reports;

namespace TaxRed.API
{
	[Route("api/[controller]")]
	[ApiController]
	public class CalendarController : ControllerBase
	{
		// api/calendar
		public ActionResult Get(int year, int month)
		{
			DateTime date = new DateTime(year, month, 1);

			var days = new List<CalendarDay>();

			DateTime currentDate = date;
			int weekIndex = 0;

			while (currentDate.Month == date.Month)
			{
				if (IsWorkDay(currentDate.DayOfWeek))
				{
					days.Add(new CalendarDay
					{
						DayOfWeek = (int)currentDate.DayOfWeek,
						DayOfMonth = currentDate.Day,
						WeekIndex = weekIndex
					});
				}

				currentDate = currentDate.AddDays(1);

				if (currentDate.DayOfWeek == DayOfWeek.Monday && days.Count > 0)
				{
					weekIndex++;
				}
			}

	
			return Ok(new Calendar
			{
				Days = days
			});
		}

		private static bool IsWorkDay(DayOfWeek dayOfWeek)
		{
			return dayOfWeek != DayOfWeek.Saturday && dayOfWeek != DayOfWeek.Sunday;
		}

	}
}