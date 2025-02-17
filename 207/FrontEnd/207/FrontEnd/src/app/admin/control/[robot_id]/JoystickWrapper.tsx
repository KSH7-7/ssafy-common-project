/* eslint-disable @typescript-eslint/no-require-imports */
// JoystickWrapper.tsx

const JoystickModule = require("react-joystick-component");

// `JoystickModule`이 객체이므로, 실제로 `Joystick`을 꺼내야 함
const Joystick = JoystickModule.Joystick ?? JoystickModule.default ?? JoystickModule;

export default Joystick;
