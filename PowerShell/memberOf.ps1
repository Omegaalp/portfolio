

(Get-ADUser -Filter "mailNickname -like '██████'" -Properties memberof | select -expand memberof | get-adgroup) | select Name,groupscope
#((New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(samAccountName=$($env:██████)))")).FindOne().GetDirectoryEntry().memberOf | get-adgroup)| select Name,groupscope
((New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(samAccountName=██████))")).FindOne().GetDirectoryEntry().memberOf | get-adgroup)| select Name,groupscope