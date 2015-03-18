using Nancy;
using Nancy.Conventions;
using Nancy.TinyIoc;

namespace Nwc.Web
{
	public class Bootstrapper : DefaultNancyBootstrapper
	{
		// The bootstrapper enables you to reconfigure the composition of the framework,
		// by overriding the various methods and properties.
		// For more information https://github.com/NancyFx/Nancy/wiki/Bootstrapper

		protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
		{
			base.ConfigureConventions(nancyConventions);

			// serve static content outside the default /Content folder (for Aurelia)
			nancyConventions.StaticContentsConventions.Add(
				StaticContentConventionBuilder.AddDirectory("jspm_packages", @"jspm_packages"));

			nancyConventions.StaticContentsConventions.Add(
				StaticContentConventionBuilder.AddDirectory("dist", @"dist"));

			nancyConventions.StaticContentsConventions.Add(
				StaticContentConventionBuilder.AddDirectory("Views", @"Views"));

			nancyConventions.StaticContentsConventions.Add(
				StaticContentConventionBuilder.AddFile("/config.js", @"config.js"));
		}

		protected override void ConfigureApplicationContainer(TinyIoCContainer container)
		{
			StaticConfiguration.DisableErrorTraces = false;
			base.ConfigureApplicationContainer(container);
		}
	}
}