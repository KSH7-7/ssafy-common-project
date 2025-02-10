// src/types/react-joystick-component.d.ts

declare module 'react-joystick-component' {
    import { Component } from 'react';
  
    export interface JoystickProps {
      size?: number;
      baseColor?: string;
      stickColor?: string;
      move?: (event: JoystickEvent) => void;
      stop?: () => void;
    }
  
    export interface JoystickEvent {
      type: string;
      x: number;
      y: number;
      direction: string;
      distance: number;
    }
  
    export default class Joystick extends Component<JoystickProps> {}
  }
  