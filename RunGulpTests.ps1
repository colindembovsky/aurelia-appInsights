Param(
  [string]$sourcesDir = $env:TF_BUILD_SOURCESDIRECTORY,
  [string]$binDir = $env:TF_BUILD_BINARIESDIRECTORY,
  [string]$testResultsDir = $env:TF_BUILD_TESTRESULTSDIRECTORY,
  [string]$dropLocation = $env:TF_BUILD_DROPLOCATION,
  [string]$tpcUri = $env:TF_BUILD_COLLECTIONURI,
  [string]$buildUri = $env:TF_BUILD_BUILDURI
)

$coverageFolder = "test\coverage";
$coverageSummary = "coverage-summary.txt"
$indexFile = "coverage\report-lcov\lcov-report\index.html"

Push-Location
cd "$sourcesDir\src\Nwc.Web"

# run the karma unit tests using gulp
$output = node_modules\.bin\gulp.cmd unit-test 2>&1

if ($LASTEXITCODE -eq 0) {
    try {
        $countLine = ""
        foreach($line in $output) {
            if ($line -match "Executed \d+ of \d+") {
                $countLine = $line
            }
            Write-Host $line
        }

        Write-Host "Copying coverage files"
        $coverageRoot = ".\$coverageFolder"

        $dropIsUnc = $true
        if ($dropLocation.StartsWith("#")) {
            Write-Host "Drop location is 'Copy to Server'. Putting coverage into binaries directory"
            $dropLocation = $binDir
            $dropIsUnc = $false
        }
        Write-Host "Copying coverate files to $dropLocation"

        copy $coverageRoot $dropLocation -Recurse

         # add the link into the build summary
        Write-Host "Loading TFS assemblies"
        [Reflection.Assembly]::LoadWithPartialName('Microsoft.TeamFoundation.Client')
        [Reflection.Assembly]::LoadWithPartialName('Microsoft.TeamFoundation.Build.Client')
     
        Write-Host "Getting build object"
        $tpc = [Microsoft.TeamFoundation.Client.TfsTeamProjectCollectionFactory]::GetTeamProjectCollection($tpcUri)
        $buildService = $tpc.GetService([Microsoft.TeamFoundation.Build.Client.IBuildServer])
        $build = $buildService.GetBuild($buildUri)
 
        $save = $false;
        $lcovIndex = "$dropLocation\$indexFile"
        
        if ($lcovIndex -ne $null) {
            Write-Host "Writing coverage link to build summary"
            if ($countLine -ne "") {
                $message = "Test run completed - " + $countLine
            } else {
                $message = "Test run completed - unable to detect how many tests were run"
            }
            [Microsoft.TeamFoundation.Build.Client.InformationNodeConverters]::AddCustomSummaryInformation($build.Information, $message, "ConfigurationSummary", "Javascript Coverage", 200)

            if ($dropIsUnc) {
                $message = "Javascript testing succeeded. Open [coverage results]($lcovIndex)."
            } else {
                $message = "Javascript testing succeeded. To see detailed coverage results, download the drop zip and open \coverage\$indexFile."
            }
            [Microsoft.TeamFoundation.Build.Client.InformationNodeConverters]::AddCustomSummaryInformation($build.Information, $message, "ConfigurationSummary", "Javascript Coverage", 200)
            $save = $true
        } else {
            Write-Host "Could not find lcov coverage index"
        }

        $summaryFile = ".\$coverageFolder\$coverageSummary"
        if (Test-Path($summaryFile)) {
            Write-Host "Writing build summary to build report"
            $summaryLines = gc $summaryFile | ? { -not ($_.StartsWith(" ") -or $_.StartsWith("=")) -and $_.length -gt 0 } 
            if ($summaryLines.Length -gt 0) {
                $save = $true
                [Microsoft.TeamFoundation.Build.Client.InformationNodeConverters]::AddCustomSummaryInformation($build.Information, "Coverage Summary:", "ConfigurationSummary", "Javascript Coverage", 200)
                $summaryLines | % {
                    [Microsoft.TeamFoundation.Build.Client.InformationNodeConverters]::AddCustomSummaryInformation($build.Information, $_, "ConfigurationSummary", "Javascript Coverage", 200)
                }    
            }
        } else {
            Write-Host "No coverage summary found"
        }

        if ($save) {
            $build.Information.Save();
        }
 
        # all is well with the world
        Write-Host "Success!"
        Pop-Location
        exit 0
    }
    catch {
        foreach($line in $_) {
            Write-Error $_
        }
        Pop-Location
        exit 0
    }
} else {
    Write-Host "Gulp unit test failure detected"
    Write-Host $output
    Pop-Location
    exit 1
}