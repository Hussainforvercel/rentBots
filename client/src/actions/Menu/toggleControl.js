import {
  OPEN_TOGGLE_MENU,
  CLOSE_TOGGLE_MENU,
} from '../../constants';

const toggleOpen = () => {
  return {
    type: OPEN_TOGGLE_MENU,
    payload: {
      showMenu: true
    }
  };
}

const toggleClose = () => {
  return {
    type: CLOSE_TOGGLE_MENU,
    payload: {
      showMenu: false
    }
  };
}

export { toggleOpen, toggleClose };