$(document).ready(function () {
  startAFPTimeline();
});

function startAFPTimeline() {
  var last;
  console.log("AFP Timeline");
  jQuery.getJSON(c80.timelineafpurl, function (data) {
    if (isMobile()) {
      //console.log(isMobile());
      var tloptions = {
        language: "es",
        hash_bookmark: true,
        max_rows: 3,
        timenav_mobile_height_percentage: 25,
        timenav_height_min: 160,
        marker_height_min: 14,
      };
    } else {
      var tloptions = {
        language: "es",
        hash_bookmark: false,
        max_rows: 3,
        slide_padding_lr: 0,
      };
    }

    timelineObj = new TL.Timeline(
      "afp-timeline-js-container",
      data.afp,
      tloptions
    );

    var hash = window.location.hash.substr(1);

    timelineObj.on("hash_updated", function (data) {
      buildShareLinks(window.location);
      console.log(data);
    });

    timelineObj.on("change", function (data) {
      console.log("change");
      hash = data.unique_id;

      //updateHash(hash);
      //buildShareLinks(window.location);
    });
  });
}
