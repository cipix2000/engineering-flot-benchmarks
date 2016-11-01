/*global $, HistoryBuffer*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var plots = 1;
    var samples = 5000;
    var historyBuffer = new HistoryBuffer(100 * samples, plots);
    historyBuffer.push(1);
    historyBuffer.push(2);
    historyBuffer.push(3);
    var globalIndex = 0;
    var chartStep = 0.0001;
    var tarray = [];

    function updateData() {
        var sin, cos, sin1, tan;

        for (var i = 0; i < samples; i++) {
            sin = Math.sin((globalIndex + i) * chartStep);

            for (var j=0 ; j < plots; j++) {
                tarray[j] = sin + 5*j;
            }

            if (plots > 1) {
                historyBuffer.push(tarray);
            } else {
                historyBuffer.push(sin);
            }
        }

        globalIndex += samples;
    }

    plot = $.plot('#placeholder', [], {
        series: {
            historyBuffer,
            lines: {
                show: true,
                //lineWidth: 1
            },
            shadowSize: 0
        },
        legend: {
            show: false
        }
    });

    setInterval(updateData, 1);
});
