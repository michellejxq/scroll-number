import  { useEffect, useRef, useMemo, useState } from 'react';
import './index.less'

const config = {
  width: 16,
  height: 16,
  marginTop: 0,
}

// 计算Y轴偏移量
function calcOffsetY(currentActiveIndex: number, currentIndex: number, length: number) {
  // 获取配置中的数字高度和数字间距
  const height = config?.height;
  const marginTop = config?.marginTop;
  // 计算卡片高度
  const cardHeight = height + marginTop;
  // 计算中间索引
  const centerIndex = Math.floor(length / 2);
  // 判断当前索引是否在左半部分
  const isLeft = currentIndex < currentActiveIndex ? (currentActiveIndex - currentIndex <= centerIndex) : ((currentActiveIndex - (currentIndex - length)) <= centerIndex);
  const isCenter = currentIndex === currentActiveIndex;
  let step = 0;
  if (!isCenter) {
    if (isLeft) {
      if (currentIndex < currentActiveIndex) {
        step = currentIndex - currentActiveIndex;
      } else {
        step =  - (length - currentIndex) - currentActiveIndex
      }
    } else {
      if (currentIndex > currentActiveIndex) {
        step = currentIndex - currentActiveIndex;
      } else {
        step = currentIndex + length - currentActiveIndex;
      }
    }
  }
  // 计算偏移量
  const offset = step === 0 ? 0 : step * cardHeight
  // 返回偏移量
  return `translateY(${offset}px)`
}
function bindAnimation(currentActiveIndex: number, currentIndex: number, length: number,totalRepeat:number) {
  const centerIndex = Math.floor(length / 2);
  const isLeft = currentIndex < currentActiveIndex ? (currentActiveIndex - currentIndex <= centerIndex) : ((currentActiveIndex - (currentIndex - length)) <= centerIndex);
  const isCenter = currentIndex === currentActiveIndex;
  let step = 0;
  if (!isCenter) {
    if (isLeft) {
      if (currentIndex < currentActiveIndex) {
        step = currentIndex - currentActiveIndex;
      } else {
        step =  - (length - currentIndex) - currentActiveIndex
      }
    } else {
      if (currentIndex > currentActiveIndex) {
        step = currentIndex - currentActiveIndex;
      } else {
        step = currentIndex + length - currentActiveIndex;
      }
    }
  }
  const visible = Math.abs(step) <= length / totalRepeat;
  return visible ? `all 0.3s` : "none";
}

const ScrollNumber = ({ max, value,totalRepeat=3}: { max: number, value: number,totalRepeat:number }) => {
  const containerRef = useRef(null);
  // 计算前后重复次数
  const preValue = useRef(value);
  const length = useMemo(() => (max + 1) * totalRepeat, [max]);
  const [isInit, setInit] = useState(false);
  const [activeValue, setActiveValue] = useState(value);

  useEffect(() => {
    let newValue = value;
    if (!isInit) {
      setInit(true);
      newValue = value;
      preValue.current = newValue;
      setActiveValue(newValue)
      return;
    }
    // 如果value大于prevValue.current,需要继续向前滚动
    if (preValue.current < value) {
      preValue.current = value;
      setActiveValue(value);
      return
    }

    //如果value小于prevValue.current,需要继续向后滚动
    if (preValue.current > newValue) {
      //看prevValue.current是length的几倍
      const multiple = Math.floor(preValue.current / (max + 1));
      let calcValue = multiple * (max + 1) + value;
      // 算出和value相等的newValue，且newValue在newValue.current的后面
      if (calcValue > preValue.current && calcValue < length) {
        newValue = calcValue;
        preValue.current = newValue;
        setActiveValue(newValue);
        return
      }
      // calcValue < preValue.current
      calcValue = (multiple + 1) * (max + 1) + value;
      if (calcValue >= length) {
        newValue = 0 + value;
      }else{
        newValue = calcValue;
        
      }
      console.log('newValue', newValue);
      preValue.current = newValue;
      setActiveValue(newValue);

    }

  }, [value, max])
  const formattedValue = (i: number) => {
    return i.toString().padStart(2, '0');
  }
  return (
    <div ref={containerRef} className="scroll-number">
      <div className="scroll-number-wrapper">
        {Array.from({ length: length }, (_, i) => {
          const transform = calcOffsetY(activeValue, i, length);
          const transition = bindAnimation(activeValue, i, length,totalRepeat);
          return <div className="scroll-number-slide" key={i}  style={{ transform: transform, transition: transition }}>
            {formattedValue(i % (max + 1))}
          </div>
        })}
      </div>
    </div>
  );
};

export default ScrollNumber;