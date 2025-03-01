Import-Module ActiveDirectory
#$ADUser = Get-ADUser -Filter 'physicalDeliveryOfficeName -eq "WFS-CA-AGOURA"' -Properties *

$Report = @()
$list = Import-Csv -Path "█:\█████████\█████████.CSV"
ForEach ($item in $list) {
    $name = $item.List
    $details = Get-ADUser -Filter 'mailNickname -eq $name' -Properties *
    $manager = $details.Manager
    $Report += New-Object System.Management.Automation.PSObject -Property @{
        "UserID" = $name #$details.mailNickname
        "Name" = $details.cn #$name
        "DisplayName" = $details.displayName
        "FirstName" = $details.givenName
        "MiddleName" = $details.middleName
        "LastName" = $details.sn
        "Description" = $details.description
        "PhoneNumber" = $details.telephoneNumber
        "Title" = $details.title
        "Department" = $details.department
        "Manager" = $manager
        "Email" = $details.mail
        "Location" = $details.l
        "Office" = $details.physicalDeliveryOfficeName
        "Active" = $details.Enabled
    }
    
}
$Report   | export-csv █:\█████\███████\███████\██████.CSV