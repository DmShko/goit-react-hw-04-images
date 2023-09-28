import { useState, useEffect, useRef } from 'react';

import lo from './Loader.module.css';

export const Loader = () => {
  // state = {
  //   counter: 0,
  // };
  const counterRef = useRef();

  const [ state, setCounter ] = useState({counter: 0,});
  // componentDidMount() {
  //   this.change();
  // }
  useEffect(() => {
    if (counterRef.current !== state) 
    {
      counterRef.current = state;
      change();
    }
  }, [state]);
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.counter !== this.state.counter) this.change();
  // }

  const change = () => {
    setTimeout(() => {
      state.counter < 3
        ? setCounter(value => ({ counter: value.counter + 1 }))
        : setCounter({counter: 0,});
    }, 200);
  };

  return (
    <div className={lo.element}>
      <div
        className={
          this.state.counter === 1 ? `${lo.scale} ${lo.circle}` : lo.circle
        }
      ></div>
      <div
        className={
          this.state.counter === 2 ? `${lo.scale} ${lo.circle}` : lo.circle
        }
      ></div>
      <div
        className={
          this.state.counter === 3 ? `${lo.scale} ${lo.circle}` : lo.circle
        }
      ></div>
    </div>
  );
}

