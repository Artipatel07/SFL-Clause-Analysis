let docText = ''

function setupReaderDoc(content) {
    var doc = new Docxgen(content);
    text = doc.getFullText();
    console.log(text);
}

//APP
var App = {};
App.init = function () {
    //Init


    /*When files selected or droped make it aninimate the load*/
    function handleFileSelect2(evt) {
        var files = evt.target.files; // FileList object
        var type = files[0].name.substring(files[0].name.indexOf('.'), files[0].name.length);
        if (type != '.pdf' && type != '.txt' && type != '.docx' && type != '.doc') {
            console.log(type)
            alert('Please upload a pdf or txt file')
        }
        else {
            //console.log(files.length) // number of files
            //var contents = evt.target.result;
            //console.log(contents)
            //files template
            var template = "" + Object.keys(files).
                map(function (file) {
                    return "<div class=\"file file--" + file + "\">\n     <div class=\"name\"><span>" +
                        files[file].name + "</span></div>\n     <div class=\"progress2 active\"></div>\n     <div class=\"done2\">\n\t<a href=\"\" target=\"_blank\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\">\n\t\t<g><path id=\"path\" d=\"M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z\"</g>\n\t\t</svg>\n\t\t\t\t\t\t</a>\n     </div>\n    </div>";
                }).


                join("");

            $("#drop2")[0].classList.add("hidden");
            $("#footer2")[0].classList.add("hasFiles");
            $(".importar2")[0].classList.add("active");
            setTimeout(function () {
                $(".list-files2")[0].innerHTML = template;
            }, 1000);

            Object.keys(files).forEach(function (file) {
                var load = 2000 + file * 2000; // fake load
                setTimeout(function () {
                    $(".file--" + file)[0].querySelector(".progress2").classList.remove("active");
                    $(".file--" + file)[0].querySelector(".done2").classList.add("anim");
                }, load);

                var control = $('#fileUpload');

            });

            for (var i = 0; i < files.length; i++) {
                var type = files[i].name.substring(files[i].name.lastIndexOf('.'), files[i].name.length);
                console.log(type)
                var text = '';
                if (type == '.txt') { text = setupReaderTXT(files[i]); }
                if (type == '.pdf') { text = setupReaderPDF(files[i]); }
                if (type == '.doc' || type == '.docx') { text = setupReaderDOC(files[i]); };

            }


        }

    }

    function setupReaderTXT(file) {
        var name = file.name;
        var reader = new FileReader();
        reader.readAsText(file); //for txt  important

        reader.addEventListener("load", function (event) {
            var contents = event.target.result;  //for txt  important  
            var fileInfo = { 'Name': name, 'Content': contents, "Clauses": [] };

            assignmentFiles.push(fileInfo);
            $('#OnefileContents').html(contents)
            fileToUpload.Name = name;
            fileToUpload.Contents = contents;
            fileToUpload.Clauses = [];
            console.log(fileInfo);

        });
        //reader.readAsArrayBuffer(file);
        reader.onerror = function (evt) {

            console.error("File could not be read! Code " + evt.target.error.code);
        };
    }



    /// Doc and Docx converter

    async function setupReaderDOC(file) {

        var name = file.name;
        await convertDocFile();

    }



    function convertDocFile() {
        var form = $('#fileForm');
        form.submit();
        return docText;
    }

    $('#fileForm').submit(
        function (e) {
            $.ajax({
                url: port2 + 'Class/Teacher/EditAssignment/ConvertDoc',
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function (result) {
                    console.log(result)
                    docText = result
                    var fileInfo = { 'Name': name, 'Content': docText, "Clauses": [] };
                    assignmentFiles.push(fileInfo);
                    fileToUpload.Name = name;
                    fileToUpload.Contents = docText;
                    fileToUpload.Clauses = [];
                    $('#OnefileContents').html(docText);
                    //$("#div1").html(str);
                }
            });
            e.preventDefault();
        }
    );

    function setupReaderPDF(file) {
        var name = file.name;
        var reader = new FileReader();
        //reader.readAsText(file); //for txt  important
        var textOfPdf = '';
        reader.addEventListener("load", function (event) {
            // var contents = event.target.result;  //for txt  important      
            //console.log("Contents: " + contents) //for txt  important


            var typedarray = new Uint8Array(this.result);
            PDFJS.getDocument(typedarray).then(function (pdf) {
                // do stuff
                var pdfDocument = pdf;
                var pagesPromises = [];

                for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
                    // Required to prevent that i is always the total of pages
                    (function (pageNumber) {
                        pagesPromises.push(getPageText(pageNumber, pdfDocument));
                    })(i + 1);
                }

                Promise.all(pagesPromises).then(function (pagesText) {
                    // Remove loading
                    $("#loading-info").remove();

                    // Render text
                    for (var i = 0; i < pagesText.length; i++) {
                        textOfPdf += pagesText[i];
                        //console.log(pagesText[i]) //where all contents are stored
                        //$("#pdf-text").append("<div><h3>Page "+ (i + 1) +"</h3><p>"+pagesText[i]+"</p><br></div>")
                    }
                    var fileInfo = { 'Name': name, 'Content': textOfPdf };
                    //console.log(fileInfo.Content)
                    assignmentFiles.push(fileInfo);
                    fileToUpload.Name = name;
                    fileToUpload.Contents = textOfPdf;
                    fileToUpload.Clauses = [];
                    $('#OnefileContents').html(textOfPdf)
                });


            }, function (reason) {
                // PDF loading error
                console.error(reason);

            });
        });
        reader.readAsArrayBuffer(file);
        reader.onerror = function (evt) {

            console.error("File could not be read! Code " + evt.target.error.code);
        };

    }

    function getPageText(pageNum, PDFDocumentInstance) {
        // Return a Promise that is solved once the text of the page is retrieven
        return new Promise(function (resolve, reject) {
            PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
                // The main trick to obtain the text of the PDF page, use the getTextContent method
                pdfPage.getTextContent().then(function (textContent) {
                    var textItems = textContent.items;
                    var finalString = "";

                    // Concatenate the string of the item to the final string
                    for (var i = 0; i < textItems.length; i++) {
                        var item = textItems[i];

                        finalString += item.str + " ";
                    }

                    // Solve promise with the text retrieven from the page
                    resolve(finalString);
                });
            });
        });
    }
    // input change
    $("#fileUpload").change(function (evt) {
        if ($('#fileUpload').val() == '') {
            $('#EditFileForAnalysis').addClass('disabled');
            inputFileIsInputed = false
            $('#UploadFileCrumb').removeClass('is-complete').addClass('is-active');
        }
        else {
            $('#EditFileForAnalysis').removeClass('disabled');
            inputFileIsInputed = true;
            $('#UploadFileCrumb').removeClass('is-active').addClass('is-complete');
        }
        handleFileSelect2(evt)
    });
    //functions to this might be in vs code. 
}();

$('#updateTheseFiles').click(function () {
    $('#fileUpload').val('');
    assignmentFiles = [];

    if ($('#fileUpload').val() == '') {
        $('#EditFileForAnalysis').addClass('disabled');
        inputFileIsInputed = false
        $('#UploadFileCrumb').removeClass('is-complete').addClass('is-active');
        $('#IndentifyClusesCrumb').removeClass('.is-active').removeClass('.is-complete');
        $('#clauseTable').html('')
    }
    else {
        $('#EditFileForAnalysis').removeClass('disabled');
        inputFileIsInputed = true;
        $('#UploadFileCrumb').removeClass('is-active').addClass('is-complete');
        $('#IndentifyClusesCrumb').removeClass('is-complete').addClass('is-active');
    }


});
