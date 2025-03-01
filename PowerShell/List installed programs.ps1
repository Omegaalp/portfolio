$computerName = "██-███████"
$yourAccount = Get-Credential
Invoke-Command -ComputerName $computerName -Credential $yourAccount -ScriptBlock {
    Get-ItemProperty HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName
}