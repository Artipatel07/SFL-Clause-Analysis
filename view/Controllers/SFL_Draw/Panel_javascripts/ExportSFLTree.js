function initialiseDownload() {
    $('#DownloadSFLTree').click(function () {
        //get svg element.
        var svg = document.getElementById("svgTree-0");

        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);

        downloadInnerHtml(fileName, source, 'svg');
        //you can download svg file by right click menu.
    });


    function downloadInnerHtml(filename, source, mimeType) {
        var elHtml = source;
        var link = document.createElement('a');
        mimeType = mimeType || 'text/plain';

        link.setAttribute('download', filename);
        link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
        link.click();
    }
    var fileName = 'tree.svg'; // You can use the .txt extension if you want
}


