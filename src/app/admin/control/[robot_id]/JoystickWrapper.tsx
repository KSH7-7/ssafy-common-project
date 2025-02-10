/* eslint-disable @typescript-eslint/no-require-imports */

const JoystickModule = require("react-joystick-component");
// default export가 있으면 사용, 없으면 전체 모듈을 사용합니다.
const Joystick = JoystickModule.default || JoystickModule;

export default Joystick;
