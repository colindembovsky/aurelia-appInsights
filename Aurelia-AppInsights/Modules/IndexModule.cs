using Nancy;
using System;
using System.Text;
using System.Web.Configuration;

namespace Nwc.Web
{
	public class IndexModule : NancyModule
	{
		/// <summary>
		/// Provides settings for the index page - Aurelia bootstraps and takes over the UI from there
		/// </summary>
		public IndexModule()
		{
			Get["/"] = parameters =>
			{
				ViewBag["debug"] = false;
#if DEBUG
				ViewBag["debug"] = true;
#endif
				return View["index"];
			};
		}
	}
}