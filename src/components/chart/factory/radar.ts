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
  radar: {
    radius: "65%",
    center: ['50%', '50%'],
    nameGap: 5,
    splitNumber: 4,
    axisLine: {
      lineStyle: {
        color: "#E6E7EB"
      }
    },
    splitArea: {
      show: false
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
  option.series?.forEach((series: any, index: number) => {
    if(series.type === 'radar') {
      merge(series, {
        areaStyle: {
          color: defaultOption.color[index],
          opacity: 0.2
        }
      })
    }
  })
  return merge( cloneDeep(defaultOption), option)
}