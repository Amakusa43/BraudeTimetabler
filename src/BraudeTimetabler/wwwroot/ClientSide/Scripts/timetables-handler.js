﻿/******************timetables handler************************/
var calculatingLabelInterval = null;
var datatable = null;
var noResultsMessage = "No Results. try to relax your constraints.";

function handleTimetablesSlide() {
    $('#timetablesContainer').hide();
    $("#myPager").empty();
    $("#errorMessageLbl").hide();
    $("#ratingLbl").text("");

    if (selectedCoursesList.length === 0) {
        setTimetablesErrorMessage("Please select at least one course");
        return;
    }

    var isClashes = $('#flatCheckBox').is(":checked");

    var freeD = $('#freeDays').slider("option", "value");
    var maxG = $('#maxGap').slider("option", "value");


    var calculatingObj = $('#calculatingLbl');
    calculatingObj.text("Calculating");

    if (calculatingLabelInterval) {
        clearInterval(calculatingLabelInterval);
    }

    calculatingLabelInterval = setInterval(function () {
            var prev = calculatingObj.text();
            var textToAdd = ".";

            calculatingObj.html(prev + textToAdd);
        },
        250);
    calculatingObj.show();

    var generateTimetablesInput = {
        ids: selectedCoursesList,
        clashes: isClashes,
        freeDays: freeD,
        maxGap: maxG
    };

    $.post("Home/GenerateTimetables", generateTimetablesInput, clientGenerateTimetablesResponseHandler);
}

function clientGenerateTimetablesResponseHandler(data, status) {

    clearInterval(calculatingLabelInterval);
    calculatingLabelInterval = null;
    $("#calculatingLbl").hide();

    if (!data || data.length === 0) {
        setTimetablesErrorMessage(noResultsMessage);
        return;
    }

    var timetables = [];
    for (var i = 0; i < data.length; ++i) {
        timetables[i] = JSON.parse(data[i]);
    }

    if (datatable === null)
        datatable = $('#timetablesTbl').DataTable(
            {
                "searching": false,
                "ordering": false,
                "lengthChange": false,
                "pageLength": 14,
                "language":
                {
                    "info": "מציג דף _PAGE_ מתוך _PAGES_",
                    "paginate":
                    {
                        "previous": "הקודם",
                        "first": "הראשון",
                        "last": "האחרון",
                        "next": "הבא"
                    }
                }
            });

    datatable.clear();

    $.each(timetables,
        function (j, timetable) {
            var timeslots = timetable.timeslotsMatrix;


            $.each(timeslots,
                function (i, item) {
                    datatable.row.add(item);

                }); //end of inner $each


        }); // end of outer $each 

    datatable.draw();
    $('#timetablesContainer').show();


}

function setTimetablesErrorMessage(msg) {
    $("#errorMessageLbl").show();
    $("#errorMessageLbl").text(msg);
}