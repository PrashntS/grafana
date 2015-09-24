var Annotations = {
    active: false,

    init: function () {
        "use strict";

        setInterval(function () {
            Annotations.Helper.status_update();
        }, 100);

        Annotations.Server.init();
    },

    Server: {
        BASE: "http://localhost:8000/",
        LOGU: "http://localhost:8000/log",
        STATE: "UNKNWN",

        init: function () {
            "use strict";
            $.getJSON(this.BASE, function (data) {
                if (data.ready) {
                    Annotations.Server.STATE = "Ready";
                }
                else {
                    Annotations.Server.STATE = "ERROR";
                }
            });
        },

        log: function (time_dict) {
            "use strict";
            var payload = {
                annotation_class: Annotations.Helper.value_select_dropdown_value("Annotations"),
                source_class: Annotations.Helper.value_select_dropdown_value("Motion Class"),
                from: time_dict.xaxis.from,
                to: time_dict.xaxis.to
            };

            Annotations.CURRENT_TAG = payload.annotation_class;
            Annotations.Server.STATE = "BUSY";

            $.ajax({
                url: Annotations.Server.LOGU,
                type: 'PUT',
                data: payload
            }).done(function(data) {
                Annotations.Server.STATE = "IDLE";
            }).fail(function(data) {
                Annotations.Server.STATE = "ERROR";
            });
        }

    },

    Helper: {
        value_select_dropdown_value: function (hook) {
            "use strict";
            var dat = $(".submenu-item").text();
            if (dat.indexOf(hook) > -1) {
                var re = new RegExp("[\\s]+" + hook + ":[\\s]+([\\w\\-\\_]+)[\\s]+", "g");
                return re.exec(dat)[1];
            }
        },

        status_update: function () {
            "use strict";
            var sta = "Annotation Server: " + Annotations.Server.BASE +
                      "(" + Annotations.Server.STATE + ")" + "<br>" +
                      "Tagging as: " + Annotations.CURRENT_TAG + ""
            $("#grafana_annotations").html(sta)
        },

        button_hook: function () {
            "use strict";
            if (!Annotations.active) {
                $("#grafana_annotations_btn").html("Annotation Active");
                Annotations.active = true;
            }
            else {
                $("#grafana_annotations_btn").html("Resume Annotation");
                Annotations.active = false;
            }
        }
    }

};
