function uncheckOthers(checkedId) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="vendor"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.id !== checkedId) {
            checkbox.checked = false;
        }
    });
}

/* function getVlan(slot, pon, olt) {
    const vlanTable = {
        "IGGR-SEDE-HUAWEI-OLT01": {
            1: [3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032],
            2: [3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3047, 3048],
            15: [3108, 3109, 3110, 3116, 3112, 3113, 3114, 3115],
            16: [3100, 3101, 3102, 3103, 3104, 3105, 3106, 3107]
        },
        "IGGR-SEDE-HUAWEI-OLT02": {
            0: [3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019],
            2: [3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019],
            3: [3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019],
            4: [3019, 3019, 3019, 3019, 3019, 3019, 3019, 3019],
            5: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
        },
        "AMA-IGUABINHA-HUAWEI-OLT02": {
            3: [3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032],
            5: [3081, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3093, 3094, 3095, 3096]
        },
        "AMA-IGUABINHA-HUAWEI-OLT03": {
            1: [3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032],
            2: [3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3047, 3048],
            13: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            14: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            15: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            16: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
        }
    };*/

     // Se o PON for 0, trate-o como 2
    /*if (pon === 0 && olt === "IGGR-SEDE-HUAWEI-OLT02") {
        pon = 2;
    }

    if (olt in vlanTable && slot in vlanTable[olt]) {
        if (pon >= 1 && pon <= vlanTable[olt][slot].length) {
            return vlanTable[olt][slot][pon - 1];
        } else {
            return "*PON não existe nesta OLT*";
        }
    }*/

document.getElementById('zte').addEventListener('change', function() {
    if (this.checked) {
        uncheckOthers(this.id);
    }
});


document.getElementById('vsol').addEventListener('change', function() {
    if (this.checked) {
        uncheckOthers(this.id);
    }
});

document.getElementById('epon').addEventListener('change', function() {
    if (this.checked) {
        uncheckOthers(this.id);
    }
});

document.getElementById('generateButton').addEventListener('click', function() {
    const pon = parseInt(document.getElementById('pon').value, 10);
    const slot = parseInt(document.getElementById('fs').value.split('/')[1], 10);
    const mac = document.getElementById('mac').value;
    const tag = document.getElementById('tag').value;
    const fs = document.getElementById('fs').value;
    const onuid = document.getElementById('onuid').value;
    // const olt = document.getElementById('onuid-select').value;
    const vlan = document.getElementById('vlan').value;

    const vendors = [];
    if (document.getElementById('zte').checked) vendors.push('ZTE');
    if (document.getElementById('vsol').checked) vendors.push('VSOL');
    if (document.getElementById('epon').checked) vendors.push('EPON');

    let script = '';

    if (vendors.includes('VSOL')) {
        const vlan = document.getElementById('vlan').value;
        if (vlan === null) {
            script += `*Erro: VLAN não lançada.*\n\n`;
        } else {
            script += `*****1ª PARTE - ativar*****\n\n`
            script += `enable\n\n`;
            script += `config\n\n\n\n`;
            script += `******2ª PARTE - vlan******\n\n`
            script += `display current-configuration section bbs | include ${fs}/${pon}\n\n\n\n`;
            script += `*****3ª PARTE - script*****\n\n`
            script += `display ont autofind all\n\n`;
            script += `interface gpon ${fs}\n\n`;
            script += `ont add ${pon} sn-auth ${mac} omci ont-lineprofile-name GPONT ont-srvprofile-name GPONT desc ${tag}\n\n`;
            script += `quit\n\n`;
            script += `service-port vlan ${vlan} gpon ${fs}/${pon} ont ${onuid} gemport 103 multi-service user-vlan untagged tag-transform default\n\n`;
            script += `***************************\n`
            
        }
    }

    if (vendors.includes('ZTE')) {
        const vlan = document.getElementById('vlan').value;
        if (vlan === null) {
            script += `*Erro: VLAN não lançada.*\n\n`;
        } else {
            script += `*****1ª PARTE - ativar*****\n\n`
            script += `enable\n\n`;
            script += `config\n\n\n\n`;
            script += `******2ª PARTE - vlan******\n\n`
            script += `display current-configuration section bbs | include ${fs}/${pon}\n\n\n\n`;
            script += `*****3ª PARTE - script*****\n\n`
            script += `display ont autofind all\n\n`;
            script += `interface gpon ${fs}\n\n`;
            script += `ont add ${pon} sn-auth ${mac} omci ont-lineprofile-id ${vlan} ont-srvprofile-id 5 desc ${tag}\n\n`;
            script += `quit\n\n`;
            script += `service-port vlan ${vlan} gpon ${fs}/${pon} ont ${onuid} gemport 44 multi-service user-vlan ${vlan} tag-transform transparent\n\n`;
            script += `***************************\n`
        }
    }

    if (vendors.includes('EPON')) {
        const vlan = document.getElementById('vlan').value;
        if (vlan === null) {
            script += `*Erro: VLAN não lançada.*\n\n`;
        } else {
            script += `*****1ª PARTE - ativar*****\n\n`
            script += `enable\n\n`;
            script += `config\n\n\n\n`;
            script += `******2ª PARTE - vlan******\n\n`
            script += `display current-configuration section bbs | include ${fs}/${pon}\n\n\n\n`;
            script += `*****3ª PARTE - script*****\n\n`
            script += `display ont autofind all\n\n`;
            script += `interface epon ${fs}\n\n`;
            script += `ont add ${pon} mac-auth ${mac} oam ont-lineprofile-name EPONT ont-srvprofile-name EPONT desc ${tag}\n\n`;
            script += `quit\n\n`;
            script += `service-port vlan ${vlan} epon ${fs}/${pon} ont ${onuid} multi-service user-vlan untagged tag-transform default\n\n`;
            script += `***************************\n`
        }
    }

    document.getElementById('scriptOutput').value = script;
});

document.getElementById('generateDesprovisionButton').addEventListener('click', function() {
    const pon = parseInt(document.getElementById('pon').value, 10);
    const fs = document.getElementById('fs').value;
    const onuid = document.getElementById('onuid').value;

    const vendors = [];
    if (document.getElementById('zte').checked) vendors.push('ZTE');
    if (document.getElementById('vsol').checked) vendors.push('VSOL');
    if (document.getElementById('epon').checked) vendors.push('EPON');

    let script = '';

    if (vendors.includes('VSOL') || vendors.includes('ZTE') || vendors.includes('EPON')) {
        script += `undo service-port port ${fs}/${pon} ont ${onuid}\n\n`;
        script += `interface gpon ${fs}\n\n`;
        script += `ont delete ${pon} ${onuid}\n\n`;
    }

    document.getElementById('desprovisionOutput').value = script;
});