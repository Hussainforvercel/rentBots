const inputTextLimit = 250;
const inputDescLimit = 10000;
const fieldEmailTester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const validateEmail = (email) => {
  return !fieldEmailTester.test(email);
};

export { inputTextLimit, inputDescLimit, validateEmail };