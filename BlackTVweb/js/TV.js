var GruppArray = {};
var ny = false;
var nyGrupp = false;
var datarow;
var datarecord;

function checkinlogg() {
    if (localStorage.inloggad == 'Ja') {
        //alert('Inloggad');
    } else {
        swal("Logga in eller skapa ett konto så kommer du sidan !!", "warning");
        window.location.href("index.html");
    }
}
function gruppArray(id, grupp) {
    this.id = id;
    this.grupp = grupp;
}
function G(id, grupp) {
    GruppArray[grupp] = new gruppArray(id, grupp);
}
function dagensDatum() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    $('#cboDate').val(today);
}
$(document).ready(function () {
    checkinlogg();
    
    $('#btnRadera').click(function () {
        Radera();
    });
    $('[data-toggle="tooltip"]').tooltip();
    var ftgid = localStorage.foretag;
    var url = 'ServiceBlack.asmx/getShowBlackTvWEB?ftgid=' + ftgid;
    //var url = 'ServiceBlack.asmx/getShowBlackTvWEB?ftgid=' + ftgid;
    var sourcekunddata = {
        type: "GET",
        datatype: "json",
        datafields: [
           { name: 'id', type: 'number' },
            { name: 'ForetagsID', type: 'number' },
            { name: 'Foretag', type: 'string' },
            { name: 'grupp', type: 'int' },
            { name: 'tag', type: 'string' },
            { name: 'Gruppnamn', type: 'string' },
            { name: 'info', type: 'string' },
            { name: 'Video', type: 'int' },
            { name: 'Datum', type: 'string' }
        ],
        url: url,
        cache: false,
        root: 'data'
    };
    //Förbered data för användning
    var dataAdapterTV = new $.jqx.dataAdapter(sourcekunddata, {
        contentType: 'application/json; charset=utf-8',
        downloadComplete: function (data, textStatus, jqXHR) {
            return data.d;
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                  'textStatus: ' + textStatus + '\n' +
                  'errorThrown: ' + errorThrown);
            alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
        }
    }
    );
    //Nu förbereder vi datagriden och visar den
    $("#BlackTVrader").jqxGrid(
   {
       source: dataAdapterTV,
       width: 700,
       height: 450,
       showstatusbar: false,
       statusbarheight: 50,
       showaggregates: false,
       theme: 'metrodark',
       groupable: true,
       selectionmode: 'singlerow',
       columns: [
         { text: 'ID', datafield: 'id', width: 75, cellsalign: 'left', },
         { text: 'Företag', datafield: 'Foretag', width: 100, cellsalign: 'left' },
         { text: 'Grupp', datafield: 'Gruppnamn', width: 130, cellsalign: 'left' },
         { text: 'Tag', datafield: 'tag', width:250, cellsalign: 'left'},
         { text: 'Slut datum', datafield: 'Datum', width: 100, cellsalign: 'left', cellsformat: 'D'}
       ],
       groups: ['Gruppnamn']
      
   });
    $("#BlackTVrader").bind('rowselect', function (event) {
        ny = false;
        $('#txtID').show();
        $('#txtFtgid').show();
        $('#lblForetagsID').show();
        $('#lblID').show();
        var row = event.args.rowindex;
        datarow = $("#BlackTVrader").jqxGrid('getrowdata', row);
        $("#txtID").val(datarow.id);
        $('#txtFtgid').val(datarow.ForetagsID);
        $('#txtTag').val(datarow.tag);
        if (datarow.Video === 1) {
            $('#txtVideo').prop('checked', true);
        } else {
             $('#txtVideo').prop('checked', false);
        }
        //$(".myCheckBox").checked(true);
        $('#txtDatum').val(datarow.Datum);
        //Nu kommer HTML edit
        /*('#summernote').summernote({
           height: 400,
            disableDragAndDrop: true,
            lang: 'sv-SE',
            toolbar: [
                ['Bakgrund', ['Grey', 'Black', 'Yellow']],
                ['img', ['picture']],
                ['style', ['style', 'template', 'clear']],
                ['fontstyle', ['bold', 'italic', 'ul', 'ol', 'link', 'paragraph']],
                ['fontsize', ['fontsize']],
                ['fontname', ['fontname']],
                ['fontstyleextra', ['strikethrough', 'underline', 'hr', 'color', 'superscript', 'subscript']],
                ['extra', ['video', 'table', 'height']],
                ['misc', ['undo', 'redo', 'codeview', 'help']]
            ],
            buttons: {
                Grey: GreyButton,
                Black: BlackButton,
                Yellow: YellowButton
            },
            template: {
                path: 'tpls',
                list: [
                 'label-success',
              'label-primary',
              'label-info',
              'label-warning',
              'label-danger',
              'jumbotron',
              '-',
              'alert-success',
              'alert-info',
              'alert-warning',
              'alert-danger',
              '-',
              'panel-primary',
              'panel-success',
              'panel-info',
              'panel-warning',
              'panel-danger',
              '-',
              'list-group',
              'table-stript'
                ]
            }
           
        });*/
        $('#summernote').summernote({
            height: 450,
            disableDragAndDrop: true,
            lang: 'sv-SE',
            toolbar: [
                ['Bakgrund', ['Grey', 'Black', 'Yellow']],
                ['img', ['picture']],
                ['style', ['style', 'template', 'clear']],
                ['fontstyle', ['bold', 'italic', 'ul', 'ol', 'link', 'paragraph']],
                ['fontsize', ['fontsize']],
                ['fontname', ['fontname']],
                ['fontstyleextra', ['strikethrough', 'underline', 'hr', 'color', 'superscript', 'subscript']],
                ['extra', ['video', 'table', 'height']],
                ['misc', ['undo', 'redo', 'codeview', 'help']]
            ],
            buttons: {
                Grey: GreyButton,
                Black: BlackButton,
                Yellow: YellowButton
            },
            template: {
                path: 'tpls',
                list: [
                  'label-success',
                  'label-primary',
                  'label-info',
                  'label-warning',
                  'label-danger',
                  'jumbotron',
                  '-',
                  'alert-success',
                  'alert-info',
                  'alert-warning',
                  'alert-danger',
                  '-',
                  'panel-primary',
                  'panel-success',
                  'panel-info',
                  'panel-warning',
                  'panel-danger',
                  'list-group',
                  'table-stript'
                ]
            }
        });
        $('#summernote').summernote('code', datarow.info);
        //Nu fyller vi på dropdownlistan från databas
        //var urlLista = 'http://localhost:51118/ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
        var urlLista = 'http://blacktv.se/ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
        var sourceGruppdata = {
            type: "GET",
            datatype: "json",
            datafields: [
               { name: 'id', type: 'number' },
               { name: 'Grupp', type: 'string' }
            ],
            url: urlLista,
            cache: false,
            root: 'data'
        };
        //Förbered data för användning
        var dataAdapterGrupp = new $.jqx.dataAdapter(sourceGruppdata, {
            contentType: 'application/json; charset=utf-8',
            downloadComplete: function (data, textStatus, jqXHR) {
                $.each(data.d, function (i, item) {
                    G(data.d[i].id, data.d[i].Grupp);
                    if (data.d[i].Grupp === datarow.Gruppnamn) {
                        //alert(i);
                        $("#DivDroppdown").jqxDropDownList({ selectedIndex: i });
                    }
                });
                return data.d;
            },
            loadError: function (jqXHR, textStatus, errorThrown) {
                alert('HTTP status code: ' + jqXHR.status + '\n' +
                      'textStatus: ' + textStatus + '\n' +
                      'errorThrown: ' + errorThrown);
                alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
            }
        }
        );
        // Skapa jqxDropDownList
        $("#DivDroppdown").jqxDropDownList({
            source: dataAdapterGrupp, displayMember: "Grupp", valueMember: "id", width: 200, height: 25
        });
        $("#myModalEditTV").modal("show");
    });
    $('#BlackTVrader').jqxGrid('hidecolumn', 'info');
   
});
function Spara() {
    var markupStr = $('#summernote').summernote('code');
    var id = $('#txtID').val();
    var tag = $('#txtTag').val();
    var ftgID = $('#txtFtgid').val();
    var item = $("#DivDroppdown").jqxDropDownList('getSelectedItem');
    var iValue = $('#DivDroppdown').jqxDropDownList('getItemByValue', item);
    var datum = $('#txtDatum').val();
    //alert($('#txtDatum').val());
    /*Kollar om det är en video*/
    var video = 0
    if ($('#txtVideo').is(":checked")) {
        video = 1;
    }
    if (ny === false) {
        
        $.ajax({
            type: "POST",
            url: "http://blacktv.se/ServiceBlack.asmx/UpdateBlackTV",
            data: "{id:" + id + ", ForetagsID: " + ftgID + ", info: '" + markupStr + "', grupp: " + iValue.value + ", tag: '" + tag + "', video:" + video  + ", Datum:'" + datum + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: function (msg) {
                swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });
                
            }
        });
        function successFunction(data) {
            swal("Sparat!", data.d, "success");
            UpdateGrid();
        }
    } else {
        var markupStr = $('#summernote').summernote('code');
        var tag = $('#txtTag').val();
        var ftgID = parseInt(localStorage.foretag);
        var item = $("#DivDroppdown").jqxDropDownList('getSelectedItem');
        var iValue = $('#DivDroppdown').jqxDropDownList('getItemByValue', item);
        var video = 0
        if ($('#txtVideo').is(":checked")) {
            video = 1;
        }
        $.ajax({
            type: "POST",
            url: "http://blacktv.se/ServiceBlack.asmx/nyBlackTV",
            data: "{ForetagsID: " + ftgID + ", info: '" + markupStr + "', grupp: " + iValue.value + ", tag: '" + tag + "', video:" + video + ", Datum:'" + datum + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: function (msg) {
                swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });
            }
        });
        function successFunction(data) {
            swal("Sparat!", data.d, "success");
            ny = false;
            UpdateGrid();
        }
    }

    
}
function Radera() {
    swal({
        title: "Är du säker?",
        text: "Du kommer radera post permanent!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ja, radera!",
        closeOnConfirm: false
    },
function () {
    var id = $('#txtID').val();
    $.ajax({
        type: "POST",
        //url: "http://localhost:51118/ServiceBlack.asmx/RaderaBlackTV",
        url: "ServiceBlack.asmx/RaderaBlackTV",
        data: "{'id':" + id + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {
            alert(msg.statusText);
        }
    });
    function successFunction(data) {
        swal("Raderad!", "Inlägg bortaget från BLACKTV.", "success");
        UpdateGrid();
    }
});
    
}
function Ny() {
    $('#txtID').hide();
     $('#txtTag').val('');
     $('#txtFtgid').hide();
     $('#lblForetagsID').hide();
    $('#lblID').hide();
   
    $('#summernote').summernote({
        height: 450,
        disableDragAndDrop: true,
        lang: 'sv-SE',
        toolbar: [
            ['Bakgrund', ['Grey', 'Black', 'Yellow']],
            ['img', ['picture']],
            ['style', ['style', 'template', 'clear']],
            ['fontstyle', ['bold', 'italic', 'ul', 'ol', 'link', 'paragraph']],
            ['fontsize', ['fontsize']],
            ['fontname', ['fontname']],
            ['fontstyleextra', ['strikethrough', 'underline', 'hr', 'color', 'superscript', 'subscript']],
            ['extra', ['video', 'table', 'height']],
            ['misc', ['undo', 'redo', 'codeview', 'help']]
        ],
        buttons: {
            Grey: GreyButton,
            Black: BlackButton,
            Yellow: YellowButton
        },
        template: {
            path: 'tpls',
            list: [
              'label-success',
              'label-primary',
              'label-info',
              'label-warning',
              'label-danger',
              'jumbotron',
              '-',
              'alert-success',
              'alert-info',
              'alert-warning',
              'alert-danger',
              '-',
              'panel-primary',
              'panel-success',
              'panel-info',
              'panel-warning',
              'panel-danger',
              'list-group',
              'table-stript'
            ]
        }
    });
    $('#summernote').summernote('code', '');
    ny = true;
    //Nu fyller vi på deopdownlistan från databas
    var urlLista = 'ServiceBlack.asmx/getGrupper?foretagsid=' + localStorage.foretag;
    var sourceGruppdata = {
        type: "GET",
        datatype: "json",
        datafields: [
           { name: 'id', type: 'number' },
           { name: 'Grupp', type: 'string' }
        ],
        url: urlLista,
        cache: false,
        root: 'data'
    };
    //Förbered data för användning
    var dataAdapterGrupp = new $.jqx.dataAdapter(sourceGruppdata, {
        contentType: 'application/json; charset=utf-8',
        downloadComplete: function (data, textStatus, jqXHR) {
            
            return data.d;
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                  'textStatus: ' + textStatus + '\n' +
                  'errorThrown: ' + errorThrown);
            alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
        }
    }
    );
    // Skapa en jqxDropDownList
    $("#DivDroppdown").jqxDropDownList({
        source: dataAdapterGrupp, displayMember: "Grupp", valueMember: "id", width: 200, height: 25, placeHolder: "Välj grupp:"
    });
    $("#myModalEditTV").modal("show");
}
function VisaGrupper() {
    var ftgid = localStorage.foretag;
    //var urlLista = 'http://localhost:51118/ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
    var urlLista = 'ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
    var sourceGruppdata = {
        type: "GET",
        datatype: "json",
        datafields: [
           { name: 'id', type: 'number' },
           { name: 'Grupp', type: 'string' },
           { name: 'ForetagsID', type: 'number' },
           { name: 'Info', type: 'string' }
        ],
        url: urlLista,
        cache: false,
        root: 'data'
    };
    //Förbered data för användning
    var dataAdapterGrupp = new $.jqx.dataAdapter(sourceGruppdata, {
        contentType: 'application/json; charset=utf-8',
        downloadComplete: function (data, textStatus, jqXHR) {
            return data.d;
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                  'textStatus: ' + textStatus + '\n' +
                  'errorThrown: ' + errorThrown);
            alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
        }
    }
    );
    $('#lstGrupper').on('select', function (event) {
        updatePanel(event.args.index);
    });
    $("#lstGrupper").jqxListBox({
        source: dataAdapterGrupp, displayMember: "Grupp", valueMember: "id", width: 150, height: 250
    });
    var updatePanel = function (index) {
        
        datarecord = dataAdapterGrupp.records[index];
        $('#txtGrupp').val(datarecord.Grupp);
        $('#txtInfo').val(datarecord.Info);
    }
    nyGrupp = false;
    $('#btnRaderaGrupp').show();
    $('#lstGrupper').show();
    $("#myModalEditGrupper").modal("show");
}
function Nygrupp() {
    $('#txtGrupp').val('');
    $('#txtInfo').val('');
    $('#btnRaderaGrupp').hide();
    $('#lstGrupper').hide();
    nyGrupp = true;
    $("#myModalEditGrupper").modal("show");
}
function sparaGrupp() {
    var grupp = $('#txtGrupp').val();
    var info = $('#txtInfo').val();
    var ftgID = localStorage.foretag;
    if (nyGrupp === true) {
        $.ajax({
            type: "POST",
            //url: "http://localhost:51118/ServiceBlack.asmx/NyGrupp",
            url: "ServiceBlack.asmx/NyGrupp",
            data: "{ForetagsID: " + ftgID + ", info: '" + info + "', Grupp: '" + grupp + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: function (msg) {
                swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });
                //alert(msg.statusText);
            }
        }); 
        function successFunction(data) {
            swal("Sparat!", "Ny grupp tillagd!", "success");
        }
    } else {
        $.ajax({
            type: "POST",
            //url: "http://localhost:51118/ServiceBlack.asmx/EditGrupp",
            url: "ServiceBlack.asmx/EditGrupp",
            data: "{id:" + datarecord.id + ",ForetagsID:" + ftgID + ", info:'" + info + "', Grupp:'" + grupp + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: function (msg) {
                swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });
            }
        });
        function successFunction(data) {
            VisaGrupper();
            swal("Sparat!", "Grupp uppdaterad!", "success");
        }
    }
}
function Konto() {
    var id = localStorage.foretag;
    $.ajax({
        type: "POST",
        //url: "http://localhost:51118/ServiceBlack.asmx/getKontakt",
        url: "ServiceBlack.asmx/getKontakt",
        data: "{id:" + id + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {
            swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Ok" });
        }
    });

    function successFunction(data) {
        $.each(data.d, function(index, item) {
            $('#txtForetag').val(item.Foretag);
            $('#txtAdress').val(item.Adress);
            $('#txtEpost').val(item.epost);
            $('#txtKontaktperson').val(item.kontaktperson);
            $('#txtLosen').val(item.losenord);
            $('#txtOrt').val(item.ort);
            $('#txtPostnr').val(item.postnr);
            $('#txtTel').val(item.tel);
        });
    }

    $("#modalKonto").modal("show");
}
function uppdateraKonto() {
    var id = localStorage.foretag;
    var foretag = $('#txtForetag').val();
    var adress = $('#txtAdress').val();
    var epost = $('#txtEpost').val();
    var kontaktperson = $('#txtKontaktperson').val();
    var losen = $('#txtLosen').val();
    var ort = $('#txtOrt').val();
    var postnr = $('#txtPostnr').val();
    var tel = $('#txtTel').val();
    $.ajax({
        type: "POST",
        //url: "http://localhost:51118/ServiceBlack.asmx/uppdateraKontakt",
        url: "ServiceBlack.asmx/uppdateraKontakt",
        data: "{id: " + id + ", Foretag: '" + foretag + "', losenord: '" + losen + "', Adress:'" + adress + "', postnr:'" + postnr + "', ort:'" + ort + "', tel:'" + tel + "', epost:'" + epost + "', kontaktperson:'" + kontaktperson + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {
            swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });;
        }
    });
    function successFunction(data) {
        swal("Sparat!", "Sparat till databas!", "success");
    }
}
function forhandsgranska() {
    var ftgid = localStorage.foretag;
    //Nu fyller vi på dropdownlistan från databas
    //var urlLista = 'http://localhost:51118/ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
    var urlLista = 'ServiceBlack.asmx/getGrupper?foretagsid=' + ftgid;
    var sourceGruppdata = {
        type: "GET",
        datatype: "json",
        datafields: [
           { name: 'id', type: 'number' },
           { name: 'Grupp', type: 'string' }
        ],
        url: urlLista,
        cache: false,
        root: 'data'
    };
    //Förbered data för användning
    var dataAdapterGrupp = new $.jqx.dataAdapter(sourceGruppdata, {
        contentType: 'application/json; charset=utf-8',
        downloadComplete: function (data, textStatus, jqXHR) {
        
            return data.d;
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                  'textStatus: ' + textStatus + '\n' +
                  'errorThrown: ' + errorThrown);
            alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
        }
    }
    );
    // Skapa jqxDropDownList
    $("#DivDroppdown2").jqxDropDownList({
        source: dataAdapterGrupp, displayMember: "Grupp", valueMember: "id", width: 200, height: 25, placeHolder: "Välj grupp:"
    });
    $("#modalForhndsgranska").modal("show");
}
function Kor() {
    var ftgid = localStorage.foretag;
    var item = $("#DivDroppdown2").jqxDropDownList('getSelectedItem');
    var sHTML = '';
    var gruppID = $('#DivDroppdown2').jqxDropDownList('getItemByValue', item);
    $.ajax({
        type: "GET",
        url: "ServiceBlack.asmx/getShowBlackTv?ftgid=" + ftgid + "&grupp=" + gruppID.value,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {
            swal({ title: "Error!", text: msg.statusText, type: "error", confirmButtonText: "Stäng" });;
        }
    });
    function successFunction(data) {
        $.each(data.d, function (i, item) {
            sHTML = sHTML + '<div>' + item.info + '</div>';
        });
        /*In med divarna i förhandsgranskingen*/
        $('#granska').html(sHTML);
        $('.visa').slick({
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            centerMode: true,
            fade: true
        });
    }
}
function raderaGrupp() {
    swal({
        title: "Är du säker?",
        text: "Du kommer radera post permanent!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ja, radera!",
        closeOnConfirm: false
    },
function () {
   
    $.ajax({
        type: "POST",
        //url: "http://localhost:51118/ServiceBlack.asmx/RaderaGrupp",
        url: "ServiceBlack.asmx/RaderaGrupp",
        data: "{'id':" + datarecord.id + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: function (msg) {
            alert(msg.statusText);
        }
    });
    function successFunction(data) {
        $('#txtGrupp').val('');
        $('#txtInfo').val('');
        VisaGrupper();
        swal("Raderat!", "Gruppen är raderad.", "success");
    }
});

}
function Stop() {
    $('.visa').slick('unslick');
    $("#granska").empty();
}
function small() {
    $('#granska').height(600);
    $('#granska').width(800);
}
function medium() {
    $('#granska').height(800);
    $('#granska').width(1280);
}
function large() {
    $('#granska').height(720);
    $('#granska').width(1280);
}
function xlarge() {
    $('#granska').height(1080);
    $('#granska').width(1920);
    $('#modalForhndsgranska .modal-dialog').css({"height":"1100px","width":"2000px"});
}
function UpdateGrid() {
    var ftgid = localStorage.foretag;
    var url = 'http://blacktv.se/ServiceBlack.asmx/getShowBlackTvWEB?ftgid=' + ftgid;
    //var url = 'ServiceBlack.asmx/getTVjson?foretagsid=' + ftgid;
    var sourcekunddata = {
        type: "GET",
        datatype: "json",
        datafields: [
           { name: 'id', type: 'number' },
            { name: 'ForetagsID', type: 'number' },
            { name: 'Foretag', type: 'string' },
            { name: 'grupp', type: 'int' },
            { name: 'tag', type: 'string' },
            { name: 'Gruppnamn', type: 'string' },
            { name: 'info', type: 'string' }
        ],
        url: url,
        cache: false,
        root: 'data'
    };
    //Förbered data för användning
    var dataAdapterTV = new $.jqx.dataAdapter(sourcekunddata, {
        contentType: 'application/json; charset=utf-8',
        downloadComplete: function (data, textStatus, jqXHR) {
            return data.d;
        },
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                  'textStatus: ' + textStatus + '\n' +
                  'errorThrown: ' + errorThrown);
            alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
        }
    }
    );
    //Nu förbereder vi datagriden och visar den
    $("#BlackTVrader").jqxGrid(
   {
       source: dataAdapterTV,
       width: 700,
       height: 250,
       showstatusbar: false,
       statusbarheight: 50,
       showaggregates: false,
       theme: 'metrodark',
       groupable: true,
       selectionmode: 'singlerow',
       columns: [,
         { text: 'ID', datafield: 'id', width: 75, cellsalign: 'left', },
         { text: 'Företag', datafield: 'Foretag', width: 100, cellsalign: 'left' },
         { text: 'Grupp', datafield: 'Gruppnamn', width: 130, cellsalign: 'left' },
         { text: 'Tag', datafield: 'tag', width:250, cellsalign: 'left'}
         //{ text: 'TV info', datafield: 'info', width: 25, cellsalign: 'left' }
       ],
       groups: ['Gruppnamn']
      
   });
   
}
function zoomIn() {
    var scale = 'scale(0.8)';
    $('#modalForhndsgranska').css("zoom", "0.75");

}
function zoomOut() {
    var scale = 'scale(0.8)';
    $('#modalForhndsgranska').css("zoom", "1");
}