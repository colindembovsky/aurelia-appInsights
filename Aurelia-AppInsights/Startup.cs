using Microsoft.Owin.Extensions;
using Nwc.Web;
using Owin;
using System.Configuration;

public class Startup
{
	public void Configuration(IAppBuilder app)
	{
		// set the AI key
		Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration.Active.InstrumentationKey =
				ConfigurationManager.AppSettings["AiInstrumentationKey"];

		app.UseNancy();
		app.UseStageMarker(PipelineStage.MapHandler);
	}
}