(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  var months = ['1月', '2月', '3月', '4月', '5月', '6月'];

  // === Chart 1: 月度平均提成工资趋势 ===
  var chart1 = echarts.init(document.getElementById('chart-avg-trend'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, formatter: function (p) { return p[0].name + '<br/>平均提成工资: ¥' + p[0].value.toFixed(2); } },
    grid: { left: 60, right: 30, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    yAxis: { type: 'value', name: '金额 (元)', axisLine: { show: false }, splitLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    series: [
      {
        name: '平均提成工资', type: 'bar', data: [1138.90, 541.40, 1202.61, 1416.87, 1372.76, 1286.27],
        itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] }, barWidth: '40%',
        label: { show: true, position: 'top', color: muted, fontSize: 10, formatter: function (p) { return '¥' + p.value.toFixed(0); } }
      }
    ]
  });
  window.addEventListener('resize', function () { chart1.resize(); });

  // === Chart 2: 每月最高 vs 最低提成工资 ===
  var maxPersons = ['陈安然', '陈安然', '林佗贵', '林创武', '林佗贵', '林创武'];
  var minPersons = ['崔斯欣', '崔斯欣', '蒋能', '蒋能', '李亚景', '黄丽情'];
  var chart2 = echarts.init(document.getElementById('chart-max-min'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, formatter: function (p) {
      var s = p[0].name + '<br/>';
      p.forEach(function (item) { s += item.marker + ' ' + item.seriesName + ': ¥' + item.value.toFixed(2);
        if (item.seriesName === '最高提成') s += ' (' + maxPersons[item.dataIndex] + ')';
        else s += ' (' + minPersons[item.dataIndex] + ')';
        s += '<br/>';
      });
      return s;
    }},
    legend: { data: ['最高提成', '最低提成'], bottom: 0, textStyle: { color: muted } },
    grid: { left: 60, right: 30, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    yAxis: { type: 'value', name: '金额 (元)', axisLine: { show: false }, splitLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    series: [
      { name: '最高提成', type: 'bar', data: [1786.51, 917.52, 1780.81, 1797.06, 2266.32, 1802.65], itemStyle: { color: accent, borderRadius: [4, 4, 0, 0] } },
      { name: '最低提成', type: 'bar', data: [631.71, 124.19, 724.37, 705.56, 854.37, 467.25], itemStyle: { color: accent2, borderRadius: [4, 4, 0, 0] } }
    ]
  });
  window.addEventListener('resize', function () { chart2.resize(); });

  // === Chart 3: 个人月度提成工资热力图 ===
  var workers = ['吴兴义', '吴兴浪', '刘少东', '林佗贵', '林创武', '李亚景', '蒋能', '黄丽情', '崔斯欣', '迟喻阳', '陈安然'];
  var salaryData = [
    [937.99, 967.81, 976.49, 1523.12, 1151.78, 825.26, 733.43, 1777.84, 631.71, 1215.93, 1786.51],
    [435.25, 441.14, 483.64, 726.98, 872.06, 455.93, 229.08, 787.32, 124.19, 482.29, 917.52],
    [927.11, 1427.37, 1778.35, 1780.81, 880.55, 1016.57, 724.37, 972.82, 1019.56, 1241.74, 1459.48],
    [1453.19, 1519.79, 1119.09, 1549.24, 1797.06, 1401.00, 705.56, 1680.28, 1186.39, 1627.25, 1546.76],
    [1569.57, 1606.74, 2083.25, 2266.32, 1296.29, 854.37, 887.82, 937.22, 1041.89, 932.52, 1624.32],
    [1080.71, 1645.08, 1301.91, 1598.83, 1802.65, 1104.78, 953.86, 467.25, 1113.44, 1629.05, 1451.40]
  ];
  var heatData = [];
  for (var mi = 0; mi < months.length; mi++) {
    for (var wi = 0; wi < workers.length; wi++) {
      heatData.push([wi, mi, salaryData[mi][wi]]);
    }
  }
  var chart3 = echarts.init(document.getElementById('chart-heatmap'), null, { renderer: 'svg' });
  chart3.setOption({
    animation: false,
    tooltip: { appendToBody: true, formatter: function (p) { return workers[p.value[0]] + ' · ' + months[p.value[1]] + '<br/>提成工资: ¥' + p.value[2].toFixed(2); } },
    grid: { left: 80, right: 30, top: 20, bottom: 80 },
    xAxis: { type: 'category', data: workers, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted, rotate: 35, interval: 0 } },
    yAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    visualMap: { min: 124, max: 2266, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: [bg2, accent2, accent] }, textStyle: { color: muted } },
    series: [{
      type: 'heatmap', data: heatData,
      label: { show: true, color: ink, fontSize: 9, formatter: function (p) { return p.value[2].toFixed(0); } },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
    }]
  });
  window.addEventListener('resize', function () { chart3.resize(); });

  // === Chart 4: 个人6月平均提成工资排名 ===
  var personAvg = [
    { name: '林佗贵', value: 1574.06 },
    { name: '林创武', value: 1467.69 },
    { name: '陈安然', value: 1464.33 },
    { name: '刘少东', value: 1288.79 },
    { name: '吴兴浪', value: 1267.99 },
    { name: '迟喻阳', value: 1188.13 },
    { name: '黄丽情', value: 1070.29 },
    { name: '吴兴义', value: 1067.31 },
    { name: '李亚景', value: 943.10 },
    { name: '崔斯欣', value: 852.86 },
    { name: '蒋能', value: 739.02 }
  ];
  var sortedNames = personAvg.map(function (d) { return d.name; }).reverse();
  var sortedValues = personAvg.map(function (d) { return d.value; }).reverse();

  var chart4 = echarts.init(document.getElementById('chart-person-rank'), null, { renderer: 'svg' });
  chart4.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, formatter: function (p) { return p[0].name + '<br/>6个月平均提成工资: ¥' + p[0].value.toFixed(2); } },
    grid: { left: 80, right: 40, top: 20, bottom: 30 },
    xAxis: { type: 'value', name: '平均提成工资 (元)', axisLine: { show: false }, splitLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    yAxis: { type: 'category', data: sortedNames, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: ink } },
    series: [{
      type: 'bar', data: sortedValues, itemStyle: { color: accent, borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', color: muted, formatter: function (p) { return '¥' + p.value.toFixed(2); } },
      barWidth: '55%'
    }]
  });
  window.addEventListener('resize', function () { chart4.resize(); });

  // === Chart 5: 每月最高提成工资对比 ===
  var maxMonths = ['1月', '2月', '3月', '4月', '5月', '6月'];
  var maxValues = [1786.51, 917.52, 1780.81, 1797.06, 2266.32, 1802.65];
  var chart5 = echarts.init(document.getElementById('chart-max-compare'), null, { renderer: 'svg' });
  chart5.setOption({
    animation: false,
    tooltip: { trigger: 'axis', appendToBody: true, formatter: function (p) {
      return p[0].name + '<br/>最高提成: ¥' + p[0].value.toFixed(2);
    }},
    grid: { left: 70, right: 40, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: maxMonths, axisLine: { lineStyle: { color: rule } }, axisLabel: { color: muted } },
    yAxis: { type: 'value', name: '提成工资 (元)', axisLine: { show: false }, splitLine: { lineStyle: { color: rule } }, axisLabel: { color: muted }, max: 2400 },
    series: [{
      type: 'bar',
      data: maxValues,
      itemStyle: {
        color: function (params) {
          var ratio = params.value / 2400;
          var r = Math.round(37 + ratio * (37 - 37));
          var g = Math.round(99 + ratio * (130 - 99));
          var b = Math.round(235 + ratio * (80 - 235));
          return 'rgb(' + r + ',' + g + ',' + b + ')';
        },
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '45%',
      label: {
        show: true, position: 'top', color: ink, fontSize: 11, fontWeight: 600,
        formatter: function (p) { return '¥' + p.value.toFixed(0); }
      }
    }]
  });
  window.addEventListener('resize', function () { chart5.resize(); });
})();
