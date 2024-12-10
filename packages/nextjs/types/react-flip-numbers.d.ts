declare module 'react-flip-numbers' {
    import { Component } from 'react';
  
    interface FlipNumbersProps {
      height: number;
      width: number;
      color: string;
      background: string;
      play: boolean;
      numbers: string;
    }
  
    export default class FlipNumbers extends Component<FlipNumbersProps> {}
  }