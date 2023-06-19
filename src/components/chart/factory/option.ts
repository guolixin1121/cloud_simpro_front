import { merge, cloneDeep } from "lodash"
const defaultOption = {
  color: ['#4080FF', '#C5D8FF'],
  title: {
    show: false
  },
  legend: {
    left: 0,
    top: 0,
    itemWidth: 15,
    textStyle: {
      color: '#60656E'
    }
  },
  grid:{
    left: '2%',
    right: '2%',
    bottom: '5%',
    top: 40,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: (series: any) => {
      const name = series[0].name
      let relVal = '<div><p style="font-weight: 500; margin-bottom: 5px">' + name + '</p>';
      for (let i = 0, l = series.length; i < l; i++) {
          relVal += '<div>' + 
            '<span style="display: inline-block; margin-right: 5px; width: 10px; height: 10px; border-radius: 10px; background-color:' + series[i].color + '"></span>' +
            '<span>' + series[i].seriesName + '：</span>' + 
            '<span style="float: right">' + (series[i].value || 0) + ('') + '</span></div>'
      }
      relVal += '<div> <div style="clear: both"></div>'
      return relVal
    }
  },
  xAxis: {
    type: 'category',
    axisTick: {
        alignWithLabel: true
    },
    axisLine: {
      lineStyle: {
        color: '#E6E7EB',
      },
    },
    axisLabel: {
      color: '#60656E',
      interval: 0
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#60656E'
    }
  },
  radar: {
    radius: "70%",
    center: ['50%', '55%'],
    nameGap: 5,
    splitNumber: 3,
    axisLine: {
      lineStyle: {
        color: "#E6E7EB"
      }
    },
    axisName: {
      color: "#60656E",
      formatter: (str: string) => {
          const strArr = [];
          const maxLength = 10
          for (let i = 0; i < str.length; i += maxLength) {
              strArr.push(str.slice(i, i + maxLength))
          }
          return strArr.join("\n")
      }
    }
  }
}

const seriesOptions = {
  'bar': {
    barMaxWidth: '30',
    barMinHeight:'5',
  },
  'line': {
    // smooth: true
    // symbol: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAAH6Nf8rAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACqADAAQAAAABAAAACgAAAAA7eLj1AAAA10lEQVQYGVVQOwrCQBScBLG0EFMJWniFtAEv4HFs4q3iBWy00QMoWKhgBCMWlmLynNk1IS6878z77APaz8xSUOVS5rz1Xq4PEtos2B7N3h8gYFSyOhQvqSozIac7IwIhkfnlAYh6fbopykHsjJJTkjpRqkzlaiNAzW1zcDi6HSCe4ObrfQ5Rzzk79VuI/XtayT8mUorvWMPelsLE0pyMdnYumjV9NfWwD4wjFy41O5ZbvFziT7VysTrqXyveLNQBalALjwYcGaAiPm06qEBrUHQUiXx/HLK+6NzBHgInSS4AAAAASUVORK5CYII='
  },
  'pie': {
    radius: ['35%', '55%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2
    }
  }
}

export default (option: any) => {
  option.series?.forEach((series: any) => {
    const config = seriesOptions[series.type as keyof typeof seriesOptions]
    merge(series, config)
  })
  option = merge(cloneDeep(defaultOption), option)
  
  return option
}