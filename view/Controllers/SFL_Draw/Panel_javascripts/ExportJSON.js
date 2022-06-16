// Download the HTML of tables 
function initialiseJSONDownload() {
    $('#DownloadJSON').click(function () {

        var OST_table_innerHTML = $('[id^="table"]').html();
        var TST_table_innerHTML = $('[id^="threeStrandTable"]').html();

        let cssTableStyling = '<style>' +
            'body{font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif; ' +
            'font-size :1.4rem; ' +
            'margin-top :26px;' +
            'text-align :center;' +
            'margin-bottom: 34px;' +
            '}' +
            'table{ width: 100%; ' +
            'overflow: auto;' +
            'margin-bottom: 1px;' +
            'margin-top: 12px;' +
            'display: table;' +
            'border-collapse: collapse;' +
            'border-spacing: 0;' +
            'border: none;' +
            'text-align: center;' +
            '}' +
            'table tr td{' +
            'padding: 0 0 0 56px; ' +
            'height: 48px;' +
            'font-size: 13px;' +
            'color: rgba(0, 0, 0, 0.87);' +
            'border-bottom: solid 1px #DDDDDD;' +
            'white-space: nowrap;' +
            'overflow: hidden;' +
            'text-overflow: ellipsis;' +
            '}' +
            'tr{    position: relative; ' +
            'margin-top: 1rem; ' +
            'margin-bottom: 1rem;' +
            'font-size: 12px;' +
            'border-bottom: 1px solid rgba(0,0,0,0.12);' +
            '}' +
            'table tr td{border: 2px solid black;' +
            'font-weight: bold;' +
            'color: black;' +
            '}' +

            '</style>';

        let htmlOfDownloadTables = "<table>" + OST_table_innerHTML + '</table><div></div><table> ' + TST_table_innerHTML + "</table>" + cssTableStyling;
        removeThisX = new RegExp('<td></td></tr>', "g");
        let source = filterTheTables(htmlOfDownloadTables)
        downloadInnerHtmlJSON(fileName2, source, 'html')
    })

}


function downloadInnerHtmlJSON(filename, source, mimeType) {
    var elHtml = source;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
}
var fileName2 = 'Box_Diagram.html'; // You can use the .txt extension if you want*/

