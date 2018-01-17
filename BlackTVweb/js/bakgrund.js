var GreyButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<i class="fa fa-sticky-note" style="color:grey;"/><b> Grå</b>',
        tooltip: 'Infoga grå bakgrund',
        click: function () {
            var node = document.createElement('span');
            node.innerHTML = '<div class="container-fluid" style="background-color: grey; height: 100vh;">Container för ditt innehåll</div>';
            context.invoke('editor.insertNode', node);
        }
    });

    return button.render();   // return button as jquery object 
}
//Svart bakgrund
var BlackButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<i class="fa fa-sticky-note" style="color:black;"/><b> Svart</b>',
        tooltip: 'Infoga svart bakgrund',
        click: function () {
            var node = document.createElement('span');
            node.innerHTML = '<div class="container-fluid" style="background-color: black; height: 100vh;">Container för ditt innehåll</div>';
            context.invoke('editor.insertNode', node);
        }
    });

    return button.render();   // return button as jquery object 
}
//Gulbakgrund
var YellowButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<i class="fa fa-sticky-note" style="color:yellow;"/><b> Gul</b>',
        tooltip: 'Infoga gul bakgrund',
        click: function () {
            var node = document.createElement('span');
            node.innerHTML = '<div class="container-fluid" style="background-color: yellow; height: 100vh;">Container för ditt innehåll</div>';
            context.invoke('editor.insertNode', node);
        }
    });

    return button.render();   // return button as jquery object 
}