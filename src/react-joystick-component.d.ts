// src/types/react-joystick-component.d.ts

declare module 'react-joystick-component' {
    import { Component } from 'react';
  
    export interface JoystickProps {
      size?: number;
      baseColor?: string;
      stickColor?: string;
      move?: (event: JoystickEvent) => void;
      stop?: () => void;
      // 필요한 다른 props를 추가할 수 있습니다.
    }
  
    export interface JoystickEvent {
      type: string;
      x: number;
      y: number;
      direction: string;
      distance: number;
      // 필요한 다른 이벤트 속성을 추가할 수 있습니다.
    }
  
    export default class Joystick extends Component<JoystickProps> {}
  }
  