import {
  SET_LOADER_START,
  SET_LOADER_COMPLETE
} from '../../constants';

const setLoaderStart = (name) => {
  return {
    type: SET_LOADER_START,
    payload: {
      name,
      status: true
    }
  };
}


const setLoaderComplete = (name) => {
  return {
    type: SET_LOADER_COMPLETE,
    payload: {
      name,
      status: false
    }
  };
}

export { setLoaderStart, setLoaderComplete };