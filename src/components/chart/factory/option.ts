import { merge, cloneDeep } from "lodash"
const defaultOption = {
  color: ['#1664FF', '#C5D8FF'],
  title: {
    show: false
  },
  legend: {
    left: 0,
    top: 0,
    itemWidth: 15
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
    // formatter: (series: any) => {
    //   const name = series[0].name
    //   let relVal = '<div><p style="font-weight: 500; margin-bottom: 5px">' + name + '</p>';
    //   for (let i = 0, l = series.length; i < l; i++) {
    //       relVal += '<div>' + 
    //         '<span style="display: inline-block; margin-right: 5px; width: 10px; height: 10px; border-radius: 10px; background-color:' + series[i].color + '"></span>' +
    //         '<span>' + series[i].seriesName + '：</span>' + 
    //         '<span style="float: right">' + series[i].value + ('') + '</span></div>'
    //   }
    //   relVal += '<div> <div style="clear: both"></div>'
    //   return relVal
    // }
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
      textStyle: {
        color: '#60656E',
      },
      interval: 0
    }
  },
  yAxis: {
    type: 'value'
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

export default (option: any) => {
  option.series?.forEach((series: any) => {
    if(series.type === 'bar') {
      merge(series, {
        barMaxWidth: '30',
        barMinHeight:'5',
      })
    }
  })
  return merge( cloneDeep(defaultOption), option)
}