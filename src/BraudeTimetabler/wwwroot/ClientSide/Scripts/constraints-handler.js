
$(document).ready(function() {

    var defaultValue = 2;
    $(".slider").each(function() {
        $(this).slider({
                max: 5,
                values: [defaultValue++]
            })
            .slider("pips",
                {
                    rest: "label"
                });
    });
})