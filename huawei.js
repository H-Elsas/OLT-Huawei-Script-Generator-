function uncheckOthers(checkedId) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="vendor"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.id !== checkedId) {
            checkbox.checked = false;
        }
    });
}

document.getElementById('gpon').addEventListener('change', function() {
    if (this.checked) uncheckOthers(this.id);
});

document.getElementById('epon').addEventListener('change', function() {
    if (this.checked) uncheckOthers(this.id);
});

document.getElementById('nova').addEventListener('change', function() {
    if (this.checked) uncheckOthers(this.id);
});

document.getElementById('generateButton').addEventListener('click', function() {
    const pon = document.getElementById('pon').value;
    const fs = document.getElementById('fs').value;
    const mac = document.getElementById('mac').value;
    const tag = document.getElementById('tag').value;
    const onuid = document.getElementById('onuid').value;
    const vlan = document.getElementById('vlan').value;
    const pppoe_user = document.getElementById('pppoe_user').value;
    const pppoe_senha = document.getElementById('pppoe_senha').value;

    let script = '';

    if (document.getElementById('gpon').checked) {
        script += `*****1ª PARTE - ativar*****\n\n`;
        script += `enable\n\nconfig\n\n`;
        script += `******2ª PARTE - vlan******\n\n`;
        script += `display current-configuration section bbs | include ${fs}/${pon}\n\n`;
        script += `*****3ª PARTE - script*****\n\n`;
        script += `display ont autofind all\n\n`;
        script += `display ont info 0 ${fs.split('/')[1]} ${pon} all\n\n`;
        script += `interface gpon ${fs}\n\n`;
        script += `ont add ${pon} ${onuid} sn-auth ${mac} omci ont-lineprofile-id 4000 ont-srvprofile-id 4000 desc ${tag}\n\n`;
        script += `ont port native-vlan ${pon} ${onuid} eth 1 vlan 4000 priority 0\n\n`;
        script += `quit\n\n`;
        script += `service-port vlan ${vlan} gpon ${fs}/${pon} ont ${onuid} gemport 5 multi-service user-vlan 4000 tag-transform translate\n\n`;
        script += `***************************\n`;
    } else if (document.getElementById('epon').checked) {
        script += `*****1ª PARTE - ativar*****\n\n`;
        script += `enable\n\nconfig\n\n`;
        script += `******2ª PARTE - vlan******\n\n`;
        script += `interface epon ${fs}\n\ndisplay current-configuration\n\nquit\n\ndisplay current-configuration section bbs | include ${fs}/${pon}\n\n`;
        script += `*****3ª PARTE - script*****\n\n`;
        script += `display ont autofind all\n\n`;
        script += `interface epon ${fs}\n\n`;
        script += `ont add ${pon} ${onuid} mac-auth ${mac} oam ont-lineprofile-id 2001 ont-srvprofile-id 2001 desc ${mac}\n\n`;
        script += `### OU ###\n`;
        script += `ont add ${pon} ${onuid} mac-auth ${mac} oam ont-lineprofile-id 701 ont-srvprofile-id 701 desc ${mac}\n\n`;
        script += `### OU ###\n`;
        script += `ont add ${pon} ${onuid} mac-auth ${mac} oam ont-lineprofile-name EPONT ont-srvprofile-name EPONT desc ${mac}\n\n`;
        script += `### CASO SEJA AX3000 ###\n`
        script += `quit\n\n`;
        script += `service-port vlan ${vlan} epon ${fs}/${pon} ont ${onuid} multi-service user-vlan ${vlan} tag-transform translate\n\n`;
        script += `### CASO NÃO SEJA ###\n`;
        script += `quit\n\n`;
        script += `service-port vlan ${vlan} epon ${fs}/${pon} ont ${onuid} multi-service user-vlan untagged tag-transform default\n\n`; 
        script += `***************************\n`;
    } else if (document.getElementById('nova').checked) {
        script += `*****1ª PARTE - ativar*****\n\n`;
        script += `enable\n\nconfig\n\n`;
        script += `******2ª PARTE - vlan******\n\n`;
        script += `display current-configuration section bbs | include ${fs}/${pon}\n\n`;
        script += `*****3ª PARTE - script*****\n\n`;
        script += `display ont autofind all\n\n`;
        script += `interface gpon ${fs}\n\n`;
        script += `ont add ${pon} ${onuid} sn-auth ${mac} omci ont-lineprofile-name BR-GPON-S${fs.split('/')[1]}P${pon} ont-srvprofile-name BR-GPON-S${fs.split('/')[1]}P${pon} desc ${pppoe_user}\n\n`;
        script += `ont port native-vlan ${pon} ${onuid} eth 1 vlan ${vlan} priority 0\n\n`;
        script += `quit\n\n`;
        script += `service-port vlan ${vlan} gpon ${fs}/${pon} ont ${onuid} gemport 500 multi-service user-vlan ${vlan} tag-transform transparent\n\n`;
        script += `interface gpon ${fs}\n\n`;
        script += `ont ipconfig ${pon} ${onuid} ip-index 0 pppoe user-account username ${pppoe_user} password ${pppoe_senha} vlan ${vlan}\n\n`;
        script += `ont wan-config ${pon} ${onuid} ip-index 0 profile-name "INT6-WAN-ROUTER"\n\n`;
        script += `ont internet-config ${pon} ${onuid} ip-index 0\n\n`;
        script += `ont port route ${pon} ${onuid} eth 1-5 enable\n\n`;
        script += `ont tr069-server-config ${pon} ${onuid} profile-name "INT6_URL_TR069"\n\n`;
        script += `quit\n\n`;
        script += `***************************\n`;
    }

    document.getElementById('scriptOutput').value = script;
});

document.getElementById('generateDesprovisionButton').addEventListener('click', function() {
    const pon = document.getElementById('pon').value;
    const fs = document.getElementById('fs').value;
    const onuid = document.getElementById('onuid').value;
    let script = '';
    
    if (document.getElementById('epon').checked) {
        script += `undo service-port port ${fs}/${pon} ont ${onuid}\n\n`;
        script += `interface epon ${fs}\n\n`;
        script += `ont delete ${pon} ${onuid}\n\n`;            
    } else {
        script += `undo service-port port ${fs}/${pon} ont ${onuid}\n\n`;
        script += `interface gpon ${fs}\n\n`;
        script += `ont delete ${pon} ${onuid}\n\n`;
    }


    document.getElementById('desprovisionOutput').value = script;
});