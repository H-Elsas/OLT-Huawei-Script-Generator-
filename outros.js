function generateCommand(buttonId) {
    const slot = parseInt(document.getElementById('fs').value.split('/')[1], 10);
    const pon = document.getElementById('pon').value;
    const mac = document.getElementById('mac').value;
    const fs = document.getElementById('fs').value;
    const onuid = document.getElementById('onuid').value;

    let script = '';

    switch (buttonId) {
        case 'b1':
            script = `*É necessário estar na interface do slot*\n\n`;
            script += `display ont optical-info ${pon} ${onuid}`;
            break;
        case 'b2':
            script = `*É necessário estar na interface do slot*\n\n`;
            script += `display ont register-info ${pon} ${onuid}`;
            break;
        case 'b3':
            script = `display ont info 0 ${slot} ${pon} all`;
            break;
        case 'b4':
            script = `*GPON*\n`;
            script += `display ont info by-sn ${mac}\n\n`;
            script += `*EPON*\n`;
            script += `display ont info by-mac ${mac}`;
            break;
        case 'b5':
            script = `enable\n\n`;
            script += `diagnose\n\n`;
            script += `ont wan-access http 0/${slot}/${pon} ${onuid} enable\n\n`;
            script += `quit\n\n`;
            script += `*APÓS ACESSO REMOTO*\n\n`;
            script += `Login: Epadmin\n`;
            script += `Senha: adminEp\n`;
            break;
        default:
            script = 'Comando desconhecido.';
    }

    document.getElementById('scriptOutput').value = script;
}

document.getElementById('b1').addEventListener('click', function() {
    generateCommand('b1');
});

document.getElementById('b2').addEventListener('click', function() {
    generateCommand('b2');
});

document.getElementById('b3').addEventListener('click', function() {
    generateCommand('b3');
});

document.getElementById('b4').addEventListener('click', function() {
    generateCommand('b4');
});

document.getElementById('b5').addEventListener('click', function() {
    generateCommand('b5');
});