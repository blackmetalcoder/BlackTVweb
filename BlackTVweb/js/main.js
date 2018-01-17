$(document).ready(function () {
   /* $('#btnLoggain').click(function () {
        hej();
    });
    $('#btnEdit').hide();*/
});
function Skicka() {
    //Check så att namn och epost är ifyllt
    var Foretag = document.getElementById('foretag').value;
    var Epost = document.getElementById('email').value;
    var Tel = document.getElementById('phone').value;
    var Kontaktperson = document.getElementById('kontaktperson').value;
    var Hemsida = document.getElementById('homepage').value;
    if (Epost == "" || Foretag == "") {
        alert('Namn & Epost & Tel måste finnas');
    }
    else {
        var till = 'black@blacktv.se';
        var fran = Epost;
        var s = 'Intresse från: ' + Foretag;
        var sHTML = 'Företag: ' + Foretag + '<br>' +
                    'Epost: ' + Epost + '<br>' +
                    'Tel: ' + Tel + '<br>' +
                    'Kontaktperson: ' + Kontaktperson + '<br>' +
                    'Hemsida: ' + Hemsida + '<br>';
        $.ajax({
            type: "POST",
            url: "ServiceBlack.asmx/SkickaEpost",
            data: "{to: '" + till + "' ,from: '" + fran + "' ,subject: '" + s + "' ,text: '" + sHTML + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                if (msg.d == "Mail skickat...") {
                    alert(msg.d);
                }
            },
            error: function (err) {
                alert(err.d);
            }
        });
    }
}
function hej() {
    var x = document.getElementById('txtUser').value;
    var xE = ekrypt(x);
    var y = document.getElementById('txtLosen').value;
    var yE = ekrypt(y);
    $.ajax({
        type: "POST",
        url: "http://blacktv.se/ServiceBlack.asmx/loggaIn",
        //url: "http://localhost:51118/ServiceBlack.asmx/loggaIn",
        data: "{user:'" + xE + "', password: '" + yE + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {   
            alert(msg.statusText);           
        }
    });
    function successFunction(data) {
        if (data.d > '0') {
            $('#txtForetag').val('');
            $('#txtLosen').val('');
            localStorage.foretag = data.d;
            localStorage.inloggad = 'Ja';
            swal({ title: "Inloggad!", type: "success", text: "Välkommen att gå vidare.", imageUrl: "images/tummenUpp.jpg", showCancelButton: true, confirmButtonColor: "#DD6B55", confirmButtonText: "Gå vidare", closeOnConfirm: false }, function () { window.location.href = "http://blacktv.se/tv.html" });;
        } else {
            swal({ title: "Fel!", type: "warning", text: "Nu blev det fel, försök igen.", imageUrl: "images/tummenUpp.jpg" });
        }
     }
}
function ekrypt(vad) {
    var key = CryptoJS.enc.Utf8.parse('7061737323313233');
    var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(vad), key,
        {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted;
}