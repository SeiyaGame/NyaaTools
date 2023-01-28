// ==UserScript==
// @name        NyaaTools
// @description Adds a "Download" button which downloads all selected torrents and more tweeks
// @author      SeiyaGame
// @homepage    https://github.com/SeiyaGame/NyaaTools
// @updateURL   https://raw.githubusercontent.com/SeiyaGame/NyaaTools/main/nyaa_download_torrents.js
// @downloadURL https://raw.githubusercontent.com/SeiyaGame/NyaaTools/main/nyaa_download_torrents.js
// @version     1.5.0
// @grant       none
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @include     *nyaa.si/*
// @exclude     *nyaa.si/rules
// @exclude     *nyaa.si/help
// @exclude     *nyaa.si/upload
// ==/UserScript==

// we redefine the colors of the table
var css = document.createElement("style");
css.setAttribute("type", "text/css");
css.innerHTML = "table.torrent-list td:nth-child(6), body.dark table.torrent-list > tbody > tr.success > td:nth-child(6), body.dark table.torrent-list > tbody > tr.danger > td:nth-child(6) { color: #CBCBCB !important; } \
                table.torrent-list td:nth-child(7), body.dark table.torrent-list > tbody > tr.success > td:nth-child(7), body.dark table.torrent-list > tbody > tr.danger > td:nth-child(7) { color: green !important; } \
                table.torrent-list td:nth-child(8), body.dark table.torrent-list > tbody > tr.success > td:nth-child(8), body.dark table.torrent-list > tbody > tr.danger > td:nth-child(8) { color: red !important; }";
document.head.appendChild(css);

function torrentAll() {
    const $torrentRows = $("table.torrent-list tbody tr:has(.ckbox:checked)");

    $torrentRows.each(function () {
        const $downloadLink = $("a[href*='/download']", this);
        const $viewLink = $("a[href*='/view']", this);

        if (!$downloadLink.length || !$viewLink.length) return;
        const $link = $downloadLink.attr("href");
        const $filename = $viewLink.attr("title") + ".torrent";

        fetch($link)
            .then(response => response.blob())
            .then(blob => {
                const $a = document.createElement('a');
                $a.href = URL.createObjectURL(blob);
                $a.download = $filename;
                document.body.appendChild($a);
                $a.click();
                $a.remove();
            });
    });
}

// Add checkbox to table header
$("table.torrent-list thead tr").prepend("<th class='hdr-select text-center' style='width: 10px'><input type='checkbox' id='select-all'></th>");
$("table.torrent-list tbody tr").each(function () {
    $(this).prepend("<td class='row-select text-center'><input class='ckbox' type='checkbox'></td>");
});

// Widen search input field
$(".form-control.search-bar").css("width", "455px");

// Add 'Download all/selected' button to page
if (document.getElementById("torrent-all") == null) {
    $(".nav.navbar-nav.navbar-right").append("<li><button style='margin-top: 9px' class='btn btn-primary' id='torrent-all'>Download</button></li>");
    document.getElementById("torrent-all").addEventListener('click', function () {
        if (confirm("This process cannot be stopped. Are you sure you want to download the selected files?")) {
            torrentAll();
        }
    }, false);
}

// Add event listener to select all checkbox
$("#select-all").click(function () {
    // Check/uncheck all checkboxes in the table rows
    $("table.torrent-list tbody tr .ckbox").prop("checked", $(this).prop("checked"));
});