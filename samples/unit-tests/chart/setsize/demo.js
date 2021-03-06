/* eslint func-style:0 */


QUnit.test('setSize parameters', function (assert) {

    document.getElementById('container').style.height = '400px';
    document.getElementById('container').style.width = '600px';

    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        series: [{
            type: 'column',
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Initial width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Initial height'
    );

    // Missing first parameter
    chart.setSize(undefined, 300);

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        300,
        'Height'
    );

    // Undefined height => preserve current setting
    chart.setSize(undefined, undefined);

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        300,
        'Height'
    );

    // Reset height to auto
    chart.setSize(undefined, null);

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height'
    );

    // Set width
    chart.setSize(300);

    assert.strictEqual(
        chart.chartWidth,
        300,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height'
    );

    // Undefined width => preserve current width
    chart.setSize(undefined);

    assert.strictEqual(
        chart.chartWidth,
        300,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height'
    );

    // Auto width
    chart.setSize(null);

    assert.strictEqual(
        chart.chartWidth,
        600,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height'
    );

    // Test that it responds to reflow
    $('#container').width(700);
    chart.reflow();

    assert.strictEqual(
        chart.chartWidth,
        700,
        'Width'
    );

    assert.strictEqual(
        chart.chartHeight,
        400,
        'Height'
    );

});

QUnit.test('3D pies stay in place on redraw (#5350)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },
            width: 600,
            height: 400,
            borderWidth: 1
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            type: 'pie',
            data: [1, 4, 2, 5]
        }]
    });


    var x = chart.series[0].points[0].graphic.getBBox().x;

    assert.strictEqual(
        typeof x,
        'number',
        'Pie has an X position'
    );

    chart.setSize(400, 400, false);

    assert.ok(
        chart.series[0].points[0].graphic.getBBox().x < x,
        'Pie has moved'
    );


});

QUnit.test('Titles with useHTML: true adjust chart after resize (#3481)', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 800,
                height: 400,
                animation: false
            },
            title: {
                useHTML: true,
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel elit at nulla mollis dictum vel vel lectus. Aenean blandit scelerisque nunc. Quisque blandit ligula bibendum enim consectetur, et dignissim eros volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie mauris sed nibh pulvinar, sed commodo metus sodales. Mauris congue quam ultrices suscipit dictum."
            },
            subtitle: {
                useHTML: true,
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel elit at nulla mollis dictum vel vel lectus. Aenean blandit scelerisque nunc. Quisque blandit ligula bibendum enim consectetur, et dignissim eros volutpat."
            },

            series: [{
                data: [1, 2, 3]
            }]
        }),
        plotTop = chart.plotTop;

    // smaller
    chart.setSize(600, 400);

    assert.ok(
        plotTop < chart.plotTop,
        'plot top adjusted'
    );

    // back to start
    chart.setSize(800, 400);

    assert.strictEqual(
        chart.plotTop,
        plotTop,
        'plot top back to start'
    );

    // bigger
    chart.setSize(1000, 400);

    assert.ok(
        plotTop > chart.plotTop,
        'plot top adjusted'
    );
});

QUnit.test('Columns were cut by cliprect, when resizing chart during initial animation.', function (assert) {

    // Hijack animation
    var clock = lolexInstall();


    var temp = [],
        rain = [],
    // Nearest hour to now
        done = assert.async(),
        chart;

    for (var i = 0; i < 24; i++) {
        temp.push([
            i * 3600000,
            Math.random()
        ]);
        rain.push([
            i * 3600000,
            Math.random()
        ]);
    }

// create the chart
    $('#container').highcharts('StockChart', {
        chart: {
            animation: false,
            width: 550
        },
        yAxis: [{
            height: '63%'
        }, {
            top: '80%',
            height: '20%',
            offset: 0
        }],

        series: [{
            data: temp,
            yAxis: 0
        }, {
            type: 'column',
            data: rain,
            animation: true,
            yAxis: 1
        }]
    });

    setTimeout(function () {
        chart = $('#container').highcharts();

        chart.setSize(700, 450);

        assert.strictEqual(
            chart.series[1].clipBox.width,
            chart.series[1].xAxis.len,
            'Correct clipbox width.'
        );
        done();
    }, 10);

    lolexRunAndUninstall(clock);
});

QUnit.test('Polar chart resize (#5220)', function (assert) {
    var chart;
    $('#container').highcharts({

        chart: {
            polar: true,
            width: 400,
            height: 400
        },

        title: {
            text: 'Highcharts Polar Chart'
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        yAxis: {
            min: 0
        },

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [{
            type: 'column',
            name: 'Column',
            data: [8, 7, 6, 5, 4, 3, 2, 1],
            pointPlacement: 'between'
        }, {
            type: 'line',
            name: 'Line',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }, {
            type: 'area',
            name: 'Area',
            data: [1, 8, 2, 7, 3, 6, 4, 5]
        }]
    });

    chart = $('#container').highcharts();

    assert.strictEqual(
        chart.container.querySelector('svg').getAttribute('width'),
        '400',
        'Chart has correct width'
    );

    chart.setSize(70, 70, false);

    assert.strictEqual(
        chart.container.querySelector('svg').getAttribute('width'),
        '70',
        'Chart has correct width after setSize to smaller'
    );

    chart.setSize(500, 500, false);

    assert.strictEqual(
        chart.container.querySelector('svg').getAttribute('width'),
        '500',
        'Chart has correct width after setSize to larger'
    );

});