var keyCount = 0;
//$('#myTabs a[href="#clock"]').hide();
window.onkeydown = konami;

function konami(e) {
    var keycode = e.which || e.keyCode;
    if (e.keyCode === 38 && keyCount === 0) {
        keyCount++;
    } else if (e.keyCode === 38 && keyCount === 1) {
        keyCount++;
    } else if (e.keyCode === 40 && keyCount === 2) {
        keyCount++;
    } else if (e.keyCode === 40 && keyCount === 3) {
        keyCount++;
    } else if (e.keyCode === 37 && keyCount === 4) {
        keyCount++;
    } else if (e.keyCode === 39 && keyCount === 5) {
        keyCount++;
    } else if (e.keyCode === 37 && keyCount === 6) {
        keyCount++;
    } else if (e.keyCode === 39 && keyCount === 7) {
        keyCount++;
    } else if (e.keyCode === 66 && keyCount === 8) {
        keyCount++;
    } else if (e.keyCode === 65 && keyCount === 9) {
        keyCount = 0;
        $('#myTabs a[href="#clock"]').show();
        $('#myTabs a[href="#clock"]').focus();
        $('#myTabs a[href="#clock"]').tab('show');
        $('#myTabs a[href="#clock"]').blur();
    } else {
        keyCount = 0;
    }
}

drawClock("JJclockChart", '/img/JJclock.png', ["#00AA90", "#00896C", "#F2B42B", "#F2B42B"], true);
drawClock("BonComeclockChart", '/img/BonComeclock.png', ["#D83040", "#801020", "#801020", "#D83040"], false);