Import-Module ActiveDirectory
$ADComputer = Get-ADComputer -Filter 'Name -like "██-*"' -Properties Name # | FT Name -Wrap -AutoSize

$Report = @()
$ADComputer | ForEach-Object {
	$servername = $_.Name
    <#
    $OS = "N/A"
    $OU = "N/A"
    $macAddy = "N/A"
    $macCard.MACAddress = "N/A"
    $PhysicalRAM = "N/A"
    $serialnum.SerialNumber = "N/A"
    $userid = "N/A"
    $VLAN = "N/A"
    $OSName = "N/A"
    $OSBuild.BuildNumber = "N/A"
    #>
    if (![boolean]$servername) {Continue}
	$TestConnection = Test-Connection -ComputerName $servername -Count 1 -Quiet -ErrorAction SilentlyContinue
	if ([boolean]$TestConnection)
	{
		$computerName = Get-WmiObject win32_computersystem -ComputerName $servername -ErrorAction SilentlyContinue
        $mac = Get-WmiObject win32_networkadapterconfiguration -ComputerName $servername
        $macCard = $mac | where Description -eq "Realtek PCIe GBE Family Controller"
        $macAddy = $macCard.MACAddress
        $ipAddress = $macCard.IPAddress[0]
		$OS = Get-WmiObject win32_operatingsystem -ComputerName $servername -ErrorAction SilentlyContinue
        $OSBuild = Get-WmiObject -class Win32_OperatingSystem -ComputerName $servername -Property BuildNumber -ErrorAction SilentlyContinue
		$Bios = Get-WmiObject win32_bios -ComputerName $servername -ErrorAction SilentlyContinue
        $user = Get-WMIObject -computerName $servername -class Win32_ComputerSystem | select username
        $userid = $user.username
		$PhysicalRAM = (Get-WMIObject -class Win32_PhysicalMemory -ComputerName $servername -ErrorAction SilentlyContinue | Measure-Object -Property capacity -Sum | % { [Math]::Round(($_.sum / 1GB), 2) })
		$CPU = Get-WmiObject Win32_ComputerSystem -ComputerName $servername -ErrorAction SilentlyContinue | Select NumberOfLogicalProcessors, NumberOfProcessors, systemname, name
		$Proccesor = Get-WmiObject –class Win32_processor -ComputerName $servername -ErrorAction SilentlyContinue
		$Disk = Get-WmiObject Win32_logicaldisk -ComputerName $servername -ErrorAction SilentlyContinue | select @{Name="Drive Size(GB)";Expression={[decimal]("{0:N0}" -f($_.size/1gb))}},@{Name="Drive Free Space(GB)";Expression={[decimal]("{0:N0}" -f($_.freespace/1gb))}},	@{Name="Drive Free pct";Expression={"{0,6:P0}" -f(($_.freespace/1gb) / ($_.size/1gb))}}
        $OU = Get-ADComputer -Filter 'Name -like $servername' -Properties distinguishedName -ErrorAction SilentlyContinue
		if ($OU.DistinguishedName.Contains("Non-PCI") -and $OU.DistinguishedName.Contains("OU=AH"))
        {
            $VLAN = "Non-PCI"
        }
        elseif ($OU.DistinguishedName.Contains("TV Display"))
        {
            $VLAN = "TV Display"
        }
        elseif ($OU.DistinguishedName.Contains("PCI") -and $OU.DistinguishedName.Contains("OU=AH"))
        {
            $VLAN = "PCI"
        }
        else
        {
            $VLAN = "Unknown"
        }
        $Time = Get-Date -Format "MM/dd/yyyy HH:mm"
        $Report += New-Object System.Management.Automation.PSObject -Property @{
			'Host Name'       = $servername
            'Model'           = $computerName.Model
            'Serial #'        = $Bios.SerialNumber
            'MAC'             = $macAddy
            'IP Address'      = $ipAddress
            'VLAN'            = $VLAN
			'Total RAM (GB)'  = $PhysicalRAM
            'OS Version'	  = $OS.Caption
            'OS Build #'      = $OSBuild.BuildNumber
            'User'            = $userid
            'Last Contact'    = $Time
			'Manufacturer'    = $computerName.Manufacturer
            'CPU - NumberOfLogicalProcessors' = $CPU.NumberOfLogicalProcessors
            'CPU - NumberOfProcessors'        = $CPU.NumberOfProcessors
        }
	}

	else
     

	{
		$OU = Get-ADComputer -Filter 'Name -like $servername' -Properties distinguishedName -ErrorAction SilentlyContinue
		if ($OU.DistinguishedName.Contains("Non-PCI") -and $OU.DistinguishedName.Contains("OU=AH"))
        {
            $VLAN = "Non-PCI"
        }
        elseif ($OU.DistinguishedName.Contains("TV Display"))
        {
            $VLAN = "TV Display"
        }
        elseif ($OU.DistinguishedName.Contains("PCI") -and $OU.DistinguishedName.Contains("OU=AH"))
        {
            $VLAN = "PCI"
        }
        else
        {
            $VLAN = "Unknown"
        }
        $Report += New-Object System.Management.Automation.PSObject -Property @{
            'Host Name'       = $servername
            'Model'           = ""
            'Serial #'        = ""
            'MAC'             = ""
            'IP Address'      = ""
            'VLAN'            = $VLAN
			'Total RAM (GB)'  = ""
            'OS Version'	  = ""
            'OS Build #'      = ""
            'User'            = ""
            'Last Contact'    = ""
			'Manufacturer'    = ""
            'CPU - NumberOfLogicalProcessors' = ""
            'CPU - NumberOfProcessors'        = ""
        }

	}
    $Report  | export-csv C:\Agoura\Inventory\Sweep.CSV -NoTypeInformation
}