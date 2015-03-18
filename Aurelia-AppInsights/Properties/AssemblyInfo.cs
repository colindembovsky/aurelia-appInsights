using System.Reflection;
using System.Runtime.InteropServices;

[assembly: AssemblyDescription("Dummy site for Aurelia-AppInsights plugin")]
[assembly: AssemblyProduct("Aurelia-AppInsights")]
[assembly: AssemblyCopyright("Copyright © Colin Dembovsky 2015")]
[assembly: AssemblyCulture("")]
[assembly: AssemblyTitle("Aurelia-AppInsights")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

#if DEBUG
[assembly: AssemblyConfiguration("Debug")]
#else
[assembly: AssemblyConfiguration("Release")] 
#endif

[assembly: ComVisible(false)]